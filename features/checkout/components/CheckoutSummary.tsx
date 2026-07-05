"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import type { CartItem } from "@/features/cart/types/cart";
import { formatPrice } from "@/lib/utils";

interface Props {
  items: CartItem[];
}

export function CheckoutSummary({ items }: Props) {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between p-5"
        aria-expanded={open}
      >
        <h3 className="font-display text-lg uppercase tracking-tight">
          Order Summary ({items.length})
        </h3>
        <ChevronDown
          size={18}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="space-y-4 border-t border-[color:var(--border)] p-5 pt-4">
          {items.map((item) => (
            <div key={item.variant_id} className="flex gap-3">
              <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-[color:var(--border)]/30">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p className="mt-0.5 text-xs text-[color:var(--muted)]">
                    {[item.color, item.size].filter(Boolean).join(" / ")} · Qty{" "}
                    {item.quantity}
                  </p>
                </div>

                <div className="flex items-baseline gap-2 text-sm">
                  <span className="font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                  {item.mrp > item.price && (
                    <span className="text-xs text-[color:var(--muted)] line-through">
                      {formatPrice(item.mrp * item.quantity)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
