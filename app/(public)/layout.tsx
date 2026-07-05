"use client";

import { Navbar } from "@/components/layout/Navbar";
import { CartDrawer } from "@/features/cart/components/cart/CartDrawer";
import { CartSyncProvider } from "@/features/cart/components/providers/CartSyncProvider";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CartSyncProvider>
        <Navbar />
        <CartDrawer />
        <main>{children}</main>
      </CartSyncProvider>
    </>
  );
}
