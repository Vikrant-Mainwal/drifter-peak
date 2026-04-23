"use client";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2 } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const count = useCartStore((s) =>
    s.items.reduce((total, item) => total + item.quantity, 0),
  );
  const total = useCartStore((s) =>
    s.items.reduce((total, item) => total + item.price * item.quantity, 0),
  );
  const { items, isOpen, closeCart, removeItem, updateQuantity } =
    useCartStore();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className={`cart-backdrop fixed inset-0 z-50 ${isOpen ? "open" : ""}`}
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      />
      {/* Drawer */}
      <div
        className={`cart-drawer fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col ${isOpen ? "open" : ""}`}
        style={{
          background: "var(--bg)",
          borderLeft: "1px solid var(--border)",
        }}
      >
        {/* Header */}
        <div
          className="flex justify-between items-center px-8 py-6 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <h2
              className="font-display text-2xl uppercase tracking-wide"
              style={{ color: "var(--fg)" }}
            >
              Your Bag
            </h2>
            <p
              className="font-mono text-xs tracking-[0.2em]"
              style={{ color: "var(--muted)" }}
            >
              {count} {count === 1 ? "ITEM" : "ITEMS"}
            </p>
          </div>
          <button
            onClick={closeCart}
            className="opacity-50 hover:opacity-100 transition-opacity"
            style={{ color: "var(--fg)" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <p
                className="font-display text-3xl uppercase"
                style={{ color: "var(--muted)" }}
              >
                Empty
              </p>
              <p
                className="font-mono text-xs tracking-widest"
                style={{ color: "var(--muted)" }}
              >
                YOUR CART IS EMPTY
              </p>
              <button
                onClick={closeCart}
                className="font-mono text-xs tracking-[0.2em] border px-6 py-3 mt-4 hover:opacity-70 transition-opacity"
                style={{ borderColor: "var(--border)", color: "var(--fg)" }}
              >
                KEEP SHOPPING
              </button>
            </div>
          ) : (
            items.map((item, idx) => (
              <div
                key={`${item.id}-${item.size}`}
                className="cart-item flex gap-4 pb-6 border-b"
                style={{
                  borderColor: "var(--border)",
                  animationDelay: `${idx * 0.06}s`,
                }}
              >
                <div
                  className="relative w-20 h-24 flex-shrink-0 overflow-hidden"
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
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p
                      className="font-display text-lg uppercase"
                      style={{ color: "var(--fg)" }}
                    >
                      {item.name}
                    </p>
                    <button
                      onClick={() => removeItem(item.product_id, item.size)}
                      className="opacity-30 hover:opacity-80 transition-opacity"
                      style={{ color: "var(--fg)" }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <p
                    className="font-mono text-[10px] tracking-[0.2em] mb-3"
                    style={{ color: "var(--muted)" }}
                  >
                    SIZE: {item.size}
                  </p>
                  <div className="flex justify-between items-center">
                    <div
                      className="flex items-center border"
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
                        className="w-8 h-8 font-mono text-sm hover:opacity-50 transition-opacity flex items-center justify-center"
                        style={{ color: "var(--fg)" }}
                      >
                        −
                      </button>
                      <span
                        className="w-7 text-center font-mono text-xs"
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
                        className="w-8 h-8 font-mono text-sm hover:opacity-50 transition-opacity flex items-center justify-center"
                        style={{ color: "var(--fg)" }}
                      >
                        +
                      </button>
                    </div>
                    <span
                      className="font-display text-xl"
                      style={{ color: "var(--fg)" }}
                    >
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            className="px-8 py-5 border-t space-y-2"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex justify-between items-center">
              <span
                className="font-mono text-xs tracking-[0.2em]"
                style={{ color: "var(--muted)" }}
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
            {/* <div className="space-y-2"> */}
              <Link
                href="/cart"
                onClick={closeCart}
                className="btn-press block w-full py-3 text-center font-display text-xl tracking-[0.15em] uppercase"
                style={{ background: "var(--fg)", color: "var(--bg)" }}
              >
                VIEW CART
              </Link>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="btn-press block text-center w-full py-3 font-display text-xl tracking-[0.15em] uppercase"
                style={{ background: "var(--accent)", color: "var(--bg)" }}
              >
                CHECKOUT
              </Link>
            {/* </div> */}
          </div>
        )}
      </div>
    </>
  );
}
