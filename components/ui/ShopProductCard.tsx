"use client";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

type Product = {
  id: string; name: string; price: number; original_price: number;
  tag: string; images: string[]; limited: boolean; category: string;
};

export function ShopProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`}>
      <div className="group cursor-pointer">
        <div className="relative overflow-hidden aspect-[3/4] mb-4 card-img-hover" style={{ background: "var(--card)" }}>
          {/* Main image */}
          <div className="card-img-main absolute inset-0">
            <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
          </div>
          {/* Alt image */}
          <div className="card-img-alt">
            <Image src={product.images[1] || product.images[0]} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
          </div>
          {/* Badges */}
          <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
            <span className="font-mono text-[10px] tracking-[0.2em] px-2.5 py-1" style={{ background: "var(--accent)", color: "var(--bg)" }}>{product.tag}</span>
            {product.limited && <span className="font-mono text-[10px] tracking-[0.2em] px-2.5 py-1" style={{ background: "rgba(255,45,45,0.9)", color: "#fff" }}>LIMITED</span>}
          </div>
          {/* Quick view */}
          <div className="card-quick-view absolute bottom-0 left-0 right-0 z-10">
            <div className="py-4 text-center font-display text-lg tracking-[0.15em] uppercase" style={{ background: "var(--fg)", color: "var(--bg)" }}>QUICK VIEW</div>
          </div>
        </div>
        {/* Info */}
        <div className="space-y-1">
          <p className="font-display text-xl uppercase tracking-wide leading-tight" style={{ color: "var(--fg)" }}>{product.name}</p>
          <div className="flex items-center gap-3">
            <span className="font-display text-lg" style={{ color: "var(--fg)" }}>{formatPrice(product.price)}</span>
            <span className="font-mono text-xs line-through" style={{ color: "var(--muted)" }}>{formatPrice(product.original_price)}</span>
            <span className="font-mono text-xs" style={{ color: "var(--red)" }}>-{Math.round((1 - product.price / product.original_price) * 100)}%</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
