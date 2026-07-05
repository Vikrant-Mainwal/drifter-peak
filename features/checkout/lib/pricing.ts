import { FREE_SHIPPING_THRESHOLD, FLAT_SHIPPING_FEE } from "./constants";
import { formatPrice } from "@/lib/utils";

export interface PricingLineItem {
  price: number;
  mrp: number;
  quantity: number;
}

export interface OrderTotals {
  mrpTotal: number;
  itemDiscount: number;
  subtotal: number;
  couponDiscount: number;
  shippingFee: number;
  grandTotal: number;
  shippingMessage: string;
  amountToFreeShipping: number;
}

/**
 * Pure function: derives the full price breakdown for a set of cart/order
 * line items plus an optional coupon discount. No IO, safe to reuse both
 * client-side (checkout page) and server-side (order creation) once a
 * coupons table exists.
 */
export function computeOrderTotals(
  items: PricingLineItem[],
  couponDiscount = 0,
): OrderTotals {
  const mrpTotal = items.reduce((sum, i) => sum + i.mrp * i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemDiscount = Math.max(mrpTotal - subtotal, 0);

  const cappedCouponDiscount = Math.min(couponDiscount, subtotal);
  const payable = Math.max(subtotal - cappedCouponDiscount, 0);

  const shippingFee = payable >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;
  const amountToFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - payable, 0);

  const grandTotal = payable + shippingFee;

  const shippingMessage =
    shippingFee === 0
      ? `You saved ${formatPrice(FLAT_SHIPPING_FEE)} on shipping`
      : `Spend ${formatPrice(amountToFreeShipping)} more for Free Shipping`;

  return {
    mrpTotal,
    itemDiscount,
    subtotal,
    couponDiscount: cappedCouponDiscount,
    shippingFee,
    grandTotal,
    shippingMessage,
    amountToFreeShipping,
  };
}
