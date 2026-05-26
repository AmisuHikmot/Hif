import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'ramadan_reflection-verse') {
      const { data, error } = await supabase
        .from('ramadan_reflection_verses')
        .select('*')
        .eq('is_featured', true)
        .limit(1)
        .single();
      if (error) throw error;
      return NextResponse.json(data);
    }

    if (type === 'ramadan_daily-reminders') {
      const { data, error } = await supabase
        .from('ramadan_daily_reminders')
        .select('*')
        .order('day_number', { ascending: true });
      if (error) throw error;
      return NextResponse.json(data);
    }

    if (type === 'ramadan_knowledge') {
      const { data, error } = await supabase
        .from('ramadan_knowledge_base')
        .select('*')
        .order('order_rank', { ascending: true });
      if (error) throw error;
      return NextResponse.json(data);
    }

    if (type === 'ramadan_duas') {
      const { data, error } = await supabase
        .from('ramadan_duas')
        .select('*')
        .order('order_rank', { ascending: true });
      if (error) throw error;
      return NextResponse.json(data);
    }

    // ── FIXED: returns both charity info sections AND bank accounts ──
    if (type === 'ramadan_charity') {
      const [charityRes, bankRes] = await Promise.all([
        supabase
          .from('ramadan_charity_info')
          .select('*')
          .eq('is_active', true)
          .order('order_rank', { ascending: true }),
        supabase
          .from('ramadan_bank_accounts')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true }),
      ]);

      if (charityRes.error) throw charityRes.error;
      if (bankRes.error) throw bankRes.error;

      return NextResponse.json({
        charityInfo: charityRes.data ?? [],
        bankAccounts: bankRes.data ?? [],
      });
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  } catch (error) {
    console.error('[v0] Ramadan API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ramadan content' },
      { status: 500 }
    );
  }
}
