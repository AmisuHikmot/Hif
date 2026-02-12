/**
 * Profile Service
 * Handles all profile-related CRUD operations and data management
 */

import { createClient } from '@supabase/supabase-js';
import {
  uploadProfilePicture,
  deleteProfilePicture,
  getProfilePicturePublicUrl,
  cleanupOldProfilePicture
} from '@/lib/supabase/storage';
import { generateTOTPSecret, generateBackupCodes, hashBackupCode } from '@/lib/auth/totp';

// Types
export interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  bio: string | null;
  occupation: string | null;
  organization: string | null;
  website: string | null;
  profile_picture_url: string | null;
  profile_picture_uploaded_at: string | null;
  notification_preferences: NotificationPreferences | null;
  last_password_change: string | null;
  password_change_count: number;
  updated_at: string | null;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  newsletter: boolean;
  eventReminders: boolean;
  donationUpdates: boolean;
  communityDigest: boolean;
  generalAnnouncements: boolean;
}

export interface TOTPSecret {
  id: string;
  user_id: string;
  secret: string;
  backup_codes: string[];
  is_enabled: boolean;
  setup_at: string;
  verified_at: string | null;
}

export interface TwoFAStatus {
  is_enabled: boolean;
  setup_at: string | null;
  verified_at: string | null;
  has_backup_codes: boolean;
}

/**
 * Get Supabase client for database operations
 */
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase configuration');
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Get admin Supabase client for server-side operations
 */
export function getSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase admin configuration');
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

/**
 * Get user profile by ID
 */
export async function getProfile(userId: string): Promise<UserProfile | null> {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('[v0] Error fetching profile:', error);
      return null;
    }

    return data as UserProfile;
  } catch (error) {
    console.error('[v0] Profile fetch error:', error);
    return null;
  }
}

/**
 * Update user profile
 */
