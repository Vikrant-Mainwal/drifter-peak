"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types/product.types";

export default function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const supabase = createClient();

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState("");
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  // FETCH FROM SUPABASE
  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error || !data) {
        notFound();
      } else {
        setProduct(data);
      }

      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="p-10">Loading...</div>;
  if (!product) return null;

  const handleAdd = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }

    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      image: product.images?.[0],
      quantity: qty,
    });

    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <section className="min-h-screen pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Back */}
          <div className="mb-10">
            <Link
              href="/shop"
              className="font-mono text-xs tracking-[0.2em] flex items-center gap-2 hover:gap-4 transition-all"
            >
              <ArrowLeft size={12} /> BACK TO SHOP
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Images */}
            <div className="space-y-4">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={product.images?.[activeImg]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="grid grid-cols-4 gap-3">
                {product.images?.map((img: string, i: number) => (
                  <button key={i} onClick={() => setActiveImg(i)}>
                    <Image
                      src={img}
                      alt=""
                      width={100}
                      height={100}
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center">
              
              <h1 className="text-5xl font-bold mb-6">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl">
                  {formatPrice(product.price)}
                </span>

                {product.original_price && (
                  <>
                    <span className="line-through text-gray-400">
                      {formatPrice(product.original_price)}
                    </span>
                    <span className="text-red-500 text-sm">
                      {Math.round(
                        (1 - product.price / product.original_price) * 100
                      )}
                      % OFF
                    </span>
                  </>
                )}
              </div>

              <p className="mb-8 text-gray-500">
                {product.description}
              </p>

              {/* Size */}
              <div className="mb-6">
                <p className="text-sm mb-2">
                  {sizeError ? "SELECT SIZE FIRST" : "SELECT SIZE"}
                </p>

                <div className="flex gap-2">
                  {product.sizes?.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        setSizeError(false);
                      }}
                      className={`px-4 py-2 border ${
                        selectedSize === size
                          ? "bg-black text-white"
                          : ""
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <button onClick={() => setQty(Math.max(1, qty - 1))}>
                  <Minus />
                </button>
                <span>{qty}</span>
                <button onClick={() => setQty(qty + 1)}>
                  <Plus />
                </button>
              </div>

              {/* CTA */}
              <button
                onClick={handleAdd}
                className="bg-black text-white py-4"
              >
                {added ? "ADDED ✓" : "ADD TO CART"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}