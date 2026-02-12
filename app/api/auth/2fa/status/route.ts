/**
 * 2FA Status API Route
 * GET /api/auth/2fa/status - Get 2FA status for current user
 * DELETE /api/auth/2fa/status - Disable 2FA
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { get2FAStatus, disable2FA } from '@/lib/services/profile-service';

export async function GET(request: NextRequest) {
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

    const status = await get2FAStatus(user.id);

    return NextResponse.json(status || {
      is_enabled: false,
      setup_at: null,
      verified_at: null,
      has_backup_codes: false
    });
  } catch (error) {
    console.error('[v0] 2FA status error:', error);
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

    // Require password confirmation (client should handle this)
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: 'Password confirmation required' },
        { status: 400 }
      );
    }

    // Verify password using Supabase auth
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email || '',
      password
    });

    if (signInError) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    await disable2FA(user.id);

    return NextResponse.json({
      success: true,
      message: '2FA has been disabled'
    });
  } catch (error) {
    console.error('[v0] 2FA disable error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
