"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/features/cart/lib/store/cartStore";
import { getAddresses } from "@/lib/supabase/queries/addresses";
import type { Address } from "@/types/index";
import type { AppliedCoupon } from "@/features/checkout/types/checkout";
import { computeOrderTotals } from "@/features/checkout/lib/pricing";
import { CheckoutSummary } from "@/features/checkout/components/CheckoutSummary";
import { PriceBreakdown } from "@/features/checkout/components/PriceBreakdown";
import { AddressCard } from "@/features/checkout/components/AddressCard";
import { CouponSection } from "@/features/checkout/components/CouponSection";
import { StickyCheckoutBar } from "@/features/checkout/components/StickyCheckoutBar";
import { CheckoutSkeleton } from "@/features/checkout/components/CheckoutSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { ToastContainer } from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const cartLoading = useCartStore((s) => s.loading);
  const hydrated = useCartStore((s) => s.hydrated);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [placingOrder, setPlacingOrder] = useState(false);

  const { toasts, show, dismiss } = useToast();

  useEffect(() => {
    let cancelled = false;

    getAddresses()
      .then((data) => {
        if (cancelled) return;
        setAddresses(data);
        const preferred = data.find((a) => a.is_default) ?? data[0] ?? null;
        setSelectedAddressId(preferred?.id ?? null);
      })
      .catch(() => {
        if (!cancelled) show("Couldn't load your addresses", "error");
      })
      .finally(() => {
        if (!cancelled) setAddressesLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedAddress =
    addresses.find((a) => a.id === selectedAddressId) ?? null;

  const totals = computeOrderTotals(items, coupon?.discountAmount ?? 0);

  // Stubs — Address Popup (next feature) will replace these with a real
  // bottom-sheet flow instead of a toast.
  function handleEditAddress() {
    show("Address editing lands in the next feature", "info");
  }
  function handleChangeAddress() {
    show("Multiple addresses land in the next feature", "info");
  }
  function handleAddAddress() {
    show("Add-address flow lands in the next feature", "info");
  }

  // Stub — no coupons table exists yet. Swap this for a real Supabase/RPC
  // call later; CouponSection's props don't need to change.
  async function handleApplyCoupon(_code: string): Promise<string | null> {
    return "Coupons aren't available yet";
  }
  function handleRemoveCoupon() {
    setCoupon(null);
  }

  // Stub — Payment Flow (a later feature) will replace this with:
  // validate → create Razorpay order → open Razorpay → verify → create order.
  function handleProceedToPayment() {
    if (!selectedAddress) {
      show("Please add a delivery address first", "error");
      return;
    }
    setPlacingOrder(true);
    show("Payment flow lands in the next feature", "info");
    setTimeout(() => setPlacingOrder(false), 600);
  }

  if (!hydrated || cartLoading || addressesLoading) {
    return <CheckoutSkeleton />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Add something you love before checking out."
        action="Continue Shopping"
        actionHref="/shop"
      />
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-32 pt-8 md:grid md:grid-cols-[1fr_380px] md:gap-8 md:px-6 md:pb-12">
      <ToastContainer toasts={toasts} dismiss={dismiss} />

      <div className="space-y-4">
        <h1 className="font-display text-3xl uppercase tracking-tight">
          Checkout
        </h1>

        <AddressCard
          address={selectedAddress}
          onEdit={handleEditAddress}
          onChange={handleChangeAddress}
          onAddNew={handleAddAddress}
        />

        <CheckoutSummary items={items} />

        <CouponSection
          applied={coupon}
          onApply={handleApplyCoupon}
          onRemove={handleRemoveCoupon}
        />
      </div>

      <div className="mt-4 space-y-4 md:mt-0">
        <PriceBreakdown totals={totals} itemCount={items.length} />

        <div className="hidden md:block">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            loading={placingOrder}
            disabled={placingOrder}
            onClick={handleProceedToPayment}
          >
            Proceed to Payment
          </Button>
        </div>

        <p className="hidden text-center text-xs text-[color:var(--muted)] md:block">
          Secure checkout powered by Razorpay
        </p>
      </div>

      <StickyCheckoutBar
        grandTotal={totals.grandTotal}
        loading={placingOrder}
        onProceed={handleProceedToPayment}
      />

      <p className="mt-6 text-center text-xs text-[color:var(--muted)] md:hidden">
        <Link href="/cart" className="underline">
          Back to cart
        </Link>
      </p>
    </div>
  );
}
