import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { razorpay } from '@/lib/razorpay/client';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { order_id } = await req.json();
    if (!order_id) return NextResponse.json({ error: 'order_id required' }, { status: 400 });

    // Fetch order and verify ownership
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .eq('user_id', user.id)
      .single();
    if (orderErr || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Amount in paise
    const amountInPaise = Math.round(order.total * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: order_id,
      notes: { order_id, user_id: user.id },
    });

    // Save payment record
    await supabase.from('payments').insert({
      order_id,
      razorpay_order_id: razorpayOrder.id,
      amount: order.total,
      currency: 'INR',
      status: 'pending',
    });

    return NextResponse.json({
      razorpay_order_id: razorpayOrder.id,
      amount: amountInPaise,
      currency: 'INR',
      order_id,
    });
  } catch (e) {
    console.error('[razorpay-create]', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}