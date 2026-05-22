-- Disable RLS for contact_messages table (simplest solution)
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;

-- Alternative: Enable RLS and add a policy to allow inserts
-- Uncomment below if you prefer to keep RLS enabled:

-- ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- -- Allow anonymous inserts
-- CREATE POLICY "Enable insert for all users" ON contact_messages
--   FOR INSERT WITH CHECK (true);

-- -- Allow reads for authenticated users (for admin)
-- CREATE POLICY "Enable read for authenticated users" ON contact_messages
--   FOR SELECT USING (auth.role() = 'authenticated');

-- -- Allow updates for authenticated users (for admin)
-- CREATE POLICY "Enable update for authenticated users" ON contact_messages
--   FOR UPDATE USING (auth.role() = 'authenticated');

-- Disable RLS for projects table as well (for admin operations)
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
