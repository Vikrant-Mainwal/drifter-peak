"use client";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useCart } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { Footer } from "@/components/layout/Footer";
import { useEffect } from "react";

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCart();

  const total = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Load cart from Zustand store (which calls Supabase)
  useEffect(() => {
    useCart.getState().loadCart();
  }, []);

  return (
    <>
      <section className="min-h-screen pt-28 pb-20 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="anim-fade-up mb-16">
            <p className="font-mono text-xs tracking-[0.3em] mb-4" style={{ color: "var(--accent)" }}>
              YOUR SELECTIONS
            </p>
            <h1 className="font-display text-[clamp(60px,12vw,140px)] leading-none tracking-tight uppercase" style={{ color: "var(--fg)" }}>
              CART
            </h1>
          </div>

          {items.length === 0 ? (
            <div className="anim-fade-up delay-200 text-center py-32">
              <p className="font-display text-5xl mb-6 uppercase" style={{ color: "var(--muted)" }}>
                Nothing here yet.
              </p>
              <p className="font-mono text-xs tracking-widest mb-10" style={{ color: "var(--muted)" }}>
                YOUR CART IS EMPTY — START DRIFTING
              </p>
              <Link href="/shop" className="btn-press inline-block font-display text-xl tracking-widest uppercase px-10 py-4" style={{ background: "var(--fg)", color: "var(--bg)" }}>
                Explore Drop
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-16">

              {/* Items */}
              <div>
                <div className="grid grid-cols-[1fr_auto] pb-4 border-b mb-2" style={{ borderColor: "var(--border)" }}>
                  <span className="font-mono text-[10px] tracking-[0.3em]" style={{ color: "var(--muted)" }}>PRODUCT</span>
                  <span className="font-mono text-[10px] tracking-[0.3em]" style={{ color: "var(--muted)" }}>TOTAL</span>
                </div>

                {items.map((item, idx) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="cart-item grid grid-cols-[80px_1fr_auto] gap-5 py-6 border-b items-start"
                    style={{ borderColor: "var(--border)", animationDelay: `${idx * 60}ms` }}
                  >
                    <div className="relative aspect-square overflow-hidden" style={{ background: "var(--card)" }}>
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                    </div>

                    <div>
                      <p className="font-display text-xl uppercase tracking-wide mb-1" style={{ color: "var(--fg)" }}>
                        {item.name}
                      </p>

                      <p className="font-mono text-xs tracking-[0.2em] mb-4" style={{ color: "var(--muted)" }}>
                        SIZE: {item.size}
                      </p>

                      <div className="flex items-center border w-fit" style={{ borderColor: "var(--border)" }}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                          className="w-9 h-9"
                        >
                          −
                        </button>

                        <span className="w-8 text-center">{item.quantity}</span>

                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                          className="w-9 h-9"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <span className="font-display text-xl">
                        {formatPrice(item.price * item.quantity)}
                      </span>

                      <button onClick={() => removeItem(item.id, item.size)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="h-fit border p-8 sticky top-28">
                <h2 className="font-display text-3xl uppercase mb-8">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>SUBTOTAL</span>
                    <span>{formatPrice(total)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>SHIPPING</span>
                    <span>{total >= 2000 ? "FREE" : formatPrice(199)}</span>
                  </div>
                </div>

                <div className="border-t pt-5 mb-8">
                  <div className="flex justify-between">
                    <span>TOTAL</span>
                    <span>
                      {formatPrice(total >= 2000 ? total : total + 199)}
                    </span>
                  </div>
                </div>

                <Link href="/checkout" className="btn-press w-full py-4">
                  CHECKOUT NOW
                </Link>
              </div>

            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}