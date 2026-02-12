/**
 * 2FA API Routes
 * POST /api/auth/2fa/setup - Generate TOTP secret
 * POST /api/auth/2fa/verify - Verify TOTP token and enable 2FA
 * POST /api/auth/2fa/disable - Disable 2FA
 * GET /api/auth/2fa/status - Get 2FA status
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  setup2FA,
  verify2FASetup,
  get2FAStatus,
  disable2FA,
  check2FARateLimit
} from '@/lib/services/profile-service';

/**
 * POST /api/auth/2fa/setup
 * Generate a new TOTP secret for 2FA setup
 */
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

    // Get URL path to determine action
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const action = pathParts[pathParts.length - 1];

    if (action === '2fa') {
      // Default POST to /api/auth/2fa - setup
      const result = await setup2FA(user.id);

      return NextResponse.json({
        secret: result.secret,
        qrCodeUri: result.qrCodeUri,
        backupCodes: result.backupCodes
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
