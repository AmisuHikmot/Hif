-- Shop RLS policies aligned with the current application code.
-- Run this after scripts/34-shop-system-schema.sql and scripts/35-shop-triggers-and-functions.sql.

ALTER TABLE public.shop_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_products_enhanced ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view shop categories" ON public.shop_categories;
CREATE POLICY "Public can view shop categories"
  ON public.shop_categories
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public can view active shop products" ON public.shop_products_enhanced;
CREATE POLICY "Public can view active shop products"
  ON public.shop_products_enhanced
  FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage shop categories" ON public.shop_categories;
CREATE POLICY "Admins can manage shop categories"
  ON public.shop_categories
  FOR ALL
  USING (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND (profiles.role IN ('admin', 'super_admin') OR profiles.is_admin = true)
    )
  )
  WITH CHECK (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND (profiles.role IN ('admin', 'super_admin') OR profiles.is_admin = true)
    )
  );

DROP POLICY IF EXISTS "Admins can manage shop products" ON public.shop_products_enhanced;
CREATE POLICY "Admins can manage shop products"
  ON public.shop_products_enhanced
  FOR ALL
  USING (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND (profiles.role IN ('admin', 'super_admin') OR profiles.is_admin = true)
    )
  )
  WITH CHECK (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND (profiles.role IN ('admin', 'super_admin') OR profiles.is_admin = true)
    )
  );
