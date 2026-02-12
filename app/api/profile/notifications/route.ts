/**
 * Notification Preferences API Routes
 * GET /api/profile/notifications - Get notification preferences
 * PUT /api/profile/notifications - Update notification preferences
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  getNotificationPreferences,
  updateNotificationPreferences
} from '@/lib/services/profile-service';

/**
 * GET /api/profile/notifications
 */
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

    const preferences = await getNotificationPreferences(user.id);

    return NextResponse.json(preferences || {
      emailNotifications: true,
      smsNotifications: false,
      newsletter: true,
      eventReminders: true,
      donationUpdates: true,
      communityDigest: false,
      generalAnnouncements: true
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

    const updates = await request.json();

    const updated = await updateNotificationPreferences(user.id, updates);

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[v0] PUT /api/profile/notifications error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
