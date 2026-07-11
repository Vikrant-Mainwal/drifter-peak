"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "../../lib/store/cartStore";
import { useHydrated } from "../../hooks/useHydrated";

export function CartIcon() {
  const mounted = useHydrated();

  const items = useCartStore((s) => s.items);
  const toggleCart = useCartStore((s) => s.toggleCart);

  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  if (!mounted) return null;

  return (
    <button
      onClick={toggleCart}
      className="relative p-2"
      aria-label="Open cart"
    >
      <ShoppingBag size={20} style={{ color: "var(--fg)" }} />
      {count > 0 && (
        <span
          className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 rounded-full font-mono text-[9px]"
          style={{
            background: "var(--muted)",
            color: "var(--bg)",
          }}
        >
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}
