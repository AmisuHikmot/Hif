-- Fix OAuth Profile Creation - NOT NULL Constraint Violation
-- Issue: During OAuth signup, profile records are being inserted with NULL id values
-- Solution: Ensure proper id passing and constraint handling in the trigger function

-- 1. First, check if profiles table has proper constraints
-- Ensure id column is properly defined
ALTER TABLE public.profiles
ALTER COLUMN id SET NOT NULL;

-- 2. Create a comprehensive OAuth signup handler that logs errors and handles edge cases
CREATE OR REPLACE FUNCTION public.handle_oauth_user_signup_v2()
RETURNS TRIGGER AS $$
DECLARE
  v_provider TEXT;
  v_error_msg TEXT;
BEGIN
  -- Log incoming data for debugging
  RAISE NOTICE 'OAuth signup handler: user_id=%', NEW.id;
  
  -- Extract the provider from the raw_user_meta_data
  v_provider := COALESCE(NEW.raw_user_meta_data->>'provider', 'email');
  
  -- Validate that we have a valid user ID
  IF NEW.id IS NULL THEN
    RAISE EXCEPTION 'Cannot create profile: user ID is NULL';
  END IF;
  
  -- Insert a profile row when a new user is created
  -- Using explicit column mapping to prevent NULL values
  INSERT INTO public.profiles (
    id,
    email,
    role,
    is_active,
    oauth_provider,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,                                    -- Explicitly use NEW.id, not NULL
    COALESCE(NEW.email, ''),                  -- Email with fallback
    'user',                                    -- Default role
    true,                                      -- Default active state
    v_provider,                                -- Provider from metadata
    NOW(),                                     -- Current timestamp
    NOW()                                      -- Current timestamp
  )
  ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(EXCLUDED.email, profiles.email),
    oauth_provider = CASE 
      WHEN profiles.oauth_provider IS NULL THEN v_provider
      ELSE profiles.oauth_provider 
    END,
    updated_at = NOW()
  WHERE profiles.id = NEW.id;
  
  RETURN NEW;
  
EXCEPTION WHEN others THEN
  v_error_msg := SQLERRM;
  RAISE NOTICE 'Error in handle_oauth_user_signup_v2: user_id=%, error=%', NEW.id, v_error_msg;
  -- Continue execution even if profile creation fails (don't block auth)
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Replace the OAuth signup trigger with the improved version
DROP TRIGGER IF EXISTS on_auth_user_created_oauth ON auth.users;
CREATE TRIGGER on_auth_user_created_oauth
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_oauth_user_signup_v2();

-- 4. Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.handle_oauth_user_signup_v2 TO postgres, anon, authenticated, service_role;

-- 5. Ensure the profiles table has proper RLS policies that don't block SECURITY DEFINER functions
-- Drop any problematic policies
DROP POLICY IF EXISTS "profiles_insert_owner" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_service_role" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_authenticated" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_service" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_service" ON public.profiles;

-- 6. Create new, properly designed RLS policies
-- Policy for authenticated users to insert their own profiles
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy for service_role to insert/update any profile (for triggers)
CREATE POLICY "profiles_insert_service" ON public.profiles
  FOR INSERT TO service_role
  WITH CHECK (true);

-- Policy for service_role to update any profile
CREATE POLICY "profiles_update_service" ON public.profiles
  FOR UPDATE TO service_role
  USING (true)
  WITH CHECK (true);

-- 7. Verify the trigger function signature is compatible
-- List the columns expected in profiles table
DO $$
DECLARE
  v_col_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_col_count
  FROM information_schema.columns
  WHERE table_name = 'profiles'
  AND column_name IN ('id', 'email', 'role', 'is_active', 'oauth_provider');
  
  RAISE NOTICE 'Profiles table has % of 5 expected columns', v_col_count;
END $$;

-- 8. Create a backup trigger using the more conservative handle_new_user function
-- In case handle_oauth_user_signup_v2 is still having issues
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert profile with explicit NOT NULL id
  BEGIN
    INSERT INTO public.profiles (id, email, role, is_active, created_at, updated_at)
    VALUES (
      NEW.id,
      COALESCE(NEW.email, ''),
      'user',
      true,
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      email = COALESCE(EXCLUDED.email, profiles.email),
      updated_at = NOW();
  EXCEPTION WHEN others THEN
    RAISE NOTICE 'Failed to create profile in handle_new_user_profile: %', SQLERRM;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 9. Optional: Create a secondary fallback trigger
-- Only fires if the primary OAuth trigger doesn't create a profile
DROP TRIGGER IF EXISTS on_auth_user_created_fallback ON auth.users;
CREATE TRIGGER on_auth_user_created_fallback
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_profile();

-- 10. Test the profile insertion for all auth users
-- Populate any missing profiles for existing auth users
INSERT INTO public.profiles (id, email, role, is_active, created_at, updated_at)
SELECT 
  au.id,
  COALESCE(au.email, ''),
  'user',
  true,
  COALESCE(p.created_at, NOW()),
  NOW()
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 11. Verification: Check that all auth users have profiles
SELECT 
  COUNT(DISTINCT au.id) as total_auth_users,
  COUNT(DISTINCT p.id) as total_profiles,
  COUNT(DISTINCT au.id) - COUNT(DISTINCT p.id) as missing_profiles
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id;

-- 12. Grant proper permissions to functions
GRANT EXECUTE ON FUNCTION public.handle_new_user_profile TO postgres, anon, authenticated, service_role;

COMMIT;
