"use client";

import { useState, useEffect } from "react";
import { ShopProductCard } from "@/components/ui/ShopProductCard";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/client";

type CardProduct = {
  id: string;
  slug?:string | null,
  name: string;
  price: number;
  original_price: number;
  tag: string;
  images: string[];
  limited: boolean;
  category: string;
};

export default function ShopPage() {
  const [active, setActive] = useState("ALL");
  const [products, setProducts] = useState<CardProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("products")
        .select(
          `
          id,slug, list_title, mrp, selling_price, subcategory, tags,
          product_media ( url, media_type, sort_order )
        `,
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("PRODUCT FETCH ERROR:", error);
        return;
      }

      // transform DB shape -> what ShopProductCard expects
      const mapped: CardProduct[] = (data ?? []).map((p: any) => {
        const images = (p.product_media ?? [])
          .filter((m: any) => m.media_type === "image")
          .sort((a: any, b: any) => a.sort_order - b.sort_order)
          .map((m: any) => m.url);

        return {
          id: p.id,
          slug: p.slug,
          name: p.list_title,
          price: p.selling_price,
          original_price: p.mrp,
          tag: p.tags?.[0]?.toUpperCase() ?? "",
          images: images.length ? images : ["/placeholder.png"], // avoid Image crash if no media yet
          limited: p.tags?.includes("limited") ?? false,
          category: p.subcategory ?? "",
        };
      });

      setProducts(mapped);
    };

    fetchProducts();
  }, []);

  const categories = [
    "ALL",
    ...Array.from(
      new Set(products.map((p) => p.category?.toUpperCase()).filter(Boolean)),
    ),
  ];

  const filtered =
    active === "ALL"
      ? products
      : products.filter((p) => p.category?.toUpperCase() === active);

  return (
    <>
      <section className="min-h-screen pt-28 pb-20 px-6 md:px-12">
        <div className="anim-fade-up mb-16">
          <p
            className="font-mono text-xs tracking-[0.3em] mb-4"
            style={{ color: "var(--accent)" }}
          >
            DROP 01 — LIVE NOW
          </p>
          <h1
            className="font-display text-[clamp(60px,15vw,180px)] leading-[0.85] tracking-tighter uppercase"
            style={{ color: "var(--fg)" }}
          >
            THE SHOP
          </h1>
        </div>

        <div className="anim-fade-up delay-300 flex flex-wrap gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className="btn-press font-mono text-xs tracking-[0.25em] px-5 py-2.5 border"
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <div key={product.id}>
              <ShopProductCard product={product} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-32 font-mono text-xs tracking-widest">
            COMING SOON —
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}
