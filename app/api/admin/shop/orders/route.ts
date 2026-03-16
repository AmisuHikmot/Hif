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

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const paymentStatus = searchParams.get('payment_status')
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    let query = supabase
      .from('shop_orders_enhanced')
      .select(
        `
        *,
        items:shop_order_items_enhanced(
          id,
          product_name,
          product_type,
          quantity,
          unit_price,
          subtotal
        )
      `,
        { count: 'exact' }
      )

    // Apply filters
    if (status) {
      query = query.eq('order_status', status)
    }
    if (paymentStatus) {
      query = query.eq('payment_status', paymentStatus)
    }

    // Apply pagination
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data: orders, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      orders,
      pagination: {
        total: count,
        limit,
        offset,
      },
    })
  } catch (error) {
    console.error('[v0] Admin GET orders error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
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
    const { id, order_status, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Validate order status if provided
    if (order_status && !['processing', 'shipped', 'delivered', 'cancelled'].includes(order_status)) {
      return NextResponse.json(
        { error: 'Invalid order status' },
        { status: 400 }
      )
    }

    // Update order
    const { data: order, error } = await supabase
      .from('shop_orders_enhanced')
      .update({
        order_status,
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(
        `
        *,
        items:shop_order_items_enhanced(
          id,
          product_name,
          product_type,
          quantity,
          unit_price,
          subtotal
        )
      `
      )
      .single()

    if (error) throw error

    return NextResponse.json({
      order,
      message: 'Order updated successfully',
    })
  } catch (error) {
    console.error('[v0] Admin PUT order error:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
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
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Archive order by setting status to cancelled
    const { error } = await supabase
      .from('shop_orders_enhanced')
      .update({
        order_status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ message: 'Order cancelled successfully' })
  } catch (error) {
    console.error('[v0] Admin DELETE order error:', error)
    return NextResponse.json(
      { error: 'Failed to cancel order' },
      { status: 500 }
    )
  }
}
