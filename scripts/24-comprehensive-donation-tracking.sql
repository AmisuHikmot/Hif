-- ============================================================================
-- COMPREHENSIVE DONATION TRACKING & PROJECT FUNDING SYSTEM
-- ============================================================================

-- 1. Create helper function to increment project raised amount
-- This function is called whenever a donation is verified
CREATE OR REPLACE FUNCTION increment_project_raised(
  project_id UUID,
  amount BIGINT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE donation_projects
  SET 
    amount_raised = COALESCE(amount_raised, 0) + amount,
    updated_at = NOW()
  WHERE id = project_id;
END;
$$;

-- 2. Create trigger to auto-update project when donation status changes to completed
CREATE OR REPLACE FUNCTION handle_donation_completed()
RETURNS TRIGGER AS $$
BEGIN
  -- If donation status is being updated to 'completed' and project_id exists
  IF NEW.payment_status = 'completed' AND NEW.project_id IS NOT NULL THEN
    UPDATE donation_projects
    SET 
      amount_raised = COALESCE(amount_raised, 0) + NEW.amount,
      updated_at = NOW()
    WHERE id = NEW.project_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists to avoid conflicts
DROP TRIGGER IF EXISTS tr_donation_completed_update_project ON donations;

-- Create trigger on donations table
CREATE TRIGGER tr_donation_completed_update_project
AFTER UPDATE ON donations
FOR EACH ROW
WHEN (NEW.payment_status = 'completed' AND OLD.payment_status != 'completed')
EXECUTE FUNCTION handle_donation_completed();

-- 3. Ensure donation_projects table has all necessary columns
ALTER TABLE donation_projects
ADD COLUMN IF NOT EXISTS amount_raised BIGINT DEFAULT 0,
ADD COLUMN IF NOT EXISTS deadline TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general',
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 4. Ensure donations table has all necessary columns for tracking
ALTER TABLE donations
ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES donation_projects(id),
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'cancelled')),
ADD COLUMN IF NOT EXISTS donor_name TEXT,
ADD COLUMN IF NOT EXISTS donor_email TEXT,
ADD COLUMN IF NOT EXISTS message TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 5. Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_donations_project_id ON donations(project_id);
CREATE INDEX IF NOT EXISTS idx_donations_payment_status ON donations(payment_status);
CREATE INDEX IF NOT EXISTS idx_donations_user_id ON donations(user_id);
CREATE INDEX IF NOT EXISTS idx_paystack_transactions_reference ON paystack_transactions(reference);
CREATE INDEX IF NOT EXISTS idx_donation_projects_status ON donation_projects(status);

-- 6. Create helper function to get project progress
CREATE OR REPLACE FUNCTION get_project_progress(project_id UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  amount_raised BIGINT,
  goal BIGINT,
  progress_percentage DECIMAL,
  is_funded BOOLEAN,
  days_remaining INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dp.id,
    dp.title,
    dp.amount_raised,
    dp.goal,
    CASE 
      WHEN dp.goal = 0 THEN 0::DECIMAL
      ELSE (CAST(dp.amount_raised AS DECIMAL) / dp.goal * 100)::DECIMAL
    END,
    dp.amount_raised >= dp.goal,
    CASE 
      WHEN dp.deadline IS NULL THEN NULL::INTEGER
      ELSE EXTRACT(DAY FROM (dp.deadline - NOW()))::INTEGER
    END
  FROM donation_projects dp
  WHERE dp.id = project_id;
END;
$$ LANGUAGE plpgsql;

-- 7. Create view for donation statistics
CREATE OR REPLACE VIEW v_donation_statistics AS
SELECT 
  dp.id as project_id,
  dp.title,
  COUNT(d.id) as total_donors,
  SUM(CASE WHEN d.payment_status = 'completed' THEN 1 ELSE 0 END) as successful_donations,
  SUM(CASE WHEN d.payment_status = 'completed' THEN d.amount ELSE 0 END) as total_raised,
  dp.goal,
  CASE 
    WHEN dp.goal = 0 THEN 0
    ELSE (SUM(CASE WHEN d.payment_status = 'completed' THEN d.amount ELSE 0 END)::DECIMAL / dp.goal * 100)::INTEGER
  END as progress_percentage,
  dp.status,
  dp.updated_at
FROM donation_projects dp
LEFT JOIN donations d ON dp.id = d.project_id
GROUP BY dp.id, dp.title, dp.goal, dp.status, dp.updated_at;

-- 8. Grant necessary permissions
GRANT EXECUTE ON FUNCTION increment_project_raised TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_project_progress TO authenticated, anon;
GRANT SELECT ON v_donation_statistics TO authenticated, anon;
