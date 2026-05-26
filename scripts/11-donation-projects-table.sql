-- Create donation_projects table for dynamic project management
CREATE TABLE IF NOT EXISTS donation_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  category TEXT,
  raised BIGINT DEFAULT 0,
  goal BIGINT NOT NULL,
  deadline TIMESTAMP,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_donation_projects_status ON donation_projects(status);

-- Add function to update project totals
CREATE OR REPLACE FUNCTION update_project_raised_amount()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE donation_projects
  SET raised = (
    SELECT COALESCE(SUM(amount), 0)
    FROM paystack_transactions pt
    JOIN donations d ON pt.donation_id = d.id
    WHERE d.project_id = NEW.project_id AND pt.status = 'success'
  ),
  updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.project_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update raised amounts
CREATE TRIGGER trigger_update_project_raised
AFTER UPDATE ON paystack_transactions
FOR EACH ROW
WHEN (NEW.status IS DISTINCT FROM OLD.status AND NEW.status = 'success')
EXECUTE FUNCTION update_project_raised_amount();

-- Alter donations table to add project reference
ALTER TABLE donations
ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES donation_projects(id) ON DELETE SET NULL;
