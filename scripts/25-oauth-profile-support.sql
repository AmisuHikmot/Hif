-- OAuth Profile Support Migration
-- This script ensures proper OAuth user integration

-- 1. Add avatar_url column if it doesn't exist
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS avatar_url TEXT NULL;

-- 2. Add oauth_provider column to track which provider authenticated the user
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS oauth_provider TEXT NULL CHECK (oauth_provider IN ('google', 'apple', 'facebook', 'email'));

-- 3. Add oauth_id to track the external OAuth ID
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS oauth_id TEXT NULL;

-- 4. Update existing profiles to mark them as email provider
UPDATE profiles
SET oauth_provider = 'email'
WHERE oauth_provider IS NULL AND email IS NOT NULL;

-- 5. Create index on oauth_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_oauth_id ON profiles(oauth_id);

-- 6. Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- 7. Drop old RLS policies and recreate with OAuth support
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;

-- 8. Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 9. Allow authenticated users to read their own profile
CREATE POLICY "profiles_select_own" ON profiles
FOR SELECT USING (auth.uid() = id);

-- 10. Allow authenticated users to update their own profile
CREATE POLICY "profiles_update_own" ON profiles
FOR UPDATE USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 11. Allow inserting profiles for newly authenticated users (via trigger)
CREATE POLICY "profiles_insert_new_user" ON profiles
FOR INSERT
WITH CHECK (true);

-- 12. Create or replace function to handle OAuth user profile creation
CREATE OR REPLACE FUNCTION handle_oauth_user_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a profile row when a new user is created
  INSERT INTO public.profiles (id, email, role, is_active, oauth_provider)
  VALUES (
    NEW.id,
    NEW.email,
    'user',
    true,
    COALESCE(NEW.raw_user_meta_data->>'provider', 'email')
  )
  ON CONFLICT (id) DO UPDATE SET
    oauth_provider = COALESCE(
      profiles.oauth_provider,
      COALESCE(NEW.raw_user_meta_data->>'provider', 'email')
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Create trigger for OAuth user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created_oauth ON auth.users;
CREATE TRIGGER on_auth_user_created_oauth
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_oauth_user_signup();

-- 14. Grant necessary permissions
GRANT EXECUTE ON FUNCTION handle_oauth_user_signup TO postgres, anon, authenticated, service_role;

-- Verification query
-- SELECT id, email, oauth_provider, first_name, last_name, avatar_url FROM profiles LIMIT 5;
