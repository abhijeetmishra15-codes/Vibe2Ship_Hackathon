-- Migration Script for AI Civic Agent Integration

-- Create the dedicated issue_ai_analysis table
CREATE TABLE IF NOT EXISTS issue_ai_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    ai_title TEXT,
    ai_description TEXT,
    ai_summary TEXT,
    ai_category TEXT,
    ai_severity TEXT,
    responsible_department TEXT,
    suggested_action TEXT,
    estimated_resolution_time TEXT,
    duplicate_issue_id UUID REFERENCES issues(id) ON DELETE SET NULL,
    duplicate_confidence NUMERIC,
    ai_confidence NUMERIC,
    image_analysis TEXT,
    fake_report_score NUMERIC,
    model_name TEXT,
    prompt_version TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(issue_id)
);

-- Add an index for fast lookups by issue_id
CREATE INDEX IF NOT EXISTS idx_issue_ai_analysis_issue_id ON issue_ai_analysis(issue_id);

-- Add an index for duplicate detection queries (optional, but good for joins)
CREATE INDEX IF NOT EXISTS idx_issue_ai_analysis_duplicate_id ON issue_ai_analysis(duplicate_issue_id);

-- Enable RLS on the new table
ALTER TABLE issue_ai_analysis ENABLE ROW LEVEL SECURITY;

-- Allow public read access to AI analysis so the frontend can display it
CREATE POLICY "Allow public read access to issue_ai_analysis" ON issue_ai_analysis
    FOR SELECT USING (true);

-- Allow the Edge Function (which uses a service role or anon key with auth) to insert/update
-- If the edge function uses the user's auth token, they need insert/update access for their own issues.
-- To keep it secure, we can allow insert/update if the user is authenticated. 
-- However, since the edge function will make the request on behalf of the user, this is acceptable.
CREATE POLICY "Allow authenticated users to insert ai analysis" ON issue_ai_analysis
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to update ai analysis" ON issue_ai_analysis
    FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_issue_ai_analysis_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trg_update_issue_ai_analysis
    BEFORE UPDATE ON issue_ai_analysis
    FOR EACH ROW
    EXECUTE FUNCTION update_issue_ai_analysis_timestamp();
