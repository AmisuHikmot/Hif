/**
 * Supabase Storage Utilities
 * Handles file uploads, deletions, and URL generation
 */

import { createClient } from '@supabase/supabase-js';

const BUCKET_NAME = 'profile-pictures';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

/**
 * Initialize Supabase client for storage operations
 */
function getStorageClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase configuration');
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Get admin client for server-side operations (requires service role key)
 */
export function getStorageAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase admin configuration');
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

/**
 * Validate file before upload
 */
export function validateProfilePicture(
  file: File
): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`
    };
  }

  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'File type not supported. Please use JPEG, PNG, or WebP'
    };
  }

  // Check file extension
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: 'Invalid file extension'
    };
  }

  return { valid: true };
}

/**
 * Generate a unique filename for profile picture
 */
function generateFileName(userId: string, originalName: string): string {
  const timestamp = Date.now();
  const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  const randomString = Math.random().toString(36).substring(2, 8);

  return `${userId}/${timestamp}-${randomString}.${extension}`;
}

/**
 * Upload profile picture to storage
 * Returns the file path (not the full URL)
 */
export async function uploadProfilePicture(
  userId: string,
  file: File
): Promise<string> {
  try {
    // Validate file
    const validation = validateProfilePicture(file);
    if (!validation.valid) {
      throw new Error(validation.error || 'File validation failed');
    }

    // Get client
    const supabase = getStorageClient();

    // Generate filename
    const filePath = generateFileName(userId, file.name);

    // Convert File to Buffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload file
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
        cacheControl: '3600'
      });

    if (error) {
      console.error('[v0] Storage upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    return filePath;
  } catch (error) {
    console.error('[v0] Profile picture upload error:', error);
    throw error;
  }
}

/**
 * Delete profile picture from storage
 */
export async function deleteProfilePicture(filePath: string): Promise<void> {
  try {
    if (!filePath) {
      return; // Nothing to delete
    }

    const supabase = getStorageAdminClient();

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('[v0] Storage delete error:', error);
      throw new Error(`Delete failed: ${error.message}`);
    }
  } catch (error) {
    console.error('[v0] Profile picture delete error:', error);
    throw error;
  }
}

/**
 * Get a signed URL for a profile picture (valid for 1 hour)
 */
export async function getProfilePictureSignedUrl(
  filePath: string,
  expiresIn: number = 3600
): Promise<string> {
  try {
    if (!filePath) {
      return ''; // No file
    }

    const supabase = getStorageAdminClient();

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      console.error('[v0] Signed URL error:', error);
      throw new Error(`Failed to generate URL: ${error.message}`);
    }

    return data.signedUrl;
  } catch (error) {
    console.error('[v0] Get signed URL error:', error);
    throw error;
  }
}

/**
 * Get public URL for profile picture (works if bucket has public read access)
 */
export function getProfilePicturePublicUrl(filePath: string): string {
  if (!filePath) {
    return '';
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error('Missing Supabase URL');
  }

  return `${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/${filePath}`;
}

/**
 * Ensure storage bucket exists and has proper configuration
 * This should be called during application initialization
 */
export async function ensureProfilePicturesBucket(): Promise<void> {
  try {
    const supabase = getStorageAdminClient();

    // Try to get bucket
    const { data: buckets, error: listError } = await supabase.storage
      .listBuckets();

    if (listError) {
      console.error('[v0] Error listing buckets:', listError);
      return;
    }

    // Check if bucket exists
    const bucketExists = buckets?.some((b) => b.name === BUCKET_NAME);

    if (!bucketExists) {
      // Create bucket
      const { error: createError } = await supabase.storage
        .createBucket(BUCKET_NAME, {
          public: false,
          fileSizeLimit: MAX_FILE_SIZE
        });

      if (createError) {
        console.error('[v0] Error creating bucket:', createError);
        return;
      }

      console.log(`[v0] Created ${BUCKET_NAME} storage bucket`);
    }
  } catch (error) {
    console.error('[v0] Error ensuring bucket:', error);
    // Don't throw - this is non-critical initialization
  }
}

/**
 * Clean up old profile pictures when uploading a new one
 */
export async function cleanupOldProfilePicture(
  userId: string,
  oldFilePath: string | null
): Promise<void> {
  if (!oldFilePath) {
    return;
  }

  try {
    const supabase = getStorageAdminClient();

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([oldFilePath]);

    if (error) {
      // Log but don't throw - old file cleanup shouldn't fail the operation
      console.warn('[v0] Failed to cleanup old profile picture:', error);
    }
  } catch (error) {
    console.warn('[v0] Error cleaning up old profile picture:', error);
  }
}

/**
 * List all files in a user's directory
 * Useful for cleanup operations
 */
export async function listUserProfilePictures(
  userId: string
): Promise<string[]> {
  try {
    const supabase = getStorageAdminClient();

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(userId, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) {
      console.error('[v0] Error listing files:', error);
      return [];
    }

    return data?.map((file) => `${userId}/${file.name}`) || [];
  } catch (error) {
    console.error('[v0] Error listing user files:', error);
    return [];
  }
}
