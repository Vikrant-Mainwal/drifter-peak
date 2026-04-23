"use client";

import { useState, useEffect } from "react";
import { ShopProductCard } from "@/components/ui/ShopProductCard";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/types/product.types";

const categories = ["ALL", "TEES", "HOODIES", "BOTTOMS", "JACKETS"];

export default function ShopPage() {
  const [active, setActive] = useState("ALL");
  const [products, setProducts] = useState<Product[]>([]);

  // FETCH FROM DB
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
        setProducts(data);
      }
    };

    fetchProducts();
  }, []);

  //  FILTER LOGIC (same as before)
  const filtered =
    active === "ALL"
      ? products
      : products.filter(
          (p) => p.category?.toUpperCase() === active
        );

  return (
    <>
      <section className="min-h-screen pt-28 pb-20 px-6 md:px-12">
        {/* Header */}
        <div className="anim-fade-up mb-16">
          <p className="font-mono text-xs tracking-[0.3em] mb-4" style={{ color: "var(--accent)" }}>
            DROP 01 — LIVE NOW
          </p>
          <h1 className="font-display text-[clamp(60px,15vw,180px)] leading-[0.85] tracking-tighter uppercase" style={{ color: "var(--fg)" }}>
            THE SHOP
          </h1>
        </div>

        {/* Filters */}
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

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product, i) => (
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