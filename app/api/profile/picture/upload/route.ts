/**
 * Profile Picture Upload API Route
 * POST /api/profile/picture/upload - Upload a new profile picture
 * DELETE /api/profile/picture/upload - Delete profile picture
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const BUCKET_NAME = 'profile_picture';
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function getFilePath(userId: string, file: File) {
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  return `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE || !ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Please upload a JPEG, PNG, or WebP image up to 5MB' },
        { status: 400 }
      );
    }

    const filePath = getFilePath(user.id, file);
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
        cacheControl: '3600'
      });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
    const url = publicUrlData.publicUrl;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        profile_picture_url: url,
        profile_picture_uploaded_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateError) throw updateError;

    return NextResponse.json({ url });
  } catch (error) {
    console.error('[v0] Picture upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        profile_picture_url: null,
        profile_picture_uploaded_at: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[v0] Picture delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
