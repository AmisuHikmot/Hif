-- Add support for event images and media

CREATE TABLE IF NOT EXISTS event_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  thumbnail_url text,
  display_order integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  
  UNIQUE(event_id, image_url)
);

-- Enable RLS
ALTER TABLE event_images ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view event images" ON event_images
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage event images" ON event_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Add image_url column to events if it doesn't exist
ALTER TABLE events
ADD COLUMN IF NOT EXISTS image_url text;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_event_images_event_id ON event_images(event_id);
CREATE INDEX IF NOT EXISTS idx_event_images_featured ON event_images(is_featured) WHERE is_featured = true;
