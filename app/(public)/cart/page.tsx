// app/cart/page.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { Footer } from "@/components/layout/Footer";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, removeItem, updateQuantity, loading } = useCartStore(); //  ADD: loading
  const { user, loading: authLoading } = useAuth();
  
  useEffect(() => {
    if (!authLoading && user) {
      useCartStore.getState().loadCart();
    }
  }, [user, authLoading]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  //  CHANGE: Move shipping calc here (was inline in JSX)
  const shipping = subtotal >= 2000 ? 0 : 199;
  const total = subtotal + shipping;

  useEffect(() => {
    useCartStore.getState().loadCart();
  }, []);

  //Loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "var(--fg)", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  // Everything below is IDENTICAL to your existing code
  return (
    <>
      <section className="min-h-screen pt-28 pb-20 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="anim-fade-up mb-16">
            <p
              className="font-mono text-xs tracking-[0.3em] mb-4"
              style={{ color: "var(--accent)" }}
            >
              YOUR SELECTIONS
            </p>
            <h1
              className="font-display text-[clamp(60px,12vw,140px)] leading-none tracking-tight uppercase"
              style={{ color: "var(--fg)" }}
            >
              CART
            </h1>
          </div>

          {items.length === 0 ? (
            <div className="anim-fade-up delay-200 text-center py-32">
              <p
                className="font-display text-5xl mb-6 uppercase"
                style={{ color: "var(--muted)" }}
              >
                Nothing here yet.
              </p>
              <p
                className="font-mono text-xs tracking-widest mb-10"
                style={{ color: "var(--muted)" }}
              >
                YOUR CART IS EMPTY — START DRIFTING
              </p>
              <Link
                href="/shop"
                className="btn-press inline-block font-display text-xl tracking-widest uppercase px-10 py-4"
                style={{ background: "var(--fg)", color: "var(--bg)" }}
              >
                Explore Drop
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-16">
              {/* Items — IDENTICAL to your code */}
              <div>
                <div
                  className="grid grid-cols-[1fr_auto] pb-4 border-b mb-2"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span
                    className="font-mono text-[10px] tracking-[0.3em]"
                    style={{ color: "var(--muted)" }}
                  >
                    PRODUCT
                  </span>
                  <span
                    className="font-mono text-[10px] tracking-[0.3em]"
                    style={{ color: "var(--muted)" }}
                  >
                    TOTAL
                  </span>
                </div>

                {items.map((item, idx) => (
                  <div
                    key={`${item.product_id}-${item.size}`}
                    className="cart-item grid grid-cols-[80px_1fr_auto] gap-5 py-6 border-b items-start"
                    style={{
                      borderColor: "var(--border)",
                      animationDelay: `${idx * 60}ms`,
                    }}
                  >
                    <div
                      className="relative aspect-square overflow-hidden"
                      style={{ background: "var(--card)" }}
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    <div>
                      <p
                        className="font-display text-xl uppercase tracking-wide mb-1"
                        style={{ color: "var(--fg)" }}
                      >
                        {item.name}
                      </p>
                      <p
                        className="font-mono text-xs tracking-[0.2em] mb-4"
                        style={{ color: "var(--muted)" }}
                      >
                        SIZE: {item.size}
                      </p>
                      <div
                        className="flex items-center border w-fit"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product_id,
                              item.quantity - 1,
                              item.size,
                            )
                          }
                          className="w-9 h-9"
                          style={{ color: "var(--fg)" }}
                        >
                          −
                        </button>
                        <span
                          className="w-8 text-center"
                          style={{ color: "var(--fg)" }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product_id,
                              item.quantity + 1,
                              item.size,
                            )
                          }
                          className="w-9 h-9"
                          style={{ color: "var(--fg)" }}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <span
                        className="font-display text-xl"
                        style={{ color: "var(--fg)" }}
                      >
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.product_id, item.size)}
                        style={{ color: "var(--fg)" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary — only change: use split subtotal/shipping/total */}
              <div
                className="h-fit border p-8 sticky top-28"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--card)",
                }}
              >
                <h2
                  className="font-display text-3xl uppercase mb-8"
                  style={{ color: "var(--fg)" }}
                >
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between font-mono text-xs tracking-wider">
                    <span style={{ color: "var(--muted)" }}>SUBTOTAL</span>
                    {/*  CHANGE: use subtotal instead of total */}
                    <span style={{ color: "var(--fg)" }}>
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between font-mono text-xs tracking-wider">
                    <span style={{ color: "var(--muted)" }}>SHIPPING</span>
                    {/*  CHANGE: use pre-computed shipping */}
                    <span
                      style={{
                        color: shipping === 0 ? "var(--accent)" : "var(--fg)",
                      }}
                    >
                      {shipping === 0 ? "FREE" : formatPrice(shipping)}
                    </span>
                  </div>
                </div>

                <div
                  className="border-t pt-5 mb-8"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="flex justify-between items-baseline">
                    <span
                      className="font-mono text-xs tracking-wider"
                      style={{ color: "var(--fg)" }}
                    >
                      TOTAL
                    </span>
                    {/*  CHANGE: use pre-computed total */}
                    <span
                      className="font-display text-3xl"
                      style={{ color: "var(--fg)" }}
                    >
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/*  CHANGE: was Link, now button navigating to /checkout */}
                <Link
                  href="/checkout"
                  className="btn-press block w-full py-4 text-center font-display text-xl tracking-[0.15em] uppercase"
                  style={{ background: "var(--accent)", color: "var(--bg)" }}
                >
                  CHECKOUT NOW
                </Link>

                {/*  Free shipping nudge */}
                {subtotal < 2000 && subtotal > 0 && (
                  <p
                    className="text-center font-mono text-[10px] tracking-wider mt-4"
                    style={{ color: "var(--muted)" }}
                  >
                    ADD {formatPrice(2000 - subtotal)} MORE FOR FREE SHIPPING
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
