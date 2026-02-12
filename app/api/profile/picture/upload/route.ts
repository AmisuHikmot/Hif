/**
 * Profile Picture Upload API Route
 * POST /api/profile/picture/upload - Upload a new profile picture
 * DELETE /api/profile/picture/upload - Delete profile picture
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  uploadAndUpdateProfilePicture,
  deleteUserProfilePicture,
  getProfile
} from '@/lib/services/profile-service';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

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

    // Get current profile
    const currentProfile = await getProfile(user.id);

    // Upload and update profile
    const url = await uploadAndUpdateProfilePicture(user.id, file, currentProfile);

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
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await deleteUserProfilePicture(user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[v0] Picture delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
