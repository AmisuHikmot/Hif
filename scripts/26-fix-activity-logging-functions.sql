-- Migration: Fix Activity Logging Functions
-- Date: 2026-02-07
-- Purpose: Consolidate activity logging functions and fix Supabase Auth callback failures
-- 
-- This migration:
-- 1. Drops all overloaded versions of activity logging functions
-- 2. Creates a unified 'user_logs' table with proper structure
-- 3. Creates a single 'log_user_activity' function with consistent signature
-- 4. Grants proper execute permissions for Supabase Auth integration
-- 5. Ensures no RLS conflicts during auth callbacks

-- ============================================================================
-- STEP 1: Drop conflicting function overloads
-- ============================================================================

-- Drop old activity logging functions to prevent signature conflicts
DROP FUNCTION IF EXISTS public.log_user_activity(UUID, VARCHAR(50), TEXT, JSONB) CASCADE;
DROP FUNCTION IF EXISTS public.log_user_activity(UUID, TEXT, TEXT, JSONB) CASCADE;
DROP FUNCTION IF EXISTS public.log_activity(UUID, VARCHAR, VARCHAR, UUID, JSONB) CASCADE;

-- ============================================================================
-- STEP 2: Ensure user_logs table exists with correct schema
-- ============================================================================

-- Create or validate user_logs table structure
CREATE TABLE IF NOT EXISTS public.user_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_logs_user_id ON public.user_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_logs_action ON public.user_logs(action);
CREATE INDEX IF NOT EXISTS idx_user_logs_created_at ON public.user_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_logs_entity ON public.user_logs(entity_type, entity_id);

-- ============================================================================
-- STEP 3: Create unified log_user_activity function
-- ============================================================================

