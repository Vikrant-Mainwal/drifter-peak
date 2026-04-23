"use client";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useReveal } from "@/lib/hooks";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/types/product.types";

export function ProductGrid() {
  const headerRef = useReveal();

  const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
  
    // FETCH FROM SUPABASE
    useEffect(() => {
      const fetchProducts = async () => {
        const supabase = createClient();
  
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });
  
        if (error) {
          console.error("PRODUCT FETCH ERROR:", error);
        } else {
          setProducts(data || []);
        }
        setLoading(false);
      };
  
      fetchProducts();
    }, []);

  return (
    <section className="py-24 px-6 md:px-12 max-w-[1600px] mx-auto">
      <div ref={headerRef as React.RefObject<HTMLDivElement>} className="reveal flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <p className="font-mono text-xs tracking-[0.3em] mb-4" style={{ color: "var(--accent)" }}>— FULL COLLECTION</p>
          <h2 className="font-display text-[clamp(48px,8vw,110px)] leading-none tracking-tight uppercase" style={{ color: "var(--fg)" }}>ALL PIECES</h2>
        </div>
        <Link href="/shop" className="btn-press font-mono text-xs tracking-[0.25em] border px-8 py-4 hover:opacity-70 transition-all duration-200 w-fit" style={{ borderColor: "var(--fg)", color: "var(--fg)" }}>
          EXPLORE SHOP →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.map((product, i) => (
          <GridCard key={product.id} product={product} large={i === 0 || i === 3} delay={i * 70} />
        ))}
      </div>
    </section>
  );
}

function GridCard({ product, large, delay }: { product: Product; large: boolean; delay: number }) {
  const ref = useReveal(delay);
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={`reveal ${large ? "col-span-2" : ""}`}>
      <Link href={`/product/${product.id}`}>
        <div className="group relative overflow-hidden" style={{ background: "var(--card)" }}>
          <div className={`relative overflow-hidden ${large ? "aspect-[2/1.3]" : "aspect-[3/4]"}`}>
            <div className="img-zoom w-full h-full relative">
              <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 20vw" />
            </div>
            <div className="card-overlay absolute inset-0 flex items-end p-4" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }}>
              <span className="font-mono text-[10px] tracking-[0.2em] px-2 py-1" style={{ background: "var(--accent)", color: "var(--bg)" }}>{product.tag}</span>
            </div>
          </div>
          <div className="p-3 md:p-4">
            <p className="font-display text-base md:text-lg uppercase leading-tight mb-1" style={{ color: "var(--fg)" }}>{product.name}</p>
            <div className="flex items-center gap-2">
              <p className="font-display text-base" style={{ color: "var(--fg)" }}>{formatPrice(product.price)}</p>
              <p className="font-mono text-xs line-through" style={{ color: "var(--muted)" }}>{formatPrice(product.original_price)}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
