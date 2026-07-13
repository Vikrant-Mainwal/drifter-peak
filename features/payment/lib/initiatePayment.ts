"use client";

import { loadRazorpayScript } from "./razorpayCheckout";
import type { CreateOrderResponse } from "../types";

interface InitiatePaymentParams {
  addressId: string;
  customerName: string;
  customerPhone: string;
}

interface InitiatePaymentResult {
  ok: boolean;
  /** Present whenever an order row was actually created server-side,
   *  even on failure — used to route to /payment/failure with the id. */
  orderId?: string;
  /** "dismissed" means the shopper closed the Razorpay modal themselves —
   *  the caller shouldn't show an error toast for that case. */
  error?: string;
}

/**
 * Orchestrates the full payment flow: creates the order server-side,
 * loads the Razorpay script, opens the checkout modal, and verifies the
 * payment. Redirect/navigation stays the caller's responsibility (the
 * checkout page) so this stays a pure, reusable function.
 */
export async function initiateRazorpayPayment({
  addressId,
  customerName,
  customerPhone,
}: InitiatePaymentParams): Promise<InitiatePaymentResult> {
  const res = await fetch("/api/checkout/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address_id: addressId }),
  });
  const data = (await res.json()) as CreateOrderResponse & { error?: string };

  if (!res.ok) {
    return { ok: false, error: data.error ?? "Couldn't start checkout" };
  }

  const scriptLoaded = await loadRazorpayScript();
  if (!scriptLoaded) {
    return {
      ok: false,
      error: "Couldn't load the payment gateway. Check your connection.",
    };
  }

  return new Promise<InitiatePaymentResult>((resolve) => {
    const rzp = new window.Razorpay({
      key: data.key_id,
      amount: data.amount,
      currency: data.currency,
      order_id: data.razorpay_order_id,
      name: "Drifter Peak",
      description: `Order ${data.order_id.slice(0, 8).toUpperCase()}`,
      prefill: {
        name: customerName,
        contact: customerPhone,
      },
      theme: { color: "#000000" },
      handler: async (response) => {
        try {
          const verifyRes = await fetch("/api/checkout/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, order_id: data.order_id }),
          });
          if (!verifyRes.ok) throw new Error("verification failed");
          resolve({ ok: true, orderId: data.order_id });
        } catch {
          resolve({ ok: false, orderId: data.order_id, error: "verification_failed" });
        }
      },
      modal: {
        ondismiss: () => resolve({ ok: false, error: "dismissed" }),
      },
    });

    rzp.on("payment.failed", () => {
      resolve({ ok: false, orderId: data.order_id, error: "payment_failed" });
    });

    rzp.open();
  });
}
