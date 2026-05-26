-- Create transactions table for Paystack payments
CREATE TABLE IF NOT EXISTS paystack_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id UUID REFERENCES donations(id) ON DELETE CASCADE,
  reference TEXT UNIQUE NOT NULL,
  amount_kobo BIGINT NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  authorization_url TEXT,
  access_code TEXT,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  paid_at TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX idx_paystack_reference ON paystack_transactions(reference);
CREATE INDEX idx_paystack_donation_id ON paystack_transactions(donation_id);

-- Add Paystack webhook events log
CREATE TABLE IF NOT EXISTS paystack_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT,
  event_type TEXT,
  payload JSONB,
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add Paystack settings table
CREATE TABLE IF NOT EXISTS payment_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Function to update donation status based on payment
CREATE OR REPLACE FUNCTION update_donation_from_paystack()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'success' THEN
    UPDATE donations 
    SET payment_status = 'completed', updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.donation_id;
  ELSIF NEW.status = 'failed' THEN
    UPDATE donations 
    SET payment_status = 'failed', updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.donation_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for automatic donation status update
CREATE TRIGGER trigger_update_donation_from_paystack
AFTER UPDATE ON paystack_transactions
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION update_donation_from_paystack();
