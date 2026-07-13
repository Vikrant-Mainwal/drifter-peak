/** What POST /api/checkout/create-order returns on success. */
export interface CreateOrderResponse {
  razorpay_order_id: string;
  amount: number;
  currency: string;
  order_id: string; // our internal orders.id
  key_id: string;
}

/** What POST /api/checkout/verify-payment expects as its body. */
export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  order_id: string;
}
