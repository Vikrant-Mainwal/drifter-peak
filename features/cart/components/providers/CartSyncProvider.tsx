"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "../../lib/store/cartStore";

export function CartSyncProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      useCartStore.getState().loadCart(user?.id ?? null);
    }
  }, [user?.id, loading]);

  return <>{children}</>;
}

// Usage — app/layout.tsx:
{/* <CartSyncProvider>{children}</CartSyncProvider> */}