export async function updateProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<UserProfile | null> {
  try {
    const supabase = getSupabaseClient();

    // Remove read-only fields
    const { id, email, ...safeUpdates } = updates;

    const { data, error } = await supabase
      .from('profiles')
      .update(safeUpdates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('[v0] Error updating profile:', error);
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    return data as UserProfile;
  } catch (error) {
    console.error('[v0] Profile update error:', error);
    throw error;
  }
}

/**
 * Upload profile picture and update profile
 */
export async function uploadAndUpdateProfilePicture(
  userId: string,
  file: File,
  currentProfile: UserProfile | null
): Promise<string> {
  try {
    // Upload to storage
    const filePath = await uploadProfilePicture(userId, file);

    // Get public URL
    const profilePictureUrl = getProfilePicturePublicUrl(filePath);

    // Update profile with new URL
    await updateProfile(userId, {
      profile_picture_url: profilePictureUrl,
      profile_picture_uploaded_at: new Date().toISOString()
    });

    // Clean up old picture if it exists
    if (currentProfile?.profile_picture_url) {
      // Try to extract file path from URL (if using public URLs)
      // For now, we'll skip cleanup for public URLs
      // In production, consider storing file paths instead of URLs
    }

    return profilePictureUrl;
  } catch (error) {
    console.error('[v0] Profile picture upload error:', error);
    throw error;
  }
}

/**
 * Delete profile picture
 */
export async function deleteUserProfilePicture(userId: string): Promise<void> {
  try {
    const supabase = getSupabaseClient();

    // Get current profile
    const profile = await getProfile(userId);
    if (!profile?.profile_picture_url) {
      return; // No picture to delete
    }

    // Extract file path from URL (assuming format: bucketUrl/path/to/file)
    // For now, we'll update the profile without deleting from storage
    // In production, store file paths in DB for easier cleanup

    // Clear profile picture URL
    await updateProfile(userId, {
      profile_picture_url: null,
      profile_picture_uploaded_at: null
    });
  } catch (error) {
    console.error('[v0] Delete profile picture error:', error);
    throw error;
  }
}

/**
 * Get notification preferences
 */
export async function getNotificationPreferences(
  userId: string
): Promise<NotificationPreferences | null> {
  try {
    const profile = await getProfile(userId);
    return profile?.notification_preferences || null;
  } catch (error) {
    console.error('[v0] Error fetching notification preferences:', error);
    return null;
  }
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(
  userId: string,
  preferences: Partial<NotificationPreferences>
): Promise<NotificationPreferences | null> {
  try {
    const currentPrefs = await getNotificationPreferences(userId);
    const updatedPrefs = {
      ...currentPrefs,
      ...preferences
    } as NotificationPreferences;

    const profile = await updateProfile(userId, {
      notification_preferences: updatedPrefs
    });

    return profile?.notification_preferences || null;
  } catch (error) {
    console.error('[v0] Error updating notification preferences:', error);
    throw error;
  }
}

/**
 * Setup 2FA for user - generates secret and backup codes
 */
export async function setup2FA(userId: string): Promise<{
  secret: string;
  qrCodeUri: string;
  backupCodes: string[];
}> {
  try {
    const supabase = getSupabaseClient();

    // Generate secret
    const secret = generateTOTPSecret();

    // Generate backup codes
    const backupCodes = generateBackupCodes();
    const hashedBackupCodes = backupCodes.map(code => hashBackupCode(code));

    // Get user email for QR code
    const { data: userData } = await supabase.auth.getUser();
    const email = userData?.user?.email || '';

    // Create TOTP QR code URI
    const { generateTOTPQRCodeURI } = await import('@/lib/auth/totp');
    const qrCodeUri = generateTOTPQRCodeURI(secret, email);

    // Store in database (but don't enable yet)
    const { data: existingSecret } = await supabase
      .from('user_2fa_secrets')
      .select()
      .eq('user_id', userId)
      .single();

    if (existingSecret) {
      // Update existing
      await supabase
        .from('user_2fa_secrets')
        .update({
          secret,
          backup_codes: hashedBackupCodes,
          is_enabled: false,
          setup_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
    } else {
      // Create new
      await supabase.from('user_2fa_secrets').insert({
        user_id: userId,
        secret,
        backup_codes: hashedBackupCodes,
        is_enabled: false,
        setup_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    return {
      secret,
      qrCodeUri,
      backupCodes: backupCodes.map(code => {
        // Format for display: XXXX-XXXX
        return `${code.substring(0, 4)}-${code.substring(4, 8)}`;
      })
    };
  } catch (error) {
    console.error('[v0] 2FA setup error:', error);
    throw error;
  }
}

/**
 * Verify and enable 2FA
 */
export async function verify2FASetup(
  userId: string,
  token: string
): Promise<boolean> {
  try {
    const { verifyTOTPToken } = await import('@/lib/auth/totp');
    const supabase = getSupabaseClient();

    // Get the unverified secret
    const { data: secretData, error: fetchError } = await supabase
      .from('user_2fa_secrets')
      .select()
      .eq('user_id', userId)
      .eq('is_enabled', false)
      .single();

    if (fetchError || !secretData) {
      throw new Error('No 2FA setup found');
    }

    // Verify token
    const isValid = verifyTOTPToken(secretData.secret, token);
    if (!isValid) {
      return false;
    }

    // Enable 2FA
    const { error: updateError } = await supabase
      .from('user_2fa_secrets')
      .update({
        is_enabled: true,
        verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (updateError) {
      throw updateError;
    }

    return true;
  } catch (error) {
    console.error('[v0] 2FA verification error:', error);
    throw error;
  }
}

/**
 * Get 2FA status for user
 */
export async function get2FAStatus(userId: string): Promise<TwoFAStatus | null> {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('user_2fa_secrets')
      .select()
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      is_enabled: data.is_enabled,
      setup_at: data.setup_at,
      verified_at: data.verified_at,
      has_backup_codes: Array.isArray(data.backup_codes) && data.backup_codes.length > 0
    };
  } catch (error) {
    console.error('[v0] Error fetching 2FA status:', error);
    return null;
  }
}

/**
 * Disable 2FA for user
 */
export async function disable2FA(userId: string): Promise<void> {
  try {
    const supabase = getSupabaseClient();

    const { error } = await supabase
      .from('user_2fa_secrets')
      .update({
        is_enabled: false,
        verified_at: null,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('[v0] Error disabling 2FA:', error);
    throw error;
  }
}

/**
 * Verify 2FA token during login
 */
export async function verify2FALogin(
  userId: string,
  token: string
): Promise<boolean> {
  try {
    const { verifyTOTPToken, verifyBackupCode, cleanBackupCode, hashBackupCode } = await import('@/lib/auth/totp');
    const supabase = getSupabaseClient();

    // Get 2FA secret
    const { data: secretData, error: fetchError } = await supabase
      .from('user_2fa_secrets')
      .select()
      .eq('user_id', userId)
      .eq('is_enabled', true)
      .single();

    if (fetchError || !secretData) {
      throw new Error('2FA not configured');
    }

    // Try TOTP verification first
    const cleanToken = token.replace(/\s/g, '');
    if (/^\d{6}$/.test(cleanToken)) {
      if (verifyTOTPToken(secretData.secret, cleanToken)) {
        // Record successful attempt
        await recordTOTPAttempt(userId, true);
        return true;
      }
    }

    // Try backup code
    const cleanBackup = cleanBackupCode(token);
    if (/^[A-F0-9]{8}$/i.test(cleanBackup)) {
      const backupCodes = secretData.backup_codes || [];
      for (let i = 0; i < backupCodes.length; i++) {
        if (verifyBackupCode(cleanBackup, backupCodes[i])) {
          // Mark backup code as used
          const updatedCodes = [...backupCodes];
          updatedCodes.splice(i, 1);

          await supabase
            .from('user_2fa_secrets')
            .update({
              backup_codes: updatedCodes,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', userId);

          // Record backup code usage
          await recordBackupCodeUsage(userId, cleanBackup);
          return true;
        }
      }
    }

    // Record failed attempt
    await recordTOTPAttempt(userId, false);
    return false;
  } catch (error) {
    console.error('[v0] 2FA login verification error:', error);
    return false;
  }
}

/**
 * Record TOTP attempt for rate limiting
 */
async function recordTOTPAttempt(
  userId: string,
  success: boolean
): Promise<void> {
  try {
    const supabase = getSupabaseClient();

    await supabase.from('user_2fa_attempts').insert({
      user_id: userId,
      success,
      attempt_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.warn('[v0] Error recording 2FA attempt:', error);
  }
}

/**
 * Record backup code usage
 */
async function recordBackupCodeUsage(
  userId: string,
  code: string
): Promise<void> {
  try {
    const { hashBackupCode } = await import('@/lib/auth/totp');
    const supabase = getSupabaseClient();

    await supabase.from('user_2fa_backup_code_usage').insert({
      user_id: userId,
      backup_code_hash: hashBackupCode(code),
      used_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.warn('[v0] Error recording backup code usage:', error);
  }
}

/**
 * Check if user has exceeded 2FA attempt limit (rate limiting)
 */
export async function check2FARateLimit(
  userId: string,
  maxAttempts: number = 5,
  windowMinutes: number = 15
): Promise<{ allowed: boolean; remainingAttempts: number; lockoutUntil?: Date }> {
  try {
    const supabase = getSupabaseClient();

    const since = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();

    const { data, error, count } = await supabase
      .from('user_2fa_attempts')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .eq('success', false)
      .gte('attempt_at', since);

    if (error) {
      throw error;
    }

    const failedAttempts = count || 0;

    if (failedAttempts >= maxAttempts) {
      const lockoutDate = new Date(Date.now() + windowMinutes * 60 * 1000);
      return {
        allowed: false,
        remainingAttempts: 0,
        lockoutUntil: lockoutDate
      };
    }

    return {
      allowed: true,
      remainingAttempts: maxAttempts - failedAttempts
    };
  } catch (error) {
    console.error('[v0] Error checking 2FA rate limit:', error);
    return { allowed: true, remainingAttempts: 5 }; // Default to allowing if error
  }
}

/**
 * Change user password and update tracking
 */
export async function changePassword(userId: string): Promise<void> {
  try {
    const supabase = getSupabaseClient();

    // Increment password change count
    const profile = await getProfile(userId);
    const newCount = (profile?.password_change_count || 0) + 1;

    await updateProfile(userId, {
      last_password_change: new Date().toISOString(),
      password_change_count: newCount
    });
  } catch (error) {
    console.error('[v0] Error recording password change:', error);
    throw error;
  }
}
