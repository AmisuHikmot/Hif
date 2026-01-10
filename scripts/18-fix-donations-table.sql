-- Ensure proper RLS on donations table

ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can create donations" ON donations;
DROP POLICY IF EXISTS "Admins can view all donations" ON donations;
DROP POLICY IF EXISTS "Users can view their own donations" ON donations;
DROP POLICY IF EXISTS "Users can view their donations" ON donations;
DROP POLICY IF EXISTS "Anyone can create donations" ON donations;

-- Recreate with proper policies
CREATE POLICY "Anyone can create donations" ON donations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own donations" ON donations
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can view all donations" ON donations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage donations" ON donations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
