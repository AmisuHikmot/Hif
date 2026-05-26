/**
 * Password Change Endpoint
 * POST /api/profile/password - Record password change (called after Supabase updates password)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

    const { data: profile } = await supabase
      .from('profiles')
      .select('password_change_count')
      .eq('id', user.id)
      .single();

    await supabase
      .from('profiles')
      .update({
        last_password_change: new Date().toISOString(),
        password_change_count: (profile?.password_change_count || 0) + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

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
