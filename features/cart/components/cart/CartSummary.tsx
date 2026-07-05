interface Props {
  subtotal: number; shipping: number; tax: number; total: number;
}

export function CartSummary({ subtotal, shipping, tax, total }: Props) {
  const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;
  return (
    <div className="space-y-3 text-sm">
      <div className="flex justify-between text-neutral-600">
        <span>Subtotal</span><span>{fmt(subtotal)}</span>
      </div>
      <div className="flex justify-between text-neutral-600">
        <span>Shipping</span>
        <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>{shipping === 0 ? 'FREE' : fmt(shipping)}</span>
      </div>
      <div className="flex justify-between text-neutral-600">
        <span>GST (18%)</span><span>{fmt(tax)}</span>
      </div>
      <div className="border-t border-neutral-200 pt-3 flex justify-between font-semibold text-neutral-900">
        <span>Total</span><span>{fmt(total)}</span>
      </div>
      {subtotal < 2000 && subtotal > 0 && (
        <p className="text-xs text-neutral-500">
          Add {fmt(2000 - subtotal)} more for free shipping
        </p>
      )}
    </div>
  );
}