-- 42: Lock down the shop tables
--
-- Problem: several shop tables had "ALL" policies with USING (true) for the
-- `public` role, so anyone holding the public anon key could:
--   * read every order (names, emails, phones, delivery addresses) and change
--     payment_status / order_status (for example mark an order paid);
--   * create or edit promo codes (a 100% discount code);
--   * change product prices and stock;
--   * read or alter digital download tokens.
-- The web app reads and writes these tables with the service-role client
-- (which bypasses RLS), so those policies are not needed. The only read that
-- used the user's session was /api/shop/validate-promo, which now uses the
-- admin client too -- DEPLOY THAT CHANGE BEFORE RUNNING THIS SCRIPT.
--
-- Kept: public read of active products and categories; owners reading their
-- own orders, items and downloads; the staff-checked admin policies.
--
-- Rollback (re-opens the holes; only if something breaks):
--   create policy "Service role manages orders" on public.shop_orders_enhanced for all to public using (true);
--   create policy "Service role manages order items" on public.shop_order_items_enhanced for all to public using (true);
--   create policy "Service role manages promo codes" on public.shop_promo_codes for all to public using (true);
--   create policy "Service role manages downloads" on public.shop_digital_downloads for all to public using (true);
--   create policy "Admin can manage products" on public.shop_products_enhanced for all to public using (true);
--   create policy "Admin can manage categories" on public.shop_categories for all to public using (true);
--   create policy "Authenticated users can manage products" on public.shop_products for all to authenticated using (true);
--   create policy "Public order status history read" on public.order_status_history for select to public using (true);

begin;

drop policy if exists "Service role manages orders" on public.shop_orders_enhanced;
drop policy if exists "Service role manages order items" on public.shop_order_items_enhanced;
drop policy if exists "Service role manages promo codes" on public.shop_promo_codes;
drop policy if exists "Service role manages downloads" on public.shop_digital_downloads;
drop policy if exists "Admin can manage products" on public.shop_products_enhanced;
drop policy if exists "Admin can manage categories" on public.shop_categories;
drop policy if exists "Authenticated users can manage products" on public.shop_products;

-- Status history was readable by everyone; limit to the order's owner and staff.
drop policy if exists "Public order status history read" on public.order_status_history;
create policy order_status_history_owner_or_staff on public.order_status_history
  for select to authenticated
  using (
    public.is_staff(auth.uid())
    or exists (
      select 1 from public.shop_orders_enhanced o
      where o.id = order_status_history.order_id and o.user_id = auth.uid()
    )
  );

commit;
