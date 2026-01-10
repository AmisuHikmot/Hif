-- Add image support to programs table

ALTER TABLE programs
ADD COLUMN IF NOT EXISTS featured_image_url text;

-- Update RLS policy if needed
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view programs" ON programs;
DROP POLICY IF EXISTS "Authenticated users can manage programs" ON programs;

CREATE POLICY "Anyone can view programs" ON programs
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage programs" ON programs
  FOR ALL USING (
    auth.uid() IS NOT NULL
  );
