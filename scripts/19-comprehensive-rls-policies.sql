-- Drop all existing RLS policies and create fresh comprehensive ones for security

-- DONATIONS TABLE
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can create donations" ON donations;
DROP POLICY IF EXISTS "Admins can view all donations" ON donations;
DROP POLICY IF EXISTS "Users can view own donations" ON donations;
DROP POLICY IF EXISTS "Admins can manage donations" ON donations;

CREATE POLICY "Anyone can create donations"
  ON donations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own donations"
  ON donations FOR SELECT
  USING (
    auth.uid() = user_id 
    OR donor_email = auth.jwt() ->> 'email'
    OR auth.role() = 'authenticated' AND (SELECT is_admin FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Admins can view all donations"
  ON donations FOR SELECT
  USING (
    (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
    OR auth.role() = 'service_role'
  );

CREATE POLICY "Admins can manage donations"
  ON donations FOR UPDATE
  USING (
    (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
    OR auth.role() = 'service_role'
  );

-- NEWSLETTERS TABLE
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all newsletter subscriptions" ON newsletters;
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON newsletters;

CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletters FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all newsletter subscriptions"
  ON newsletters FOR SELECT
  USING (
    (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
    OR auth.role() = 'service_role'
  );

-- PAYSTACK_TRANSACTIONS TABLE
ALTER TABLE paystack_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "System can insert transactions" ON paystack_transactions;
DROP POLICY IF EXISTS "Users can view their transactions" ON paystack_transactions;
DROP POLICY IF EXISTS "Admins can view all transactions" ON paystack_transactions;

CREATE POLICY "System can insert transactions"
  ON paystack_transactions FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admins can view all transactions"
  ON paystack_transactions FOR SELECT
  USING (
    (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
    OR auth.role() = 'service_role'
  );

CREATE POLICY "Admins can update transactions"
  ON paystack_transactions FOR UPDATE
  USING (
    (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
    OR auth.role() = 'service_role'
  );

-- EVENTS TABLE
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Organizers can update their events" ON events;
DROP POLICY IF EXISTS "Organizers can delete their events" ON events;
DROP POLICY IF EXISTS "Authenticated users can create events" ON events;
DROP POLICY IF EXISTS "Anyone can view events" ON events;
DROP POLICY IF EXISTS "Admins can manage events" ON events;

CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create events"
  ON events FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Organizers can update their events"
  ON events FOR UPDATE
  USING (
    created_by = auth.uid()
    OR organizer_id = auth.uid()
    OR (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
  );

CREATE POLICY "Organizers can delete their events"
  ON events FOR DELETE
  USING (
    created_by = auth.uid()
    OR organizer_id = auth.uid()
    OR (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
  );

CREATE POLICY "Admins can manage events"
  ON events FOR ALL
  USING (
    (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
    OR auth.role() = 'service_role'
  );

-- EVENT_REGISTRATIONS TABLE
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their registrations" ON event_registrations;
DROP POLICY IF EXISTS "Users can register for events" ON event_registrations;
DROP POLICY IF EXISTS "Users can cancel their own registrations" ON event_registrations;
DROP POLICY IF EXISTS "Admins can view all registrations" ON event_registrations;
DROP POLICY IF EXISTS "Users can update their registrations" ON event_registrations;
DROP POLICY IF EXISTS "Users can delete their registrations" ON event_registrations;

CREATE POLICY "Users can view their registrations"
  ON event_registrations FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can register for events"
  ON event_registrations FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their registrations"
  ON event_registrations FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can cancel their own registrations"
  ON event_registrations FOR DELETE
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all registrations"
  ON event_registrations FOR SELECT
  USING (
    (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
    OR auth.role() = 'service_role'
  );

CREATE POLICY "Admins can manage registrations"
  ON event_registrations FOR ALL
  USING (
    (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
    OR auth.role() = 'service_role'
  );

-- BRANCHES TABLE
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage branches" ON branches;
DROP POLICY IF EXISTS "Anyone can view branches" ON branches;

CREATE POLICY "Anyone can view branches"
  ON branches FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage branches"
  ON branches FOR ALL
  USING (
    (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
    OR auth.role() = 'service_role'
  );

-- CONTACT_SUBMISSIONS TABLE
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit contact form" ON contact_submissions;
DROP POLICY IF EXISTS "Admins can view contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Admins can update contact submissions" ON contact_submissions;

CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view contact submissions"
  ON contact_submissions FOR SELECT
  USING (
    (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
    OR auth.role() = 'service_role'
  );

CREATE POLICY "Admins can update contact submissions"
  ON contact_submissions FOR UPDATE
  USING (
    (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
    OR auth.role() = 'service_role'
  );

-- PROFILES TABLE - Fix existing policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "allow_update_last_sign_in" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "auth_update_own_profile_last_sign_in" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can manage own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Allow insert for new users" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

CREATE POLICY "Enable read access for all users"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (
    auth.uid() = id
    OR auth.role() = 'service_role'
  );

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (
    auth.uid() = id
    OR auth.role() = 'service_role'
  );

CREATE POLICY "Users can delete own profile"
  ON profiles FOR DELETE
  USING (
    auth.uid() = id
    OR auth.role() = 'service_role'
  );

CREATE POLICY "Admins can manage all profiles"
  ON profiles FOR ALL
  USING (
    (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
    OR auth.role() = 'service_role'
  );

-- PUBLICATIONS TABLE
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published publications" ON publications;
DROP POLICY IF EXISTS "Admins can manage publications" ON publications;

CREATE POLICY "Anyone can view published publications"
  ON publications FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage publications"
  ON publications FOR ALL
  USING (
    (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
    OR auth.role() = 'service_role'
  );

-- MEDIA TABLE
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage media" ON media;
DROP POLICY IF EXISTS "Anyone can view media" ON media;

CREATE POLICY "Anyone can view media"
  ON media FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage media"
  ON media FOR ALL
  USING (
    (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
    OR auth.role() = 'service_role'
  );

-- PROGRAMS TABLE
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can manage programs" ON programs;
DROP POLICY IF EXISTS "Anyone can view programs" ON programs;

CREATE POLICY "Anyone can view programs"
  ON programs FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage programs"
  ON programs FOR ALL
  USING (
    (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
    OR auth.role() = 'service_role'
  );

-- ACTIVITY_LOGS TABLE
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all activity logs" ON activity_logs;
DROP POLICY IF EXISTS "System can insert activity logs" ON activity_logs;
DROP POLICY IF EXISTS "Users can view their activity" ON activity_logs;
DROP POLICY IF EXISTS "Users can view their own activity logs" ON activity_logs;

CREATE POLICY "System can insert activity logs"
  ON activity_logs FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Users can view their activity"
  ON activity_logs FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all activity logs"
  ON activity_logs FOR SELECT
  USING (
    (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
    OR auth.role() = 'service_role'
  );
