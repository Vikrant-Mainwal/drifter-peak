"use client";
import { useReveal } from "@/lib/hooks";
import Image from "next/image";
import Link from "next/link";
import { products, formatPrice } from "@/lib/utils";

const featured = products.slice(0, 3);

export function FeaturedDrop() {
  const headerRef = useReveal();
  return (
    <section className="py-24 px-6 md:px-12 max-w-[1600px] mx-auto">
      <div ref={headerRef as React.RefObject<HTMLDivElement>} className="reveal flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <p className="font-mono text-xs tracking-[0.3em] mb-4" style={{ color: "var(--accent)" }}>— FEATURED DROP</p>
          <h2 className="font-display text-[clamp(48px,8vw,110px)] leading-none tracking-tight uppercase" style={{ color: "var(--fg)" }}>DROP 01</h2>
        </div>
        <div className="flex items-center gap-6">
          <p className="font-mono text-xs tracking-[0.2em] max-w-[220px]" style={{ color: "var(--muted)" }}>Limited units. Once it's gone, it's gone. No restocks.</p>
          <Link href="/shop" className="flex-shrink-0 font-mono text-xs tracking-[0.25em] border px-6 py-3 hover:opacity-70 transition-opacity" style={{ borderColor: "var(--border)", color: "var(--fg)" }}>VIEW ALL</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {featured.map((product, i) => (
          <FeaturedCard key={product.id} product={product} delay={i * 120} />
        ))}
      </div>
    </section>
  );
}

function FeaturedCard({ product, delay }: { product: (typeof products)[0]; delay: number }) {
  const ref = useReveal(delay);
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="reveal">
      <Link href={`/product/${product.id}`}>
        <div className="group relative overflow-hidden cursor-pointer" style={{ background: "var(--card)" }}>
          <div className="relative overflow-hidden aspect-square">
            <div className="img-zoom w-full h-full relative">
              <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
            <div className="card-overlay absolute inset-0" style={{ background: "rgba(0,0,0,0.4)" }} />
            <div className="absolute top-4 left-4 right-4 flex justify-between">
              <span className="font-mono text-[10px] tracking-[0.25em] px-3 py-1.5" style={{ background: "var(--accent)", color: "var(--bg)" }}>{product.tag}</span>
              {product.limited && <span className="font-mono text-[10px] tracking-[0.2em] px-3 py-1.5" style={{ background: "rgba(255,45,45,0.9)", color: "#fff" }}>LIMITED</span>}
            </div>
            <div className="card-quick-view absolute bottom-6 left-6 right-6">
              <div className="w-full py-3 text-center font-display text-lg tracking-[0.15em] uppercase" style={{ background: "var(--fg)", color: "var(--bg)" }}>SHOP NOW</div>
            </div>
          </div>
          <div className="p-5">
            <div className="flex justify-between items-start">
              <p className="font-display text-xl uppercase tracking-wide" style={{ color: "var(--fg)" }}>{product.name}</p>
              <div className="text-right">
                <p className="font-display text-xl" style={{ color: "var(--fg)" }}>{formatPrice(product.price)}</p>
                <p className="font-mono text-xs line-through" style={{ color: "var(--muted)" }}>{formatPrice(product.originalPrice)}</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
