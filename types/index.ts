
export type OrderStatus =
  | 'pending' | 'confirmed' | 'processing'
  | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded';

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
  created_at: string;
}

export type AddressInsert = Omit<Address, 'id' | 'user_id' | 'created_at'>;

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
  size: string;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  address_id: string;
  status: OrderStatus;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  address?: Address;
  order_items?: OrderItem[];
  payments?: Payment[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
  size: string;
}

export interface Payment {
  id: string;
  order_id: string;
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  failure_reason?: string;
  created_at: string;
}

export interface CreateOrderPayload {
  cart_items: CartItem[];
  address_id: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface RazorpayOrderResponse {
  razorpay_order_id: string;
  amount: number;
  currency: string;
  order_id: string; // our DB order id
}

export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  order_id: string;
}