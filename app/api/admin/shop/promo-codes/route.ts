import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Fetch all promo codes
    const { data: promoCodes, error } = await supabase
      .from('shop_promo_codes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ promoCodes })
  } catch (error) {
    console.error('[v0] Admin GET promo codes error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch promo codes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()

    const { code, discount_type, discount_value, max_uses, expires_at, is_active } = body

    // Validate required fields
    if (!code || !discount_type || discount_value === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate discount type
    if (!['percentage', 'fixed'].includes(discount_type)) {
      return NextResponse.json(
        { error: 'Invalid discount type. Must be "percentage" or "fixed"' },
        { status: 400 }
      )
    }

    // Insert promo code
    const { data: promoCode, error } = await supabase
      .from('shop_promo_codes')
      .insert([
        {
          code: code.toUpperCase(),
          discount_type,
          discount_value,
          max_uses: max_uses || null,
          expires_at: expires_at || null,
          is_active: is_active !== false,
        },
      ])
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Promo code already exists' },
          { status: 400 }
        )
      }
      throw error
    }

    return NextResponse.json(
      { promoCode, message: 'Promo code created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] Admin POST promo code error:', error)
    return NextResponse.json(
      { error: 'Failed to create promo code' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Promo code ID is required' },
        { status: 400 }
      )
    }

    // Update promo code
    const { data: promoCode, error } = await supabase
      .from('shop_promo_codes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      promoCode,
      message: 'Promo code updated successfully',
    })
  } catch (error) {
    console.error('[v0] Admin PUT promo code error:', error)
    return NextResponse.json(
      { error: 'Failed to update promo code' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Promo code ID is required' },
        { status: 400 }
      )
    }

    // Delete promo code
    const { error } = await supabase
      .from('shop_promo_codes')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ message: 'Promo code deleted successfully' })
  } catch (error) {
    console.error('[v0] Admin DELETE promo code error:', error)
    return NextResponse.json(
      { error: 'Failed to delete promo code' },
      { status: 500 }
    )
  }
}
