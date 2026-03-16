-- Shop System Triggers and Functions
-- Note: Run this script AFTER 34-shop-system-schema.sql has been executed

-- 1. Function: Reduce stock on payment
CREATE OR REPLACE FUNCTION shop_reduce_stock_on_payment()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process when payment_status changes to 'paid'
  IF NEW.payment_status = 'paid' AND OLD.payment_status != 'paid' THEN
    -- Reduce stock for each non-digital order item
    UPDATE shop_products_enhanced p
    SET stock = stock - oi.quantity
    FROM shop_order_items_enhanced oi
    WHERE oi.order_id = NEW.id
      AND oi.product_id = p.id
      AND oi.product_type = 'physical';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Function: Generate digital downloads on payment
CREATE OR REPLACE FUNCTION shop_generate_digital_downloads()
RETURNS TRIGGER AS $$
DECLARE
  v_item RECORD;
  v_token TEXT;
BEGIN
  -- Only process when payment_status changes to 'paid'
  IF NEW.payment_status = 'paid' AND OLD.payment_status != 'paid' THEN
    -- Generate download token for each digital product in the order
    FOR v_item IN
      SELECT oi.* FROM shop_order_items_enhanced oi
      WHERE oi.order_id = NEW.id AND oi.product_type = 'digital'
    LOOP
      -- Generate a secure random token
      v_token := encode(gen_random_bytes(32), 'hex');
      
      INSERT INTO shop_digital_downloads (
        order_id,
        order_item_id,
        product_id,
        download_token,
        expires_at,
        max_downloads
      ) VALUES (
        NEW.id,
        v_item.id,
        v_item.product_id,
        v_token,
        now() + INTERVAL '72 hours',
        3
      );
    END LOOP;
    
    -- Mark order as having digital products
    UPDATE shop_orders_enhanced 
    SET has_digital = (
      EXISTS (
        SELECT 1 FROM shop_order_items_enhanced 
        WHERE order_id = NEW.id AND product_type = 'digital'
      )
    )
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Function: Validate promo code
CREATE OR REPLACE FUNCTION shop_validate_promo_code(p_code TEXT)
RETURNS TABLE (
  id UUID,
  code TEXT,
  discount_type TEXT,
  discount_value NUMERIC,
  is_valid BOOLEAN,
  error_message TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    pc.id,
    pc.code,
    pc.discount_type,
    pc.discount_value,
    (pc.is_active 
      AND (pc.expires_at IS NULL OR pc.expires_at > now())
      AND (pc.max_uses IS NULL OR pc.used_count < pc.max_uses)
    )::BOOLEAN AS is_valid,
    CASE
      WHEN NOT pc.is_active THEN 'Promo code is no longer active'
      WHEN pc.expires_at IS NOT NULL AND pc.expires_at <= now() THEN 'Promo code has expired'
      WHEN pc.max_uses IS NOT NULL AND pc.used_count >= pc.max_uses THEN 'Promo code has reached maximum uses'
      ELSE NULL
    END AS error_message
  FROM shop_promo_codes pc
  WHERE pc.code = p_code
  LIMIT 1;
  
  -- If no code found
  IF NOT FOUND THEN
    RETURN QUERY SELECT
      NULL::UUID,
      p_code,
      NULL::TEXT,
      NULL::NUMERIC,
      FALSE::BOOLEAN,
      'Promo code not found'::TEXT;
  END IF;
END;
$$ LANGUAGE plpgsql STABLE;

-- 4. Function: Increment promo code usage
CREATE OR REPLACE FUNCTION shop_increment_promo_usage(p_promo_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE shop_promo_codes
  SET used_count = used_count + 1
  WHERE id = p_promo_id AND (max_uses IS NULL OR used_count < max_uses);
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS shop_reduce_stock_on_payment_trigger ON shop_orders_enhanced;
CREATE TRIGGER shop_reduce_stock_on_payment_trigger
AFTER UPDATE ON shop_orders_enhanced
FOR EACH ROW
EXECUTE FUNCTION shop_reduce_stock_on_payment();

DROP TRIGGER IF EXISTS shop_generate_digital_downloads_trigger ON shop_orders_enhanced;
CREATE TRIGGER shop_generate_digital_downloads_trigger
AFTER UPDATE ON shop_orders_enhanced
FOR EACH ROW
EXECUTE FUNCTION shop_generate_digital_downloads();

-- 5. Function: Calculate order total (server-side)
CREATE OR REPLACE FUNCTION shop_calculate_order_total(
  p_subtotal NUMERIC,
  p_shipping_fee NUMERIC DEFAULT 0,
  p_discount_amount NUMERIC DEFAULT 0
)
RETURNS NUMERIC AS $$
BEGIN
  RETURN p_subtotal + p_shipping_fee - p_discount_amount;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 6. Function: Calculate shipping fee (based on cart contents)
CREATE OR REPLACE FUNCTION shop_calculate_shipping_fee(p_order_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  v_has_physical BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM shop_order_items_enhanced 
    WHERE order_id = p_order_id AND product_type = 'physical'
  ) INTO v_has_physical;
  
  -- Free shipping if only digital products, otherwise flat 1500 NGN
  RETURN CASE WHEN v_has_physical THEN 1500::NUMERIC ELSE 0::NUMERIC END;
END;
$$ LANGUAGE plpgsql STABLE;
