-- Ramadan Feature Tables

-- 1. Ramadan Daily Reminders Table
CREATE TABLE IF NOT EXISTS ramadan_daily_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_number INTEGER NOT NULL UNIQUE, -- 1-30 for each day of Ramadan
  reminder_type VARCHAR(50) NOT NULL, -- 'hadith', 'dua', 'quote', 'tip'
  title VARCHAR(255) NOT NULL,
  arabic_text TEXT,
  english_text TEXT NOT NULL,
  transliteration TEXT,
  category VARCHAR(100),
  reference VARCHAR(255), -- Source reference (e.g., "Sahih Bukhari 1:1")
  image_url TEXT,
  author VARCHAR(255),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_published BOOLEAN DEFAULT FALSE,
  publish_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Ramadan Knowledge Base Table
CREATE TABLE IF NOT EXISTS ramadan_knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  category VARCHAR(100), -- 'basics', 'fasting', 'spiritual', 'practical'
  difficulty_level VARCHAR(50) DEFAULT 'beginner', -- beginner, intermediate, advanced
  read_time_minutes INTEGER,
  image_url TEXT,
  order_rank INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Ramadan Duas Table
CREATE TABLE IF NOT EXISTS ramadan_duas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL, -- 'suhoor', 'iftar', 'forgiveness', 'last-ten-nights'
  arabic_text TEXT NOT NULL,
  arabic_transliteration TEXT,
  english_translation TEXT NOT NULL,
  reference VARCHAR(255),
  audio_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  order_rank INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Ramadan Reflection Verses Table (for home page)
CREATE TABLE IF NOT EXISTS ramadan_reflection_verses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  surah_number INTEGER NOT NULL,
  ayah_number INTEGER NOT NULL,
  arabic_text TEXT NOT NULL,
  english_translation TEXT NOT NULL,
  theme VARCHAR(100),
  reflection_note TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  order_rank INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Ramadan Charity Information Table
CREATE TABLE IF NOT EXISTS ramadan_charity_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_name VARCHAR(255) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  icon VARCHAR(100),
  order_rank INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Ramadan Bank Account Details
CREATE TABLE IF NOT EXISTS ramadan_bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_name VARCHAR(255) NOT NULL,
  account_number VARCHAR(50) NOT NULL UNIQUE,
  bank_name VARCHAR(255) NOT NULL,
  account_type VARCHAR(100),
  currency VARCHAR(10) DEFAULT 'NGN',
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. User Ramadan Engagement Tracking
CREATE TABLE IF NOT EXISTS user_ramadan_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reminders_viewed INTEGER[] DEFAULT ARRAY[]::INTEGER[], -- Array of day_numbers viewed
  duas_bookmarked UUID[] DEFAULT ARRAY[]::UUID[],
  knowledge_articles_read UUID[] DEFAULT ARRAY[]::UUID[],
  last_visited DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE ramadan_daily_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE ramadan_knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE ramadan_duas ENABLE ROW LEVEL SECURITY;
ALTER TABLE ramadan_reflection_verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE ramadan_charity_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE ramadan_bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_ramadan_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Ramadan Daily Reminders - Everyone can view published
CREATE POLICY "Anyone can view published reminders" ON ramadan_daily_reminders
  FOR SELECT USING (is_published = TRUE);

-- Ramadan Knowledge Base - Everyone can view published
CREATE POLICY "Anyone can view published knowledge" ON ramadan_knowledge_base
  FOR SELECT USING (is_published = TRUE);

-- Ramadan Duas - Everyone can view
CREATE POLICY "Anyone can view duas" ON ramadan_duas
  FOR SELECT USING (TRUE);

-- Ramadan Reflection Verses - Everyone can view
CREATE POLICY "Anyone can view reflection verses" ON ramadan_reflection_verses
  FOR SELECT USING (TRUE);

-- Ramadan Charity Info - Everyone can view
CREATE POLICY "Anyone can view charity info" ON ramadan_charity_info
  FOR SELECT USING (is_active = TRUE);

