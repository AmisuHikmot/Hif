/**
 * Notification Preferences API Routes
 * GET /api/profile/notifications - Get notification preferences
 * PUT /api/profile/notifications - Update notification preferences
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const DEFAULT_NOTIFICATION_PREFERENCES = {
  emailNotifications: true,
  smsNotifications: false,
  newsletter: true,
  eventReminders: true,
  donationUpdates: true,
  communityDigest: false,
  generalAnnouncements: true
};

/**
 * GET /api/profile/notifications
 */
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

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('notification_preferences')
      .eq('id', user.id)
      .single();

    if (error) throw error;

    return NextResponse.json({
      ...DEFAULT_NOTIFICATION_PREFERENCES,
      ...(profile?.notification_preferences || {})
    });
  } catch (error) {
    console.error('[v0] GET /api/profile/notifications error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/profile/notifications
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const updates = await request.json();
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('notification_preferences')
      .eq('id', user.id)
      .single();

    if (fetchError) throw fetchError;

    const updated = {
      ...DEFAULT_NOTIFICATION_PREFERENCES,
      ...(profile?.notification_preferences || {}),
      ...updates
    };

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        notification_preferences: updated,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateError) throw updateError;

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[v0] PUT /api/profile/notifications error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
