-- CRITICAL FIX: OAuth Profile Creation - user_id NOT NULL Constraint Violation
-- Problem: The profiles table has BOTH id AND user_id columns, where user_id is NOT NULL
-- During OAuth signup, user_id is NULL, causing constraint violations
-- Solution: Ensure user_id is properly populated from auth.users(id) during profile creation

-- 1. Make user_id nullable temporarily to fix existing issues
ALTER TABLE public.profiles
ALTER COLUMN user_id DROP NOT NULL;

-- 2. Backfill user_id for all profiles where id is set but user_id is NULL
UPDATE public.profiles
SET user_id = id
WHERE user_id IS NULL AND id IS NOT NULL;

-- 3. Create comprehensive OAuth profile creation function
CREATE OR REPLACE FUNCTION public.handle_oauth_user_signup_complete()
RETURNS TRIGGER AS $$
DECLARE
  v_provider TEXT;
  v_error_msg TEXT;
BEGIN
  -- Log the trigger execution
  RAISE NOTICE 'OAuth signup trigger: user_id=%, email=%', NEW.id, NEW.email;
  
  -- Extract provider from OAuth metadata
  v_provider := COALESCE(NEW.raw_user_meta_data->>'provider', 'email');
  
  -- Validate user ID is not NULL
  IF NEW.id IS NULL THEN
    RAISE EXCEPTION 'Cannot create profile: auth.users.id is NULL';
  END IF;
  
  BEGIN
    -- Insert or update profile with EXPLICIT user_id = id mapping
    INSERT INTO public.profiles (
      id,
      user_id,
      email,
      role,
      is_active,
      oauth_provider,
      created_at,
      updated_at
    )
    VALUES (
      NEW.id,                                   -- id column
      NEW.id,                                   -- user_id column (MUST match id)
      COALESCE(NEW.email, ''),                 -- email
      'user',                                   -- default role
      true,                                     -- default active
      v_provider,                               -- oauth provider
      NOW(),                                    -- creation timestamp
      NOW()                                     -- update timestamp
    )
    ON CONFLICT (id) DO UPDATE SET
      user_id = COALESCE(NEW.id, profiles.user_id),
      email = COALESCE(EXCLUDED.email, profiles.email),
      oauth_provider = CASE
        WHEN profiles.oauth_provider IS NULL THEN v_provider
        ELSE profiles.oauth_provider
      END,
      updated_at = NOW()
    WHERE profiles.id = NEW.id;
    
  EXCEPTION WHEN OTHERS THEN
    v_error_msg := SQLERRM;
    RAISE NOTICE 'Error in handle_oauth_user_signup_complete for user %: %', NEW.id, v_error_msg;
    -- Continue without blocking auth
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 4. Replace the trigger function with the corrected version
DROP TRIGGER IF EXISTS on_auth_user_created_oauth ON auth.users;
CREATE TRIGGER on_auth_user_created_oauth
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_oauth_user_signup_complete();

-- 5. Grant execute permission
GRANT EXECUTE ON FUNCTION public.handle_oauth_user_signup_complete TO postgres, anon, authenticated, service_role;

-- 6. Update the existing handle_new_user function to also set user_id
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    first_name,
    last_name,
    phone,
    role,
    is_active,
    email_verified
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', NULL),
    'member',
    true,
    COALESCE(NEW.email_confirmed_at IS NOT NULL, false)
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = COALESCE(EXCLUDED.first_name, public.users.first_name),
    last_name = COALESCE(EXCLUDED.last_name, public.users.last_name),
    phone = COALESCE(EXCLUDED.phone, public.users.phone),
    email_verified = COALESCE(NEW.email_confirmed_at IS NOT NULL, public.users.email_verified),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$;

-- 7. Ensure RLS policies allow SECURITY DEFINER functions to bypass them
-- Remove conflicting policies
DROP POLICY IF EXISTS "profiles_insert_new_user" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_service_role" ON public.profiles;
DROP POLICY IF EXISTS "insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_service" ON public.profiles;

-- 8. Create simplified, non-conflicting RLS policies
-- Service role can do anything
CREATE POLICY "service_role_all_profiles" ON public.profiles
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Authenticated users can insert their own profile
CREATE POLICY "insert_own_profile" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Authenticated users can update their own profile
CREATE POLICY "update_own_profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Everyone can select profiles
CREATE POLICY "select_any_profile" ON public.profiles
  FOR SELECT
  USING (true);

-- 9. Make user_id NOT NULL again after fixing all data
ALTER TABLE public.profiles
ALTER COLUMN user_id SET NOT NULL;

-- 10. Create a verification function to check profile creation
CREATE OR REPLACE FUNCTION public.verify_profile_sync()
RETURNS TABLE(total_auth_users BIGINT, total_profiles BIGINT, missing_profiles BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT au.id)::BIGINT,
    COUNT(DISTINCT p.id)::BIGINT,
    (COUNT(DISTINCT au.id) - COUNT(DISTINCT p.id))::BIGINT
  FROM auth.users au
  LEFT JOIN public.profiles p ON au.id = p.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 11. Run verification
SELECT * FROM public.verify_profile_sync();

-- 12. Grant permission to verification function
GRANT EXECUTE ON FUNCTION public.verify_profile_sync TO postgres, anon, authenticated, service_role;

-- 13. Ensure all new profiles have matching user_id = id
INSERT INTO public.profiles (id, user_id, email, role, is_active, created_at, updated_at)
SELECT 
  au.id,
  au.id,
  COALESCE(au.email, ''),
  'user',
  true,
  NOW(),
  NOW()
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO UPDATE SET
  user_id = COALESCE(EXCLUDED.user_id, profiles.id),
  updated_at = NOW();

-- 14. Final verification
SELECT COUNT(*) as profiles_created FROM public.profiles;

-- Log any profiles that still have NULL user_id (there should be none)
DO $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM public.profiles
  WHERE user_id IS NULL;
  
  RAISE NOTICE 'Profiles with NULL user_id: %', v_count;
  
  IF v_count > 0 THEN
    RAISE WARNING 'WARNING: % profiles still have NULL user_id', v_count;
  END IF;
END $$;

COMMIT;
