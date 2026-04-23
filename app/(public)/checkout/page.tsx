"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, MapPin } from "lucide-react";
import { AddressCard } from "@/components/checkout/AddressCard";
import { CartSummary } from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageSpinner } from "@/components/ui/Spinner";
import { ToastContainer } from "@/components/ui/Toast";
import { getAddresses } from "@/lib/supabase/queries/addresses";
import { useCheckoutStore } from "@/lib/store/checkout";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import type { Address } from "@/types/index";
import { useCartStore } from "@/lib/store/cartStore";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items } = useCartStore();

  const { selectedAddressId, setSelectedAddressId } = useCheckoutStore();
  const { toasts, show, dismiss } = useToast();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddr, setLoadingAddr] = useState(true);
  const [processing, setProcessing] = useState(false);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal >= 2000 ? 0 : 199;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  useEffect(() => {
    getAddresses()
      .then((data) => {
        setAddresses(data);
        // Auto-select default or first
        if (!selectedAddressId && data.length > 0) {
          const def = data.find((a) => a.is_default) ?? data[0];
          setSelectedAddressId(def.id);
        }
      })
      .finally(() => setLoadingAddr(false));
  }, [selectedAddressId, setSelectedAddressId]);

  if (loadingAddr) return <PageSpinner />;
  if (items.length === 0) {
    router.replace("/cart");
    return null;
  }

  const handleProceed = async () => {
    if (!selectedAddressId) {
      show("Please select a delivery address", "error");
      return;
    }
    setProcessing(true);
    try {
      // 1. Create DB order
      const orderRes = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart_items: items,
          address_id: selectedAddressId,
          subtotal,
          shipping,
          tax,
          total,
        }),
      });
      const { order_id, error: orderErr } = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderErr);

      // 2. Create Razorpay order
      const rpRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id }),
      });
      const rpData = await rpRes.json();
      if (!rpRes.ok) throw new Error(rpData.error);

      // 3. Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: rpData.amount,
        currency: rpData.currency,
        name: "Drifter Peak",
        description: `Order #${order_id.slice(0, 8).toUpperCase()}`,
        order_id: rpData.razorpay_order_id,
        prefill: { email: user?.email },
        theme: { color: "#0a0a0a" },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          // 4. Verify payment
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, order_id }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            router.push(`/payment/success?order_id=${order_id}`);
          } else {
            router.push(`/payment/failure?order_id=${order_id}`);
          }
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
            show("Payment cancelled", "info");
          },
        },
      };

      const rp = new window.Razorpay(options);
      rp.open();
    } catch (err) {
      show(
        err instanceof Error ? err.message : "Something went wrong",
        "error",
      );
      setProcessing(false);
    }
  };

  return (
    <>
      {/* Razorpay SDK */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address */}
            <Card>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-neutral-700" />
                  <h2 className="text-base font-semibold text-neutral-900">
                    Delivery Address
                  </h2>
                </div>
                <Link href="/add-address">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Plus size={13} /> Add New
                  </Button>
                </Link>
              </div>

              {addresses.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-neutral-500 mb-4">
                    No saved addresses
                  </p>
                  <Link href="/add-address">
                    <Button variant="outline" size="sm">
                      Add Address
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <AddressCard
                      key={addr.id}
                      address={addr}
                      selected={selectedAddressId === addr.id}
                      onSelect={() => setSelectedAddressId(addr.id)}
                    />
                  ))}
                </div>
              )}
            </Card>

            {/* Items preview */}
            <Card>
              <h2 className="text-base font-semibold text-neutral-900 mb-4">
                Items ({items.length})
              </h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-neutral-700 truncate flex-1 pr-4">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-neutral-900 font-medium flex-shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right — summary + pay */}
          <div>
            <Card className="sticky top-6">
              <h2 className="text-base font-semibold text-neutral-900 mb-4">
                Order Summary
              </h2>
              <CartSummary
                subtotal={subtotal}
                shipping={shipping}
                tax={tax}
                total={total}
              />
              <Button
                onClick={handleProceed}
                loading={processing}
                size="lg"
                className="w-full mt-6"
                disabled={!selectedAddressId}
              >
                Proceed to Payment
              </Button>
              <p className="text-center text-xs text-neutral-400 mt-3">
                Secured by Razorpay
              </p>
            </Card>
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </>
  );
}
