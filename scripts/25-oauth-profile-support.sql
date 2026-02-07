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

-- 7. Create or replace function to handle OAuth user profile creation
-- This function disables RLS temporarily to allow the trigger to insert profiles
CREATE OR REPLACE FUNCTION handle_oauth_user_signup()
RETURNS TRIGGER AS $$
DECLARE
  v_provider TEXT;
BEGIN
  -- Extract the provider from the raw_user_meta_data
  v_provider := COALESCE(NEW.raw_user_meta_data->>'provider', 'email');
  
  -- Insert a profile row when a new user is created
  -- This runs with SECURITY DEFINER so it bypasses RLS
  INSERT INTO public.profiles (id, email, role, is_active, oauth_provider)
  VALUES (
    NEW.id,
    NEW.email,
    'user',
    true,
    v_provider
  )
  ON CONFLICT (id) DO UPDATE SET
    oauth_provider = COALESCE(
      EXCLUDED.oauth_provider,
      v_provider
    )
  WHERE profiles.oauth_provider IS NULL;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log the error but don't fail the user creation
  RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 8. Create trigger for OAuth user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created_oauth ON auth.users;
CREATE TRIGGER on_auth_user_created_oauth
  AFTER INSERT ON auth.users
  FOR EACH ROW
  WHEN (NEW.email_confirmed_at IS NOT NULL OR NEW.raw_user_meta_data ? 'provider')
  EXECUTE FUNCTION handle_oauth_user_signup();

-- 9. Grant necessary permissions to the function
GRANT EXECUTE ON FUNCTION handle_oauth_user_signup TO postgres, anon, authenticated, service_role;

-- 10. Add service_role bypass policy for profile inserts from triggers
DROP POLICY IF EXISTS "profiles_insert_service_role" ON profiles;
CREATE POLICY "profiles_insert_service_role" ON profiles
FOR INSERT
TO service_role
WITH CHECK (true);

-- 11. Ensure authenticated users can still insert their own profiles
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Verification query
-- SELECT id, email, oauth_provider, first_name, last_name, avatar_url FROM profiles WHERE oauth_provider IS NOT NULL LIMIT 5;
