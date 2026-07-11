// Address types live in one place — features/address/types.ts — and are
// re-exported here so code outside the address feature can import them
// from "@/types" without a second, drifting definition of the same shape.
export type { Address, AddressInsert, AddressUpdate, AddressType } from "@/features/address/types";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus = "pending" | "success" | "failed" | "refunded";

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: OrderStatus;

  shipping_name: string;
  shipping_phone: string;
  shipping_address_type: string;
  shipping_pincode: string;
  shipping_house_number: string;
  shipping_address_line: string;
  shipping_locality: string;
  shipping_city: string;
  shipping_state: string;

  subtotal: number;
  shipping_fee: number;
  discount_amount: number;
  total_amount: number;

  payment_method: string | null;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;

  expires_at: string | null;
  paid_at: string | null;
  cancelled_at: string | null;
  cancelled_reason: string | null;
  cancelled_by: string | null;

  created_at: string;
  updated_at: string;

  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  variant_id: string;
  product_id: string;
  product_name: string;
  product_slug: string | null;
  sku: string | null;
  size: string;
  color: string | null;
  thumbnail_url: string | null;
  unit_price: number;
  mrp: number;
  quantity: number;
  line_total: number;
  created_at: string;
}

export interface CreateOrderPayload {
  address_id: string;
}

export interface RazorpayOrderResponse {
  razorpay_order_id: string;
  amount: number;
  currency: string;
  order_id: string; // our DB order id
  key_id: string;
}

export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  order_id: string;
}
