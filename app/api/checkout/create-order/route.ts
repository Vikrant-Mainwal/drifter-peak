import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { razorpay } from "@/lib/razorpay/client";
import type { Order } from "@/types";



export async function POST(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "You must be logged in to check out" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const address_id: string | undefined = body?.address_id;

  if (!address_id) {
    return NextResponse.json({ error: "address_id is required" }, { status: 400 });
  }

  // RLS scopes this to the caller's own cart_items automatically — no need
  // to look up the cart id first. We check out everything currently in the
  // cart; there's no partial-selection UI yet.
  const { data: cartItems, error: cartError } = await supabase
    .from("cart_items")
    .select("id");

  if (cartError) {
    return NextResponse.json({ error: "Couldn't read your cart" }, { status: 500 });
  }

  if (!cartItems || cartItems.length === 0) {
    return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });
  }

  // checkout_cart() re-validates address ownership, re-reads live stock and
  // prices, locks the relevant rows, and either creates the order + reserves
  // stock atomically, or fails with every specific reason listed — nothing
  // here is trusted from the client or from what the cart displayed.
  const { data, error: checkoutError } = await supabase
    .rpc("checkout_cart", {
      p_cart_item_ids: cartItems.map((i) => i.id),
      p_address_id: address_id,
    })
    .single();

    const order = data as Order;

  if (checkoutError || !order) {
    // Postgres exception messages from checkout_cart() are already
    // written to be shown to the shopper (e.g. "Checkout failed: Void
    // Hoodie: only 2 left in stock (you requested 3)").
    return NextResponse.json(
      { error: checkoutError?.message ?? "Checkout failed" },
      { status: 409 },
    );
  }

  try {
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.total_amount * 100),
      currency: "INR",
      receipt: order.order_number,
      notes: { order_id: order.id, user_id: user.id },
    });

    const { error: refError } = await supabase.rpc("set_order_razorpay_reference", {
      p_order_id: order.id,
      p_razorpay_order_id: razorpayOrder.id,
    });

    if (refError) throw refError;

    return NextResponse.json({
      razorpay_order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      order_id: order.id,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch {
    // Don't leave stock reserved for 30 minutes over a gateway hiccup —
    // release it immediately. cancel_order() is owner-checked and restores
    // stock for every line item.
    await supabase.rpc("cancel_order", {
      p_order_id: order.id,
      p_reason: "Payment gateway error during order creation",
    });

    return NextResponse.json({ error: "Payment gateway error, please retry" }, { status: 502 });
  }
}
