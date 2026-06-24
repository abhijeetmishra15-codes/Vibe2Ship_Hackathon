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

-- 5. Create storage policy for issue-media bucket if missing
-- Ensure users can upload and view images/videos in the 'issue-media' bucket
CREATE POLICY "Allow public uploads to issue-media bucket" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'issue-media');

CREATE POLICY "Allow public read access to issue-media bucket" ON storage.objects
  FOR SELECT USING (bucket_id = 'issue-media');

