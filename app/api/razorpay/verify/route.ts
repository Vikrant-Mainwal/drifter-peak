import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyRazorpaySignature } from '@/lib/razorpay/verify';
import type { VerifyPaymentPayload } from '@/types/index';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload: VerifyPaymentPayload = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id,
    } = payload;

    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      // Mark payment failed
      await supabase
        .from('payments')
        .update({ status: 'failed', failure_reason: 'Signature mismatch' })
        .eq('razorpay_order_id', razorpay_order_id);

      await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', order_id);

      return NextResponse.json({ success: false, error: 'Payment verification failed' }, { status: 400 });
    }

    // Update payment record
    await supabase
      .from('payments')
      .update({
        razorpay_payment_id,
        razorpay_signature,
        status: 'success',
      })
      .eq('razorpay_order_id', razorpay_order_id);

    // Update order status
    await supabase
      .from('orders')
      .update({ status: 'confirmed' })
      .eq('id', order_id);

    // Clear cart
    await supabase.from('cart_items').delete().eq('user_id', user.id);

    return NextResponse.json({ success: true, order_id });
  } catch (e) {
    console.error('[razorpay-verify]', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}