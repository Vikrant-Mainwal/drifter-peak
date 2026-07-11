"use client";

import { Navbar } from "@/components/layout/Navbar";
import { CartDrawer } from "@/features/cart/components/cart/CartDrawer";
import { CartSyncProvider } from "@/features/cart/components/providers/CartSyncProvider";
import { AddressSyncProvider } from "@/features/address/components/AddressSyncProvider";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CartSyncProvider>
        <AddressSyncProvider>
          <Navbar />
          <CartDrawer />
          <main>{children}</main>
        </AddressSyncProvider>
      </CartSyncProvider>
    </>
  );
}
