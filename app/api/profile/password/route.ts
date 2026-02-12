/**
 * Password Change Endpoint
 * POST /api/profile/password - Record password change (called after Supabase updates password)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { changePassword } from '@/lib/services/profile-service';

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

    // Record password change in profile
    await changePassword(user.id);

    return NextResponse.json({
      success: true,
      message: 'Password change recorded'
    });
  } catch (error) {
    console.error('[v0] Password change recording error:', error);
    // Don't fail the response - password was changed in Supabase
    // This is just for tracking
    return NextResponse.json({
      success: true,
      warning: 'Password changed but tracking failed'
    });
  }
}
