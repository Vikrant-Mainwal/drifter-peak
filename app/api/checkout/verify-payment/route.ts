import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyRazorpaySignature } from "@/lib/razorpay/verify";
import type { VerifyPaymentPayload } from "@/types/index";

export async function POST(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "You must be logged in" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as VerifyPaymentPayload | null;

  if (
    !body?.order_id ||
    !body.razorpay_order_id ||
    !body.razorpay_payment_id ||
    !body.razorpay_signature
  ) {
    return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
  }

  // Defense-in-depth ownership check. confirm_order_payment() itself doesn't
  // check user_id (it relies on razorpay_order_id being unguessable), so we
  // check it here before ever calling the RPC.
  const { data: order } = await supabase
    .from("orders")
    .select("id, user_id, status")
    .eq("id", body.order_id)
    .eq("user_id", user.id)
    .single();

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Signature verification happens here, in our server-side route, before
  // ever calling confirm_order_payment() — exactly as that function's
  // contract requires (it trusts this has already happened).
  const isValid = verifyRazorpaySignature(
    body.razorpay_order_id,
    body.razorpay_payment_id,
    body.razorpay_signature,
  );

  if (!isValid) {
    // Release the reserved stock immediately instead of waiting out the
    // 30-minute expiry.
    await supabase.rpc("cancel_order", {
      p_order_id: order.id,
      p_reason: "Signature verification failed",
    });
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }

  const { error: confirmError } = await supabase.rpc("confirm_order_payment", {
    p_order_id: body.order_id,
    p_razorpay_order_id: body.razorpay_order_id,
    p_razorpay_payment_id: body.razorpay_payment_id,
    p_razorpay_signature: body.razorpay_signature,
  });

  if (confirmError) {
    return NextResponse.json({ error: confirmError.message }, { status: 409 });
  }

  // Best-effort — a failure here shouldn't fail a payment that already succeeded.
  await supabase.rpc("clear_cart");

  return NextResponse.json({ success: true, order_id: order.id });
}
