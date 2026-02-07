-- Fix for Auth Callback Error: Missing user_id Column in profiles Table
-- Error: ERROR: column "user_id" of relation "profiles" does not exist (SQLSTATE 42703)
-- This migration adds the user_id column and fixes related constraints

-- 1. Add user_id column to profiles table (nullable initially)
DO $$
BEGIN
  ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS user_id UUID;
EXCEPTION WHEN duplicate_column THEN
  -- Column already exists, continue
  NULL;
END $$;

-- 2. Populate user_id from id (assuming profiles.id = auth.users.id)
UPDATE public.profiles
SET user_id = id
WHERE user_id IS NULL;

-- 3. Make user_id non-null after populating
ALTER TABLE public.profiles
ALTER COLUMN user_id SET NOT NULL;

-- 4. Create unique index on user_id for faster lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_user_id 
ON public.profiles(user_id);

-- 5. Add foreign key constraint (using DEFERRABLE to handle pending events)
DO $$
BEGIN
  ALTER TABLE public.profiles
  ADD CONSTRAINT fk_profiles_user_id 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE
  ON UPDATE CASCADE
  DEFERRABLE INITIALLY DEFERRED;
EXCEPTION WHEN duplicate_object THEN
  -- Constraint already exists, continue
  NULL;
END $$;

-- 6. Update the handle_oauth_user_signup function to include user_id
CREATE OR REPLACE FUNCTION public.handle_oauth_user_signup()
RETURNS TRIGGER AS $$
DECLARE
  v_provider TEXT;
BEGIN
  -- Extract the provider from the raw_user_meta_data
  v_provider := COALESCE(NEW.raw_user_meta_data->>'provider', 'email');
  
  -- Insert a profile row when a new user is created
  INSERT INTO public.profiles (id, user_id, email, role, is_active, oauth_provider)
  VALUES (
    NEW.id,
    NEW.id,
    NEW.email,
    'user',
    true,
    v_provider
  )
  ON CONFLICT (id) DO UPDATE SET
    user_id = COALESCE(EXCLUDED.user_id, NEW.id),
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

-- 7. Update the handle_new_user function to be compatible with profiles table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Try to insert into profiles instead of users table
  INSERT INTO public.profiles (
    id,
    user_id,
    email,
    role,
    is_active,
    email_verified
  )
  VALUES (
    NEW.id,
    NEW.id,
    NEW.email,
    'user',
    true,
    COALESCE(NEW.email_confirmed_at IS NOT NULL, false)
  )
  ON CONFLICT (id) DO UPDATE SET
    user_id = COALESCE(EXCLUDED.user_id, NEW.id),
    email = EXCLUDED.email,
    is_active = true,
    email_verified = COALESCE(NEW.email_confirmed_at IS NOT NULL, public.profiles.email_verified),
    updated_at = NOW();
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail signup
  RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

-- 8. Grant execute permissions on both functions
GRANT EXECUTE ON FUNCTION public.handle_oauth_user_signup TO postgres, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user TO postgres, anon, authenticated, service_role;

-- 9. Update RLS policies to account for user_id column in queries
DROP POLICY IF EXISTS "profiles_insert_service_role" ON public.profiles;
CREATE POLICY "profiles_insert_service_role" ON public.profiles
FOR INSERT
TO service_role
WITH CHECK (true);

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own" ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id AND auth.uid() = user_id);

-- 10. Create policy for selecting own profile
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id OR auth.uid() = user_id);

-- 11. Create policy for updating own profile
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id AND auth.uid() = user_id)
WITH CHECK (auth.uid() = id AND auth.uid() = user_id);

-- 12. Verify the column exists and is properly configured
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'profiles' 
AND column_name IN ('id', 'user_id')
ORDER BY ordinal_position;
