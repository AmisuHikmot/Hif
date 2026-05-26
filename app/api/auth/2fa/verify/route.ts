/**
 * 2FA Verification API Route
 * POST /api/auth/2fa/verify - Verify TOTP token and enable 2FA
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyTOTPToken } from '@/lib/auth/totp';

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

    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    const { data: secretData, error: fetchError } = await supabase
      .from('user_2fa_secrets')
      .select('secret')
      .eq('user_id', user.id)
      .eq('is_enabled', false)
      .single();

    if (fetchError || !secretData) {
      return NextResponse.json(
        { error: 'No 2FA setup found' },
        { status: 404 }
      );
    }

    const isValid = verifyTOTPToken(secretData.secret, token);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabase
      .from('user_2fa_secrets')
      .update({
        is_enabled: true,
        verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      message: '2FA has been enabled'
    });
  } catch (error) {
    console.error('[v0] 2FA verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
