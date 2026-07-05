import { ArrowRight, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Props {
  grandTotal: number;
  disabled?: boolean;
  loading?: boolean;
  onProceed: () => void;
}

export function StickyCheckoutBar({
  grandTotal,
  disabled,
  loading,
  onProceed,
}: Props) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[color:var(--border)] bg-[color:var(--bg)]/95 backdrop-blur-sm p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] md:hidden"
      role="region"
      aria-label="Checkout total and proceed"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-[color:var(--muted)]">
            Total
          </p>
          <p className="font-display text-xl">
            {formatPrice(grandTotal)}
          </p>
        </div>

        <button
          type="button"
          onClick={onProceed}
          disabled={disabled || loading}
          className="flex flex-1 max-w-[220px] items-center justify-center gap-2 rounded-full bg-[color:var(--fg)] py-3.5 text-sm font-medium text-[color:var(--bg)] disabled:opacity-40"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              Proceed to Payment
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
