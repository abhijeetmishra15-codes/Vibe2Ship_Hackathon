-- 1. Ensure profiles table has a points column with a default of 0
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;

-- 2. Ensure existing profiles that might have NULL points are initialized to 0
UPDATE profiles SET points = 0 WHERE points IS NULL;

-- 3. Create or replace the atomic increment_points RPC function
CREATE OR REPLACE FUNCTION increment_points(user_id UUID, value INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_points INTEGER;
BEGIN
  UPDATE profiles
  SET points = COALESCE(points, 0) + value
  WHERE id = user_id
  RETURNING points INTO new_points;
  
  RETURN new_points;
END;
$$;

-- 4. Enable RLS on issues table and add permissive policies for the application
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to insert issues" ON issues
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to issues" ON issues
  FOR SELECT USING (true);

CREATE POLICY "Allow owners, verifiers, and admins to update issues" ON issues
  FOR UPDATE TO authenticated
  USING (
    created_by = auth.uid()
    OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('verifier', 'admin')
  )
  WITH CHECK (
    created_by = auth.uid()
    OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('verifier', 'admin')
  );

-- 5. Create storage policy for issue-media bucket if missing
-- Ensure users can upload and view images/videos in the 'issue-media' bucket
CREATE POLICY "Allow public uploads to issue-media bucket" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'issue-media');

CREATE POLICY "Allow public read access to issue-media bucket" ON storage.objects
  FOR SELECT USING (bucket_id = 'issue-media');

-- 6. Trigger to prevent direct points modification by non-admin roles (authenticated / anon)
CREATE OR REPLACE FUNCTION protect_profile_points()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.points IS DISTINCT FROM OLD.points AND CURRENT_USER IN ('authenticated', 'anon') THEN
    RAISE EXCEPTION 'Security Error: Direct modification of points is not allowed.';
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trg_protect_profile_points
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION protect_profile_points();

-- 7. Enable Realtime for profiles table by adding it to the supabase_realtime publication if missing
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_rel pr
      JOIN pg_class c ON c.oid = pr.prrelid
      WHERE pr.prpubid = (SELECT oid FROM pg_publication WHERE pubname = 'supabase_realtime')
      AND c.relname = 'profiles'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
    END IF;
  END IF;
END $$;


