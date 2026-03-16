-- Shop System Database Schema

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS shop_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Products Table (enhanced from existing shop_products)
CREATE TABLE IF NOT EXISTS shop_products_enhanced (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  price NUMERIC(10,2) NOT NULL,
  stock INTEGER DEFAULT 0,
  type TEXT DEFAULT 'physical' CHECK (type IN ('physical', 'digital')),
  category_id UUID REFERENCES shop_categories(id) ON DELETE SET NULL,
  image_url TEXT,
  digital_file_path TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Promo Codes Table
CREATE TABLE IF NOT EXISTS shop_promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10,2) NOT NULL,
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Orders Table (enhanced from existing shop_orders)
CREATE TABLE IF NOT EXISTS shop_orders_enhanced (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT NOT NULL UNIQUE,
  customer_name TEXT,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  delivery_address TEXT,
  subtotal NUMERIC(10,2),
  shipping_fee NUMERIC(10,2) DEFAULT 0,
  discount_amount NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2),
  promo_code_id UUID REFERENCES shop_promo_codes(id) ON DELETE SET NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  order_status TEXT DEFAULT 'processing' CHECK (order_status IN ('processing', 'shipped', 'delivered', 'cancelled')),
  has_digital BOOLEAN DEFAULT false,
  user_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Order Items Table (enhanced from existing shop_order_items)
CREATE TABLE IF NOT EXISTS shop_order_items_enhanced (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES shop_orders_enhanced(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES shop_products_enhanced(id) ON DELETE RESTRICT,
  product_name TEXT NOT NULL,
  product_type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Digital Downloads Table
CREATE TABLE IF NOT EXISTS shop_digital_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES shop_orders_enhanced(id) ON DELETE CASCADE,
  order_item_id UUID NOT NULL REFERENCES shop_order_items_enhanced(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES shop_products_enhanced(id) ON DELETE RESTRICT,
  download_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  download_count INTEGER DEFAULT 0,
  max_downloads INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_shop_products_category ON shop_products_enhanced(category_id);
CREATE INDEX IF NOT EXISTS idx_shop_products_slug ON shop_products_enhanced(slug);
CREATE INDEX IF NOT EXISTS idx_shop_products_active ON shop_products_enhanced(is_active);
CREATE INDEX IF NOT EXISTS idx_shop_orders_reference ON shop_orders_enhanced(reference);
CREATE INDEX IF NOT EXISTS idx_shop_orders_user ON shop_orders_enhanced(user_id);
CREATE INDEX IF NOT EXISTS idx_shop_orders_status ON shop_orders_enhanced(payment_status);
CREATE INDEX IF NOT EXISTS idx_shop_order_items_order ON shop_order_items_enhanced(order_id);
CREATE INDEX IF NOT EXISTS idx_digital_downloads_token ON shop_digital_downloads(download_token);
CREATE INDEX IF NOT EXISTS idx_digital_downloads_order ON shop_digital_downloads(order_id);
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON shop_promo_codes(code);

-- Enable RLS on all shop tables
ALTER TABLE shop_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_products_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_orders_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_order_items_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_digital_downloads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for shop_categories (public read)
CREATE POLICY "Anyone can view categories" ON shop_categories FOR SELECT USING (true);
CREATE POLICY "Admin can manage categories" ON shop_categories FOR ALL USING (true); -- Will be restricted in app

-- RLS Policies for shop_products_enhanced (public read, active only)
CREATE POLICY "Anyone can view active products" ON shop_products_enhanced 
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admin can manage products" ON shop_products_enhanced FOR ALL USING (true);

-- RLS Policies for shop_promo_codes (service role only)
CREATE POLICY "Service role manages promo codes" ON shop_promo_codes FOR ALL USING (true);

-- RLS Policies for shop_orders_enhanced
CREATE POLICY "Users can view own orders" ON shop_orders_enhanced
  FOR SELECT USING (user_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Service role manages orders" ON shop_orders_enhanced FOR ALL USING (true);

-- RLS Policies for shop_order_items_enhanced
CREATE POLICY "Users can view items in own orders" ON shop_order_items_enhanced
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM shop_orders_enhanced 
    WHERE id = order_id AND (user_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin')
  ));
CREATE POLICY "Service role manages order items" ON shop_order_items_enhanced FOR ALL USING (true);

-- RLS Policies for shop_digital_downloads
CREATE POLICY "Users can view own downloads" ON shop_digital_downloads
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM shop_orders_enhanced 
    WHERE id = order_id AND (user_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin')
  ));
CREATE POLICY "Service role manages downloads" ON shop_digital_downloads FOR ALL USING (true);
