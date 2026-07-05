// No coupons table exists yet. This shape is what CouponSection works with
// today (purely client-side); swap the internals for a real Supabase/RPC
// call later without touching the component's props.
export interface AppliedCoupon {
  code: string;
  discountAmount: number;
}
