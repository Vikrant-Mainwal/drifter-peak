"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAddressStore } from "../lib/store/addressStore";

/**
 * The address store guards fetchAddresses() with a one-time `hasFetched`
 * flag so repeated calls (e.g. from the checkout page) don't refetch on
 * every render. That's fine — until the logged-in user changes. Without
 * this provider, `hasFetched` stays true forever, so switching accounts or
 * logging back in after a sign-out kept showing the previous user's
 * addresses (or none) until a hard refresh. This resets the store whenever
 * the user id actually changes.
 */
export function AddressSyncProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const lastUserId = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (loading) return;

    const currentId = user?.id ?? null;
    if (lastUserId.current === currentId) return;
    lastUserId.current = currentId;

    useAddressStore.getState().reset();

    if (currentId) {
      useAddressStore.getState().fetchAddresses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  return <>{children}</>;
}
