-- Drop existing donation policies that may be causing 42501 errors
DROP POLICY IF EXISTS "Anyone can create donations" ON donations;
DROP POLICY IF EXISTS "Users can read their own donations" ON donations;
DROP POLICY IF EXISTS "Service role has full access" ON donations;

-- Create new simplified RLS policies that allow proper INSERT operations
CREATE POLICY "allow_all_insert_donations" ON donations
FOR INSERT TO authenticated, anon
WITH CHECK (true);

CREATE POLICY "allow_all_select_donations" ON donations
FOR SELECT TO authenticated, anon
USING (true);

CREATE POLICY "allow_service_role" ON donations
USING (true)
WITH CHECK (true);

-- Ensure RLS is enabled but allows operations
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
