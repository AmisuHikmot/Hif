-- CRITICAL FIX: Remove infinite recursion in RLS policies
-- Instead of querying profiles inside RLS policies, use SECURITY DEFINER functions

-- First, drop all problematic policies that query profiles
DROP POLICY IF EXISTS "Users can view own donations" ON donations;
DROP POLICY IF EXISTS "Admins can view all donations" ON donations;
DROP POLICY IF EXISTS "Admins can manage donations" ON donations;
DROP POLICY IF EXISTS "Admins can view all newsletter subscriptions" ON newsletters;
DROP POLICY IF EXISTS "Admins can view all transactions" ON paystack_transactions;
DROP POLICY IF EXISTS "Admins can update transactions" ON paystack_transactions;
DROP POLICY IF EXISTS "Organizers can update their events" ON events;
DROP POLICY IF EXISTS "Organizers can delete their events" ON events;
DROP POLICY IF EXISTS "Admins can manage events" ON events;
DROP POLICY IF EXISTS "Admins can view all registrations" ON event_registrations;
DROP POLICY IF EXISTS "Admins can manage registrations" ON event_registrations;
DROP POLICY IF EXISTS "Admins can manage branches" ON branches;
DROP POLICY IF EXISTS "Admins can view contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Admins can update contact submissions" ON contact_submissions;

-- Create SECURITY DEFINER function to check if user is admin (safe from recursion)
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create SECURITY DEFINER function to check if user is authenticated
CREATE OR REPLACE FUNCTION is_authenticated()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.role() = 'authenticated' OR auth.role() = 'service_role';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- DONATIONS TABLE - Recreate policies without self-queries
CREATE POLICY "Users can view own donations"
  ON donations FOR SELECT
  USING (
    auth.uid() = user_id 
    OR donor_email = auth.jwt() ->> 'email'
    OR (is_authenticated() AND is_admin(auth.uid()))
  );

CREATE POLICY "Admins can view all donations"
  ON donations FOR SELECT
  USING (
    is_admin(auth.uid()) = true
    OR auth.role() = 'service_role'
  );

CREATE POLICY "Admins can manage donations"
  ON donations FOR UPDATE
  USING (
    is_admin(auth.uid()) = true
    OR auth.role() = 'service_role'
  );

-- NEWSLETTERS TABLE
CREATE POLICY "Admins can view all newsletter subscriptions"
  ON newsletters FOR SELECT
  USING (
    is_admin(auth.uid()) = true
    OR auth.role() = 'service_role'
  );

-- PAYSTACK_TRANSACTIONS TABLE
CREATE POLICY "Admins can view all transactions"
  ON paystack_transactions FOR SELECT
  USING (
    is_admin(auth.uid()) = true
    OR auth.role() = 'service_role'
  );

CREATE POLICY "Admins can update transactions"
  ON paystack_transactions FOR UPDATE
  USING (
    is_admin(auth.uid()) = true
    OR auth.role() = 'service_role'
  );

-- EVENTS TABLE
CREATE POLICY "Organizers can update their events"
  ON events FOR UPDATE
  USING (
    created_by = auth.uid()
    OR organizer_id = auth.uid()
    OR is_admin(auth.uid()) = true
  );

CREATE POLICY "Organizers can delete their events"
  ON events FOR DELETE
  USING (
    created_by = auth.uid()
    OR organizer_id = auth.uid()
    OR is_admin(auth.uid()) = true
  );

CREATE POLICY "Admins can manage events"
  ON events FOR ALL
  USING (
    is_admin(auth.uid()) = true
    OR auth.role() = 'service_role'
  );

-- EVENT_REGISTRATIONS TABLE
CREATE POLICY "Admins can view all registrations"
  ON event_registrations FOR SELECT
  USING (
    is_admin(auth.uid()) = true
    OR auth.role() = 'service_role'
  );

CREATE POLICY "Admins can manage registrations"
  ON event_registrations FOR ALL
  USING (
    is_admin(auth.uid()) = true
    OR auth.role() = 'service_role'
  );

-- BRANCHES TABLE
CREATE POLICY "Admins can manage branches"
  ON branches FOR ALL
  USING (
    is_admin(auth.uid()) = true
    OR auth.role() = 'service_role'
  );

-- CONTACT_SUBMISSIONS TABLE
CREATE POLICY "Admins can view contact submissions"
  ON contact_submissions FOR SELECT
  USING (
    is_admin(auth.uid()) = true
    OR auth.role() = 'service_role'
  );

CREATE POLICY "Admins can update contact submissions"
  ON contact_submissions FOR UPDATE
  USING (
    is_admin(auth.uid()) = true
    OR auth.role() = 'service_role'
  );