-- Define canonical log_user_activity function with consistent signature
-- Signature: (p_user_id UUID, p_action TEXT, p_description TEXT, p_metadata JSONB)
CREATE OR REPLACE FUNCTION public.log_user_activity(
  p_user_id UUID,
  p_action TEXT,
  p_description TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_log_id UUID;
BEGIN
  -- Validate inputs
  IF p_user_id IS NULL THEN
    RAISE WARNING 'log_user_activity called with NULL user_id';
    RETURN NULL;
  END IF;

  IF p_action IS NULL OR p_action = '' THEN
    RAISE WARNING 'log_user_activity called with empty action';
    RETURN NULL;
  END IF;

  -- Insert log entry
  INSERT INTO public.user_logs (
    user_id,
    action,
    description,
    metadata
  )
  VALUES (
    p_user_id,
    COALESCE(p_action, 'unknown'),
    p_description,
    COALESCE(p_metadata, '{}')
  )
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_log_id;

  RETURN v_log_id;

EXCEPTION WHEN OTHERS THEN
  -- Log errors but don't fail the calling operation
  RAISE WARNING 'Error in log_user_activity: %', SQLERRM;
  RETURN NULL;
END;
$$;

-- ============================================================================
-- STEP 4: Alternative overload for extended logging (with entity tracking)
-- ============================================================================

-- Create overload supporting entity_type and entity_id for relational logging
CREATE OR REPLACE FUNCTION public.log_user_activity(
  p_user_id UUID,
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id UUID,
  p_description TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_log_id UUID;
BEGIN
  -- Validate inputs
  IF p_user_id IS NULL THEN
    RAISE WARNING 'log_user_activity called with NULL user_id';
    RETURN NULL;
  END IF;

  IF p_action IS NULL OR p_action = '' THEN
    RAISE WARNING 'log_user_activity called with empty action';
    RETURN NULL;
  END IF;

  -- Insert log entry with entity tracking
  INSERT INTO public.user_logs (
    user_id,
    action,
    entity_type,
    entity_id,
    description,
    metadata
  )
  VALUES (
    p_user_id,
    COALESCE(p_action, 'unknown'),
    p_entity_type,
    p_entity_id,
    p_description,
    COALESCE(p_metadata, '{}')
  )
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_log_id;

  RETURN v_log_id;

EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error in log_user_activity (extended): %', SQLERRM;
  RETURN NULL;
END;
$$;

-- ============================================================================
-- STEP 5: Grant execute permissions for Supabase Auth integration
-- ============================================================================

-- Grant execute to all roles so auth callbacks work correctly
GRANT EXECUTE ON FUNCTION public.log_user_activity(UUID, TEXT, TEXT, JSONB) 
  TO postgres, anon, authenticated, service_role;

GRANT EXECUTE ON FUNCTION public.log_user_activity(UUID, TEXT, TEXT, UUID, TEXT, JSONB) 
  TO postgres, anon, authenticated, service_role;

-- Grant table access for service role (used by auth triggers)
GRANT ALL ON public.user_logs TO service_role;
GRANT INSERT ON public.user_logs TO authenticated;
GRANT SELECT ON public.user_logs TO authenticated;

-- ============================================================================
-- STEP 6: Set up RLS policies (minimal, to avoid blocking triggers)
-- ============================================================================

-- Enable RLS but allow service role to bypass
ALTER TABLE public.user_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view their own logs
DROP POLICY IF EXISTS "Users can view their own logs" ON public.user_logs;
CREATE POLICY "Users can view their own logs"
  ON public.user_logs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Allow service role to manage all logs (for auth triggers)
DROP POLICY IF EXISTS "Service role can manage logs" ON public.user_logs;
CREATE POLICY "Service role can manage logs"
  ON public.user_logs FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow system to insert logs during signup
DROP POLICY IF EXISTS "System can insert logs" ON public.user_logs;
CREATE POLICY "System can insert logs"
  ON public.user_logs FOR INSERT
  TO authenticated, service_role
  WITH CHECK (true);

-- ============================================================================
-- STEP 7: Create trigger for OAuth user signup logging (if needed)
-- ============================================================================

-- Function to log user signup via auth trigger
CREATE OR REPLACE FUNCTION public.log_auth_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log user signup event
  PERFORM public.log_user_activity(
    NEW.id,
    'signup',
    'User registered: ' || COALESCE(NEW.email, 'unknown'),
    jsonb_build_object(
      'email', NEW.email,
      'provider', COALESCE(NEW.raw_user_meta_data ->> 'provider', 'email'),
      'auth_method', CASE 
        WHEN NEW.raw_user_meta_data ? 'provider' THEN 'oauth'
        ELSE 'email'
      END
    )
  );
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Don't fail auth signup if logging fails
  RAISE WARNING 'Error logging auth signup: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- Only create trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created_logging ON auth.users;
CREATE TRIGGER on_auth_user_created_logging
  AFTER INSERT ON auth.users
  FOR EACH ROW
  WHEN (NEW.email_confirmed_at IS NOT NULL OR NEW.raw_user_meta_data ? 'provider')
  EXECUTE FUNCTION public.log_auth_signup();

-- ============================================================================
-- STEP 8: Verification and documentation
-- ============================================================================

-- Verify function signatures are created correctly
-- SELECT proname, pg_get_function_arguments(oid) 
-- FROM pg_proc 
-- WHERE proname = 'log_user_activity' AND pronamespace = 'public'::regnamespace;

-- Verify user_logs table structure
-- \d public.user_logs

-- Verify RLS policies
-- SELECT policyname, permissive, roles, qual, with_check 
-- FROM pg_policies 
-- WHERE tablename = 'user_logs';

-- ============================================================================
-- DOCUMENTATION
-- ============================================================================
/*
FUNCTION: log_user_activity

PURPOSE:
Provides a unified interface for logging user activity to the user_logs table.
Supports both simple activity logging and entity-related logging.

SIGNATURES:
1. log_user_activity(UUID, TEXT, TEXT, JSONB)
   - user_id: The UUID of the user performing the action
   - action: The type of action (e.g., 'signup', 'donation', 'event_registration')
   - description: Human-readable description of the action
   - metadata: Additional context as JSON

2. log_user_activity(UUID, TEXT, TEXT, UUID, TEXT, JSONB)
   - user_id: The UUID of the user performing the action
   - action: The type of action
   - entity_type: The type of entity affected (e.g., 'event', 'donation')
   - entity_id: The UUID of the affected entity
   - description: Human-readable description
   - metadata: Additional context as JSON

USAGE EXAMPLES:

-- Simple activity logging
SELECT public.log_user_activity(
  user_id::UUID,
  'login',
  'User logged in from app',
  '{"ip": "192.168.1.1"}'::JSONB
);

-- Entity-related activity logging
SELECT public.log_user_activity(
  user_id::UUID,
  'event_registration',
  'events',
  event_id::UUID,
  'Registered for: ' || event_title,
  jsonb_build_object('event_title', event_title, 'registration_date', NOW())
);

SECURITY:
- Function has SECURITY DEFINER to bypass RLS for auth callbacks
- Set search_path to prevent search injection attacks
- Includes exception handling to prevent auth failures if logging fails
- RLS policies allow users to view only their own logs
- Service role can manage logs for auth triggers

RETURNS:
- UUID: The ID of the created log entry, or NULL if logging failed
*/
