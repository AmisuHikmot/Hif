-- Add missing columns to donations table if they don't exist
ALTER TABLE donations ADD COLUMN IF NOT EXISTS donor_name TEXT;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS donor_email TEXT;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE donations ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'NGN';

-- Ensure payment_status has proper values
UPDATE donations SET payment_status = 'completed' WHERE payment_status IS NULL AND amount > 0;

-- Create index for faster payment status queries
CREATE INDEX IF NOT EXISTS idx_donations_payment_status ON donations(payment_status);
CREATE INDEX IF NOT EXISTS idx_donations_email ON donations(donor_email);
