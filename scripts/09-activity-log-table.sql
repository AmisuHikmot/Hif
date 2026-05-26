-- Activity Log Table for tracking user actions
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action_type VARCHAR(50) NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_action_type ON activity_log(action_type);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at DESC);

-- Function to log user activity
CREATE OR REPLACE FUNCTION log_user_activity(
  p_user_id UUID,
  p_action_type VARCHAR(50),
  p_description TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  v_activity_id UUID;
BEGIN
  INSERT INTO activity_log (user_id, action_type, description, metadata)
  VALUES (p_user_id, p_action_type, p_description, p_metadata)
  RETURNING id INTO v_activity_id;
  
  RETURN v_activity_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to log user registration
CREATE OR REPLACE FUNCTION log_user_registration()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM log_user_activity(
    NEW.id,
    'registration',
    'New user registered',
    jsonb_build_object('email', NEW.email, 'membership_type', NEW.membership_type)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_log_user_registration ON users;
CREATE TRIGGER tr_log_user_registration
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION log_user_registration();

-- Trigger to log donations
CREATE OR REPLACE FUNCTION log_donation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' THEN
    PERFORM log_user_activity(
      NEW.user_id,
      'donation',
      'Made a donation of ' || NEW.amount || ' NGN',
      jsonb_build_object('amount', NEW.amount, 'type', NEW.donation_type, 'project', NEW.project_name)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_log_donation ON donations;
CREATE TRIGGER tr_log_donation
  AFTER INSERT OR UPDATE ON donations
  FOR EACH ROW
  EXECUTE FUNCTION log_donation();

-- Trigger to log event registration
CREATE OR REPLACE FUNCTION log_event_registration()
RETURNS TRIGGER AS $$
DECLARE
  v_event_title TEXT;
BEGIN
  SELECT title INTO v_event_title FROM events WHERE id = NEW.event_id;
  
  PERFORM log_user_activity(
    NEW.user_id,
    'event',
    'Registered for event: ' || v_event_title,
    jsonb_build_object('event_id', NEW.event_id, 'event_title', v_event_title)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_log_event_registration ON event_registrations;
CREATE TRIGGER tr_log_event_registration
  AFTER INSERT ON event_registrations
  FOR EACH ROW
  EXECUTE FUNCTION log_event_registration();

-- RLS Policies for activity_log
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all activity logs"
  ON activity_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can view their own activity"
  ON activity_log FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
