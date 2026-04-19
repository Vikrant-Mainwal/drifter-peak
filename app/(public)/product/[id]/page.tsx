"use client";
import { useState, use } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { products, formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/store/cart";
import { Footer } from "@/components/layout/Footer";

export default function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.openCart);
  const product = products.find((p) => p.id === id);
  if (!product) notFound();

  const [selectedSize, setSelectedSize] = useState("");
  const [activeImg, setActiveImg]       = useState(0);
  const [qty, setQty]                   = useState(1);
  const [added, setAdded]               = useState(false);
  const [sizeError, setSizeError]       = useState(false);

  const handleAdd = () => {
    console.log("ADDING ITEM");
    if (!selectedSize) { setSizeError(true); setTimeout(() => setSizeError(false), 2000); return; }
    addItem({ id: product.id, name: product.name, price: product.price, size: selectedSize, image: product.images[0], quantity: qty });
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <section className="min-h-screen pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Back */}
          <div className="anim-fade-in mb-10">
            <Link href="/shop" className="font-mono text-xs tracking-[0.2em] flex items-center gap-2 hover:gap-4 transition-all duration-300" style={{ color: "var(--muted)" }}>
              <ArrowLeft size={12} /> BACK TO SHOP
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Images */}
            <div className="anim-fade-up space-y-4">
              <div className="relative aspect-[4/5] overflow-hidden" style={{ background: "var(--card)" }}>
                {product.limited && (
                  <div className="absolute top-4 left-4 z-10 font-mono text-[10px] tracking-[0.3em] px-3 py-1.5" style={{ background: "var(--accent)", color: "var(--bg)" }}>LIMITED DROP</div>
                )}
                <Image src={product.images[activeImg]} alt={product.name} fill className="object-cover transition-all duration-500" sizes="(max-width: 1024px) 100vw, 50vw" priority />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} className="relative aspect-square overflow-hidden transition-all duration-200" style={{ background: "var(--card)", outline: activeImg === i ? "2px solid var(--accent)" : "2px solid transparent", outlineOffset: "2px" }}>
                    <Image src={img} alt="" fill className="object-cover" sizes="100px" />
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="anim-fade-up delay-200 flex flex-col justify-center">
              <p className="font-mono text-xs tracking-[0.3em] mb-4" style={{ color: "var(--accent)" }}>{product.tag}</p>
              <h1 className="font-display text-[clamp(40px,6vw,80px)] leading-none tracking-tight uppercase mb-6" style={{ color: "var(--fg)" }}>{product.name}</h1>

              <div className="flex items-baseline gap-4 mb-8">
                <span className="font-display text-4xl" style={{ color: "var(--fg)" }}>{formatPrice(product.price)}</span>
                <span className="font-body text-lg line-through" style={{ color: "var(--muted)" }}>{formatPrice(product.originalPrice)}</span>
                <span className="font-mono text-xs tracking-widest" style={{ color: "var(--red)" }}>{Math.round((1 - product.price / product.originalPrice) * 100)}% OFF</span>
              </div>

              <p className="font-body text-lg leading-relaxed mb-10 max-w-md" style={{ color: "var(--muted)" }}>{product.description}</p>

              {/* Size selector */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-mono text-xs tracking-[0.2em]" style={{ color: sizeError ? "var(--red)" : "var(--fg)" }}>
                    {sizeError ? "SELECT A SIZE FIRST" : "SELECT SIZE"}
                  </span>
                  <button className="font-mono text-xs tracking-[0.2em] underline" style={{ color: "var(--muted)" }}>SIZE GUIDE</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button key={size} onClick={() => { setSelectedSize(size); setSizeError(false); }}
                      className="btn-press w-14 h-14 font-mono text-sm tracking-wider border transition-all duration-150"
                      style={{ borderColor: selectedSize === size ? "var(--fg)" : "var(--border)", background: selectedSize === size ? "var(--fg)" : "transparent", color: selectedSize === size ? "var(--bg)" : "var(--muted)" }}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-6 mb-8">
                <span className="font-mono text-xs tracking-[0.2em]" style={{ color: "var(--fg)" }}>QTY</span>
                <div className="flex items-center border" style={{ borderColor: "var(--border)" }}>
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-12 h-12 flex items-center justify-center hover:opacity-60 transition-opacity" style={{ color: "var(--fg)" }}><Minus size={14} /></button>
                  <span className="w-10 text-center font-mono text-sm" style={{ color: "var(--fg)" }}>{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="w-12 h-12 flex items-center justify-center hover:opacity-60 transition-opacity" style={{ color: "var(--fg)" }}><Plus size={14} /></button>
                </div>
              </div>

              {/* CTA */}
              <button onClick={handleAdd} className="btn-press w-full py-5 font-display text-2xl tracking-[0.15em] uppercase transition-all duration-300"
                style={{ background: added ? "var(--accent)" : "var(--fg)", color: "var(--bg)" }}>
                {added ? "ADDED TO CART ✓" : "ADD TO CART"}
              </button>

              {/* Trust signals */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t" style={{ borderColor: "var(--border)" }}>
                {["FREE DELIVERY OVER ₹2K","30-DAY RETURNS","SECURE CHECKOUT"].map(txt => (
                  <p key={txt} className="font-mono text-[10px] tracking-[0.15em] text-center" style={{ color: "var(--muted)" }}>{txt}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
