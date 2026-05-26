-- ============================================================================
-- SCRIPT 31: Enhance Profiles Table & Create 2FA Infrastructure
-- ============================================================================
-- Purpose: Add profile picture support, 2FA management, password tracking,
-- and notification preferences to the profiles system

-- ============================================================================
-- SECTION 1: Enhance Profiles Table
-- ============================================================================

-- Add new columns to public.profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS profile_picture_url TEXT,
ADD COLUMN IF NOT EXISTS profile_picture_uploaded_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{
  "emailNotifications": true,
  "smsNotifications": false,
  "newsletter": true,
  "eventReminders": true,
  "donationUpdates": true,
  "communityDigest": false,
  "generalAnnouncements": true
}'::jsonb,
ADD COLUMN IF NOT EXISTS last_password_change TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS password_change_count INTEGER DEFAULT 0;

-- Create index for profile picture lookups
CREATE INDEX IF NOT EXISTS idx_profiles_profile_picture_url 
ON public.profiles(profile_picture_url) 
WHERE profile_picture_url IS NOT NULL;

-- ============================================================================
-- SECTION 2: Create 2FA Secrets Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_2fa_secrets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  secret TEXT NOT NULL, -- TOTP secret (encrypted in application)
  backup_codes TEXT[] NOT NULL, -- Encrypted backup codes
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  setup_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_2fa_secrets_user_id 
ON public.user_2fa_secrets(user_id);
CREATE INDEX IF NOT EXISTS idx_user_2fa_secrets_is_enabled 
ON public.user_2fa_secrets(is_enabled);

-- ============================================================================
-- SECTION 3: Create 2FA Attempt Tracking (Rate Limiting)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_2fa_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  attempt_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  ip_address TEXT,
  success BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for rate limiting queries
CREATE INDEX IF NOT EXISTS idx_user_2fa_attempts_user_id_time 
ON public.user_2fa_attempts(user_id, attempt_at DESC);

-- ============================================================================
-- SECTION 4: Create 2FA Backup Code Usage Tracking
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_2fa_backup_code_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  backup_code_hash TEXT NOT NULL, -- Hash of used backup code
  used_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for lookup
CREATE INDEX IF NOT EXISTS idx_user_2fa_backup_code_usage_user_id 
ON public.user_2fa_backup_code_usage(user_id);

-- ============================================================================
-- SECTION 5: Enable RLS on New Tables
-- ============================================================================

ALTER TABLE public.user_2fa_secrets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_2fa_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_2fa_backup_code_usage ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- SECTION 6: RLS Policies for user_2fa_secrets
-- ============================================================================

-- Users can view their own 2FA secrets
CREATE POLICY "users_can_view_own_2fa_secrets"
ON public.user_2fa_secrets
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can create their own 2FA secrets
CREATE POLICY "users_can_create_own_2fa_secrets"
ON public.user_2fa_secrets
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own 2FA secrets
CREATE POLICY "users_can_update_own_2fa_secrets"
ON public.user_2fa_secrets
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own 2FA secrets
CREATE POLICY "users_can_delete_own_2fa_secrets"
ON public.user_2fa_secrets
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ============================================================================
-- SECTION 7: RLS Policies for user_2fa_attempts
-- ============================================================================

-- Users can view their own 2FA attempts (for security audit)
CREATE POLICY "users_can_view_own_2fa_attempts"
ON public.user_2fa_attempts
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Service can insert 2FA attempts
CREATE POLICY "service_can_create_2fa_attempts"
ON public.user_2fa_attempts
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- SECTION 8: RLS Policies for user_2fa_backup_code_usage
-- ============================================================================

-- Users can view their own backup code usage
CREATE POLICY "users_can_view_own_backup_code_usage"
ON public.user_2fa_backup_code_usage
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Service can insert backup code usage
CREATE POLICY "service_can_create_backup_code_usage"
ON public.user_2fa_backup_code_usage
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- SECTION 9: Update Profiles RLS for New Columns
-- ============================================================================

-- Ensure users can update notification_preferences on their profile
-- This should already be covered by existing RLS but making explicit
CREATE POLICY "users_can_update_own_notification_preferences"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ============================================================================
-- SECTION 10: Create Storage Bucket Configuration Function
-- ============================================================================

-- This function will be called from application code to ensure bucket exists
CREATE OR REPLACE FUNCTION public.ensure_storage_bucket_exists()
RETURNS void AS $$
BEGIN
  -- Note: Bucket creation is typically handled via Supabase dashboard
  -- or via application startup code using admin client
  -- This is a placeholder for documentation
  RAISE NOTICE 'Ensure profile-pictures bucket exists with RLS enabled';
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SECTION 11: Create Helper Function for 2FA Status
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_user_2fa_status(user_uuid UUID)
RETURNS TABLE (
  is_enabled BOOLEAN,
  setup_at TIMESTAMP WITH TIME ZONE,
  verified_at TIMESTAMP WITH TIME ZONE,
  has_backup_codes BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    user_2fa_secrets.is_enabled,
    user_2fa_secrets.setup_at,
    user_2fa_secrets.verified_at,
    (array_length(user_2fa_secrets.backup_codes, 1) > 0)
  FROM public.user_2fa_secrets
  WHERE user_2fa_secrets.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SECTION 12: Create Audit Trail for Profile Changes
-- ============================================================================

-- Add column to profiles for audit tracking
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at_trigger
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_profiles_updated_at();

-- ============================================================================
-- SECTION 13: Grant Permissions
-- ============================================================================

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_2fa_secrets TO authenticated;
GRANT SELECT, INSERT ON public.user_2fa_attempts TO authenticated;
GRANT SELECT, INSERT ON public.user_2fa_backup_code_usage TO authenticated;

-- ============================================================================
-- END OF SCRIPT 31
-- ============================================================================
