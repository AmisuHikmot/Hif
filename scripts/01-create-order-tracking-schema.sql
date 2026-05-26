-- Add new columns to shop_orders_enhanced table for tracking
ALTER TABLE shop_orders_enhanced ADD COLUMN IF NOT EXISTS payment_confirmed_at timestamptz;
ALTER TABLE shop_orders_enhanced ADD COLUMN IF NOT EXISTS processing_at timestamptz;
ALTER TABLE shop_orders_enhanced ADD COLUMN IF NOT EXISTS ready_for_dispatch_at timestamptz;
ALTER TABLE shop_orders_enhanced ADD COLUMN IF NOT EXISTS out_for_delivery_at timestamptz;
ALTER TABLE shop_orders_enhanced ADD COLUMN IF NOT EXISTS delivered_at timestamptz;
ALTER TABLE shop_orders_enhanced ADD COLUMN IF NOT EXISTS cancelled_at timestamptz;
ALTER TABLE shop_orders_enhanced ADD COLUMN IF NOT EXISTS cancellation_reason text;
ALTER TABLE shop_orders_enhanced ADD COLUMN IF NOT EXISTS status_note text;
ALTER TABLE shop_orders_enhanced ADD COLUMN IF NOT EXISTS estimated_delivery_date date;

-- Update order_status CHECK constraint to include new statuses
ALTER TABLE shop_orders_enhanced DROP CONSTRAINT IF EXISTS shop_orders_enhanced_order_status_check;
ALTER TABLE shop_orders_enhanced ADD CONSTRAINT shop_orders_enhanced_order_status_check
  CHECK (order_status IN (
    'pending',
    'processing',
    'ready_for_dispatch',
    'out_for_delivery',
    'delivered',
    'cancelled'
  ));

-- Create order status history table
CREATE TABLE IF NOT EXISTS order_status_history (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    uuid        NOT NULL REFERENCES shop_orders_enhanced(id) ON DELETE CASCADE,
  status      text        NOT NULL,
  note        text,
  changed_by  text        DEFAULT 'system',
  changed_at  timestamptz DEFAULT now(),
  created_at  timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_changed_at ON order_status_history(changed_at);
CREATE INDEX IF NOT EXISTS idx_orders_reference ON shop_orders_enhanced(reference);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON shop_orders_enhanced(customer_email);

-- Create cancellation requests table
CREATE TABLE IF NOT EXISTS cancellation_requests (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     uuid NOT NULL REFERENCES shop_orders_enhanced(id) ON DELETE CASCADE,
  reason       text NOT NULL,
  notes        text,
  status       text DEFAULT 'pending',
  requested_at timestamptz DEFAULT now(),
  resolved_at  timestamptz,
  created_at   timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cancellation_requests_order_id ON cancellation_requests(order_id);
CREATE INDEX IF NOT EXISTS idx_cancellation_requests_status ON cancellation_requests(status);

-- Enable RLS on new tables
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE cancellation_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public order tracking
CREATE POLICY "Public order status history read" ON order_status_history FOR SELECT USING (true);
CREATE POLICY "Public cancellation request read" ON cancellation_requests FOR SELECT USING (true);

-- Create function to auto-log order status changes
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_status IS DISTINCT FROM OLD.order_status THEN
    INSERT INTO order_status_history (order_id, status, note, changed_at)
    VALUES (NEW.id, NEW.order_status, NEW.status_note, now());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for status history logging
DROP TRIGGER IF EXISTS trg_order_status_history ON shop_orders_enhanced;
CREATE TRIGGER trg_order_status_history
AFTER UPDATE ON shop_orders_enhanced
FOR EACH ROW
EXECUTE FUNCTION log_order_status_change();
