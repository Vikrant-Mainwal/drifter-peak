import type { OrderTotals } from "@/features/checkout/lib/pricing";
import { formatPrice } from "@/lib/utils";

interface Props {
  totals: OrderTotals;
  itemCount: number;
}

function Row({
  label,
  value,
  muted,
  strong,
}: {
  label: string;
  value: string;
  muted?: boolean;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className={muted ? "text-[color:var(--muted)]" : ""}>{label}</span>
      <span
        className={
          strong
            ? "font-display text-base"
            : muted
              ? "text-[color:var(--muted)]"
              : ""
        }
      >
        {value}
      </span>
    </div>
  );
}

export function PriceBreakdown({ totals, itemCount }: Props) {
  const {
    mrpTotal,
    itemDiscount,
    subtotal,
    couponDiscount,
    shippingFee,
    grandTotal,
    shippingMessage,
  } = totals;

  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-5">
      <h3 className="font-display text-lg uppercase tracking-tight mb-3">
        Price Details ({itemCount} {itemCount === 1 ? "item" : "items"})
      </h3>

      <div className="divide-y divide-[color:var(--border)]/60">
        <div>
          <Row label="MRP" value={formatPrice(mrpTotal)} />
          {itemDiscount > 0 && (
            <Row
              label="Discount on MRP"
              value={`− ${formatPrice(itemDiscount)}`}
            />
          )}
          {couponDiscount > 0 && (
            <Row
              label="Coupon Discount"
              value={`− ${formatPrice(couponDiscount)}`}
            />
          )}
          <Row
            label="Shipping"
            value={shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}
          />
        </div>

        <div className="pt-2">
          <Row
            label="Subtotal"
            value={formatPrice(subtotal - couponDiscount)}
            muted
          />
        </div>

        <div className="pt-2">
          <Row
            label="Grand Total"
            value={formatPrice(grandTotal)}
            strong
          />
        </div>
      </div>

      <p
        className={`mt-3 text-xs ${
          shippingFee === 0
            ? "text-[color:var(--accent)]"
            : "text-[color:var(--muted)]"
        }`}
      >
        {shippingMessage}
      </p>
    </div>
  );
}
