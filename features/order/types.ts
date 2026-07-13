/**
 * Matches supabase/migrations/20260703115122_create_orders_system.sql
 * exactly — orders_status_check constraint:
 *   'pending_payment' | 'paid' | 'processing' | 'packed' | 'shipped' |
 *   'delivered' | 'cancelled' | 'returned' | 'exchanged'
 *
 * The previous version of this type (pending/confirmed/refunded, etc.)
 * didn't match the database at all, so OrderStatusBadge never rendered a
 * real order's actual status correctly.
 */
export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "processing"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned"
  | "exchanged";

/** Statuses cancel_order() in the backend will actually accept. */
export const CANCELLABLE_STATUSES: readonly OrderStatus[] = [
  "pending_payment",
  "paid",
  "processing",
];

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

  payment_method: string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;

  expires_at: string | null;
  paid_at: string | null;
  cancelled_at: string | null;
  cancelled_reason: string | null;
  cancelled_by: "user" | "admin" | "system" | null;

  created_at: string;
  updated_at: string;

  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  variant_id: string;
  product_id: string;

  // Snapshot fields, frozen at checkout — see checkout_cart() in
  // 20260703115228_create_checkout_system.sql. product_slug is nullable
  // because products.slug itself is nullable (`slug text unique`, no
  // NOT NULL) — a product without a slug at purchase time snapshots as
  // NULL here too, by design.
  product_name: string;
  product_slug: string | null;
  sku: string | null;
  size: string | null;
  color: string | null;
  thumbnail_url: string | null;

  unit_price: number;
  mrp: number;
  quantity: number;
  line_total: number;

  created_at: string;
}