-- Ramadan Bank Accounts - Everyone can view active accounts
CREATE POLICY "Anyone can view active bank accounts" ON ramadan_bank_accounts
  FOR SELECT USING (is_active = TRUE);

-- User Ramadan Tracking - Users can manage their own
CREATE POLICY "Users can manage own tracking" ON user_ramadan_tracking
  FOR ALL USING (auth.uid() = user_id);

-- Insert sample data
INSERT INTO ramadan_reflection_verses (surah_number, ayah_number, arabic_text, english_translation, theme, is_featured, order_rank)
VALUES
  (2, 185, 'شَهْرُ رَمَضَانَ ٱلَّذِىٓ أُنزِلَ فِيهِ ٱلْقُرْءَانُ هُدًۭى لِّلنَّاسِ وَبَيِّنَـٰتٍْ مِّنَ ٱلْهُدَىٰ وَٱلْفُرْقَانِ ۚ فَمَن شَهِدَ مِنكُمُ ٱلشَّهْرَ فَلْيَصُمْهُ ۖ وَمَن كَانَ مَرِيضًا أَوْ عَلَىٰ سَفَرٍْ فَعِدَّةٌۭ مِّنْ أَيَّامٍ أُخَرَ ۗ يُرِيدُ ٱللَّهُ بِكُمُ ٱلْيُسْرَ وَلَا يُرِيدُ بِكُمُ ٱلْعُسْرَ وَلِتُكْمِلُواْ ٱلْعِدَّةَ وَلِتُكَبِّرُواْ ٱللَّهَ عَلَىٰ مَا هَدَىٰكُمْ وَلَعَلَّكُمْ تَشْكُرُونَ ١٨٥', 'Ramaḍân is the month in which the Quran was revealed as a guide for humanity with clear proofs of guidance and the decisive authority. So whoever is present this month, let them fast. But whoever is ill or on a journey, then ˹let them fast˺ an equal number of days ˹after Ramaḍân˺. Allah intends ease for you, not hardship, so that you may complete the prescribed period and proclaim the greatness of Allah for guiding you, and perhaps you will be grateful.', 'The Essence of Ramadan', TRUE, 1)
ON CONFLICT DO NOTHING;

-- Insert sample charity information
INSERT INTO ramadan_charity_info (section_name, content, order_rank, is_active)
VALUES
  ('Why Charity in Ramadan', 'Charity (Sadaqah) holds special significance in Ramadan. The Prophet Muhammad (peace be upon him) was the most generous in Ramadan, and giving during this blessed month multiplies the reward of charity many times over.', 1, TRUE),
  ('Types of Charity', 'Sadaqah (voluntary charity), Zakat (obligatory alms), and feeding fasting people are the primary forms of charity in Ramadan. Each carries immense spiritual and community benefits.', 2, TRUE),
  ('Community Impact', 'Through your generosity, the Hamduk Islamic Foundation provides essential support to those in need, spreads Islamic knowledge, and strengthens our community bonds during this blessed month.', 3, TRUE)
ON CONFLICT DO NOTHING;

-- Insert sample bank account
INSERT INTO ramadan_bank_accounts (account_name, account_number, bank_name, account_type, currency, is_active, display_order)
VALUES
  ('Hamduk Unique Concept', '1214132103', 'Zenith Bank', 'Charitable Account', 'NGN', TRUE, 1)
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ramadan_daily_reminders_published ON ramadan_daily_reminders(is_published, day_number);
CREATE INDEX IF NOT EXISTS idx_ramadan_daily_reminders_day ON ramadan_daily_reminders(day_number);
CREATE INDEX IF NOT EXISTS idx_ramadan_knowledge_published ON ramadan_knowledge_base(is_published, order_rank);
CREATE INDEX IF NOT EXISTS idx_ramadan_duas_category ON ramadan_duas(category, is_featured);
CREATE INDEX IF NOT EXISTS idx_user_ramadan_tracking_user ON user_ramadan_tracking(user_id);
