"use client";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useCartStore } from "../../../features/cart/lib/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/hooks/useAuth";

export default function CartPage() {
  const { items, removeItem, updateQuantity, loading } = useCartStore();
  // Cart loading itself is centrally handled by CartSyncProvider (in
  // app/(public)/layout.tsx) whenever the logged-in user changes — this
  // page only needs auth state to know when to show its own loading state.
  const { loading: authLoading } = useAuth();

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal >= 2000 ? 0 : 199;
  const total = subtotal + shipping;

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
                    key={item.variant_id}
                    className="cart-item grid grid-cols-[80px_1fr_auto] gap-5 py-6 border-b items-start"
                    style={{
                      borderColor: "var(--border)",
                      animationDelay: `${idx * 60}ms`,
                    }}
                  >
                    <Link
                      href={`/product/${item.slug || item.product_id}`}
                      className="relative aspect-square overflow-hidden block"
                      style={{ background: "var(--card)" }}
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </Link>

                    <div>
                      <Link href={`/product/${item.slug || item.product_id}`}>
                        <p
                          className="font-display text-xl uppercase tracking-wide mb-1"
                          style={{ color: "var(--fg)" }}
                        >
                          {item.name}
                        </p>
                      </Link>
                      <p
                        className="font-mono text-xs tracking-[0.2em] mb-4"
                        style={{ color: "var(--muted)" }}
                      >
                        SIZE: {item.size}
                        {item.color ? ` · ${item.color.toUpperCase()}` : ""}
                      </p>

                      <div
                        className="flex items-center border w-fit"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <button
                          onClick={() =>
                            updateQuantity(item.variant_id, item.quantity - 1)
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
                            updateQuantity(item.variant_id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.stock}
                          className="w-9 h-9 disabled:opacity-30"
                          style={{ color: "var(--fg)" }}
                        >
                          +
                        </button>
                      </div>

                      {item.quantity >= item.stock && (
                        <p
                          className="font-mono text-[10px] tracking-wider mt-2"
                          style={{ color: "var(--accent)" }}
                        >
                          MAX STOCK REACHED
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <span
                        className="font-display text-xl"
                        style={{ color: "var(--fg)" }}
                      >
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.variant_id)}
                        style={{ color: "var(--fg)" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

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
                    <span style={{ color: "var(--fg)" }}>
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between font-mono text-xs tracking-wider">
                    <span style={{ color: "var(--muted)" }}>SHIPPING</span>
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
                    <span
                      className="font-display text-3xl"
                      style={{ color: "var(--fg)" }}
                    >
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="btn-press block w-full py-2 text-center font-display text-xl tracking-[0.15em] uppercase"
                  style={{ background: "var(--muted)", color: "var(--bg)" }}
                >
                  CHECKOUT NOW
                </Link>

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