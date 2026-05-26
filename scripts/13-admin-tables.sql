-- Create admin roles and permissions table
CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admin audit log
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_admin_audit_log_admin_id ON admin_audit_log(admin_id);
CREATE INDEX idx_admin_audit_log_created_at ON admin_audit_log(created_at);

-- Add admin columns to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS admin_role TEXT,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;

-- Insert default admin roles
INSERT INTO admin_roles (name, description, permissions) VALUES
  ('super_admin', 'Full access to all features', '["*"]'::jsonb),
  ('admin', 'Can manage events, users, donations', '["manage_events", "manage_users", "manage_donations"]'::jsonb),
  ('moderator', 'Can moderate content and users', '["moderate_content", "manage_users_basic"]'::jsonb)
ON CONFLICT (name) DO NOTHING;
