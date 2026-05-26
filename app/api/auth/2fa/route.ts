/**
 * 2FA API Routes
 * POST /api/auth/2fa/setup - Generate TOTP secret
 * POST /api/auth/2fa/verify - Verify TOTP token and enable 2FA
 * POST /api/auth/2fa/disable - Disable 2FA
 * GET /api/auth/2fa/status - Get 2FA status
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateBackupCodes, generateTOTPQRCodeURI, generateTOTPSecret, hashBackupCode } from '@/lib/auth/totp';

/**
 * POST /api/auth/2fa/setup
 * Generate a new TOTP secret for 2FA setup
 */
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

    // Get URL path to determine action
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const action = pathParts[pathParts.length - 1];

    if (action === '2fa') {
      // Default POST to /api/auth/2fa - setup
      const secret = generateTOTPSecret();
      const backupCodes = generateBackupCodes();
      const hashedBackupCodes = backupCodes.map((code) => hashBackupCode(code));

      const { error: upsertError } = await supabase
        .from('user_2fa_secrets')
        .upsert(
          {
            user_id: user.id,
            secret,
            backup_codes: hashedBackupCodes,
            is_enabled: false,
            setup_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          { onConflict: 'user_id' }
        );

      if (upsertError) throw upsertError;

      return NextResponse.json({
        secret,
        qrCodeUri: generateTOTPQRCodeURI(secret, user.email || ''),
        backupCodes: backupCodes.map((code) => `${code.substring(0, 4)}-${code.substring(4, 8)}`)
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('[v0] 2FA API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
