"use client";

import { useState } from "react";
import { Tag, X } from "lucide-react";
import type { AppliedCoupon } from "@/features/checkout/types/checkout";
import { formatPrice } from "@/lib/utils";

interface Props {
  applied: AppliedCoupon | null;
  onApply: (code: string) => Promise<string | null>; // returns an error message, or null on success
  onRemove: () => void;
}

export function CouponSection({ applied, onApply, onRemove }: Props) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleApply() {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    const errorMessage = await onApply(code.trim().toUpperCase());
    setLoading(false);
    if (errorMessage) {
      setError(errorMessage);
    } else {
      setCode("");
    }
  }

  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-5">
      <div className="flex items-center gap-2">
        <Tag size={16} className="text-[color:var(--muted)]" />
        <h3 className="font-display text-lg uppercase tracking-tight">
          Coupon
        </h3>
      </div>

      {applied ? (
        <div className="mt-3 flex items-center justify-between rounded-xl border border-[color:var(--accent)]/40 bg-[color:var(--accent)]/10 px-4 py-3">
          <div>
            <p className="text-sm font-medium">{applied.code}</p>
            <p className="text-xs text-[color:var(--muted)]">
              You saved {formatPrice(applied.discountAmount)}
            </p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove coupon"
            className="rounded-full p-1 hover:bg-[color:var(--border)]/40"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="mt-3">
          <div className="flex gap-2">
            <input
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleApply()}
              placeholder="Enter coupon code"
              className="flex-1 rounded-xl border border-[color:var(--border)] bg-transparent px-4 py-2.5 text-sm uppercase tracking-wide outline-none focus:border-[color:var(--fg)]"
            />
            <button
              type="button"
              onClick={handleApply}
              disabled={loading || !code.trim()}
              className="shrink-0 rounded-xl bg-[color:var(--fg)] px-5 py-2.5 text-sm font-medium text-[color:var(--bg)] disabled:opacity-40"
            >
              {loading ? "..." : "Apply"}
            </button>
          </div>
          {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
        </div>
      )}
    </div>
  );
}
