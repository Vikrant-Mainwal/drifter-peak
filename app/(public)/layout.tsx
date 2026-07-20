"use client";

import { Navbar } from "@/components/layout/Navbar";
import { CartDrawer } from "@/features/cart/components/cart/CartDrawer";
import { CartSyncProvider } from "@/features/cart/components/providers/CartSyncProvider";
import { AddressSyncProvider } from "@/features/address/components/AddressSyncProvider";
import { Footer } from "@/components/layout/Footer";

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
           <Footer />
        </AddressSyncProvider>
      </CartSyncProvider>
    </>
  );
}
