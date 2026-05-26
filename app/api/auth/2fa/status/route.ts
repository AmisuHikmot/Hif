/**
 * 2FA Status API Route
 * GET /api/auth/2fa/status - Get 2FA status for current user
 * DELETE /api/auth/2fa/status - Disable 2FA
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: status } = await supabase
      .from('user_2fa_secrets')
      .select('is_enabled, setup_at, verified_at, backup_codes')
      .eq('user_id', user.id)
      .single();

    return NextResponse.json(status ? {
      is_enabled: status.is_enabled,
      setup_at: status.setup_at,
      verified_at: status.verified_at,
      has_backup_codes: Array.isArray(status.backup_codes) && status.backup_codes.length > 0
    } : {
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
    const supabase = await createClient();

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

    const { error: updateError } = await supabase
      .from('user_2fa_secrets')
      .update({
        is_enabled: false,
        verified_at: null,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (updateError) throw updateError;

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
