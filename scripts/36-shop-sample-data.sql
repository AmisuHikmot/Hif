-- Shop System Sample Data
-- Adds sample categories, products, and promo codes for testing

-- 1. Insert sample categories
INSERT INTO shop_categories (name, slug, description)
VALUES
  ('Books & Publications', 'books-publications', 'Islamic books, journals, and educational materials'),
  ('Merchandise', 'merchandise', 'T-shirts, hats, and branded merchandise'),
  ('Digital Content', 'digital-content', 'E-books, courses, and digital downloads'),
  ('Educational Materials', 'educational-materials', 'Workbooks, guides, and learning resources')
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert sample products
INSERT INTO shop_products_enhanced (
  name,
  slug,
  description,
  category_id,
  price,
  type,
  stock,
  is_active
)
SELECT
  'The Islamic Foundation Guide',
  'islamic-foundation-guide',
  'A comprehensive guide to Islamic foundations and principles. Perfect for both beginners and advanced learners.',
  (SELECT id FROM shop_categories WHERE slug = 'books-publications' LIMIT 1),
  2500,
  'physical',
  50,
  true
UNION ALL
SELECT
  'Islamic Knowledge Journal - Annual Subscription',
  'islamic-knowledge-journal',
  'Annual subscription to our quarterly journal covering Islamic history, law, and contemporary issues.',
  (SELECT id FROM shop_categories WHERE slug = 'books-publications' LIMIT 1),
  5000,
  'digital',
  999,
  true
UNION ALL
SELECT
  'HIF Logo T-Shirt',
  'hif-logo-tshirt',
  'Premium quality cotton t-shirt with embroidered HIF logo. Available in multiple sizes.',
  (SELECT id FROM shop_categories WHERE slug = 'merchandise' LIMIT 1),
  1500,
  'physical',
  100,
  true
UNION ALL
SELECT
  'Quran Study Course - Digital',
  'quran-study-course',
  'Complete online course on Quranic studies with video lessons, transcripts, and assessments.',
  (SELECT id FROM shop_categories WHERE slug = 'digital-content' LIMIT 1),
  7500,
  'digital',
  999,
  true
UNION ALL
SELECT
  'Islamic History Workbook',
  'islamic-history-workbook',
  'Interactive workbook with exercises, timelines, and discussion questions for Islamic history learners.',
  (SELECT id FROM shop_categories WHERE slug = 'educational-materials' LIMIT 1),
  1200,
  'physical',
  75,
  true
UNION ALL
SELECT
  'Hadith Learning Bundle',
  'hadith-learning-bundle',
  'Complete collection including 6 major hadith books in PDF format with search functionality.',
  (SELECT id FROM shop_categories WHERE slug = 'digital-content' LIMIT 1),
  3500,
  'digital',
  999,
  true
ON CONFLICT (slug) DO NOTHING;

-- 3. Insert sample promo codes
INSERT INTO shop_promo_codes (
  code,
  discount_type,
  discount_value,
  max_uses,
  expires_at,
  is_active
)
VALUES
  ('WELCOME10', 'percentage', 10, 100, CURRENT_TIMESTAMP + INTERVAL '30 days', true),
  ('BULK20', 'percentage', 20, 50, CURRENT_TIMESTAMP + INTERVAL '60 days', true),
  ('SAVE500', 'fixed', 500, 200, CURRENT_TIMESTAMP + INTERVAL '45 days', true),
  ('FREESHIP', 'fixed', 0, 500, CURRENT_TIMESTAMP + INTERVAL '90 days', true),
  ('RAMADAN2024', 'percentage', 25, 300, CURRENT_TIMESTAMP + INTERVAL '30 days', false)
ON CONFLICT (code) DO NOTHING;

-- 4. Verify data was inserted
-- Check categories
SELECT COUNT(*) as total_categories FROM shop_categories;
-- Check products
SELECT COUNT(*) as total_products FROM shop_products_enhanced;
-- Check promo codes
SELECT COUNT(*) as total_promo_codes FROM shop_promo_codes;
