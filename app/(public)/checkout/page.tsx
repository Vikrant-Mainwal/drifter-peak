"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/features/cart/lib/store/cartStore";
import type { AppliedCoupon } from "@/features/checkout/types/checkout";
import { computeOrderTotals } from "@/features/checkout/lib/pricing";
import { loadRazorpayScript } from "../../../features/checkout/lib/razorpayCheckout";
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
import { AddressManager, useAddressStore } from "@/features/address";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const cartLoading = useCartStore((s) => s.loading);
  const hydrated = useCartStore((s) => s.hydrated);

  const addresses = useAddressStore((s) => s.addresses);
  const selectedAddressId = useAddressStore((s) => s.selectedId);
  const addressesLoading = useAddressStore((s) => s.isLoading);
  const fetchAddresses = useAddressStore((s) => s.fetchAddresses);

  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [isAddressOpen, setIsAddressOpen] = useState(false);

  const { toasts, show, dismiss } = useToast();

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const selectedAddress =
    addresses.find((a) => a.id === selectedAddressId) ?? null;

  const totals = computeOrderTotals(items, coupon?.discountAmount ?? 0);

  function handleChangeOrAddAddress() {
    setIsAddressOpen(true);
  }

  // Stub — no coupons table exists yet. Swap this for a real Supabase/RPC
  // call later; CouponSection's props don't need to change.
  async function handleApplyCoupon(_code: string): Promise<string | null> {
    return "Coupons aren't available yet";
  }
  function handleRemoveCoupon() {
    setCoupon(null);
  }

  async function handleProceedToPayment() {
    if (!selectedAddress) {
      show("Please add a delivery address first", "error");
      return;
    }

    setPlacingOrder(true);

    try {
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address_id: selectedAddress.id }),
      });
      const data = await res.json();

      if (!res.ok) {
        show(data.error ?? "Couldn't start checkout", "error");
        setPlacingOrder(false);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        show("Couldn't load the payment gateway. Check your connection.", "error");
        setPlacingOrder(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        order_id: data.razorpay_order_id,
        name: "Drifter Peak",
        description: `Order ${data.order_id.slice(0, 8).toUpperCase()}`,
        prefill: {
          name: selectedAddress.name,
          contact: selectedAddress.phone,
        },
        theme: { color: "#000000" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyRes = await fetch("/api/checkout/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...response, order_id: data.order_id }),
            });
            if (!verifyRes.ok) throw new Error("verification failed");
            await useCartStore.getState().clearCart();
            router.push(`/payment/success?order_id=${data.order_id}`);
          } catch {
            router.push(`/payment/failure?order_id=${data.order_id}`);
          }
        },
        modal: {
          ondismiss: () => setPlacingOrder(false),
        },
      });

      rzp.on("payment.failed", () => {
        router.push(`/payment/failure?order_id=${data.order_id}`);
      });

      rzp.open();
    } catch {
      show("Something went wrong. Please try again.", "error");
      setPlacingOrder(false);
    }
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
          onEdit={handleChangeOrAddAddress}
          onChange={handleChangeOrAddAddress}
          onAddNew={handleChangeOrAddAddress}
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

      {isAddressOpen && (
        <AddressManager onClose={() => setIsAddressOpen(false)} />
      )}

      <p className="mt-6 text-center text-xs text-[color:var(--muted)] md:hidden">
        <Link href="/cart" className="underline">
          Back to cart
        </Link>
      </p>
    </div>
  );
}
