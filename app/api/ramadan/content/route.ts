import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'reflection-verse') {
      const { data, error } = await supabase
        .from('reflection_verses')
        .select('*')
        .eq('is_featured', true)
        .limit(1)
        .single();

      if (error) throw error;
      return NextResponse.json(data);
    }

    if (type === 'daily-reminders') {
      const { data, error } = await supabase
        .from('daily_reminders')
        .select('*')
        .order('day_number', { ascending: true });

      if (error) throw error;
      return NextResponse.json(data);
    }

    if (type === 'knowledge') {
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .order('order_rank', { ascending: true });

      if (error) throw error;
      return NextResponse.json(data);
    }

    if (type === 'duas') {
      const { data, error } = await supabase
        .from('duas')
        .select('*')
        .order('order_rank', { ascending: true });

      if (error) throw error;
      return NextResponse.json(data);
    }

    if (type === 'charity') {
      const { data, error } = await supabase
        .from('charity_information')
        .select('*')
        .limit(1)
        .single();

      if (error) throw error;
      return NextResponse.json(data);
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
