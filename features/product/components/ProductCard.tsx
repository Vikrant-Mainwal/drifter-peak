"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useState } from "react";
import { Product } from "../types";

export function ProductCard({
  product,
  large,
  delay,
}: {
  product: Product;
  large?: boolean;
  delay?: number;
}) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [hovered, setHovered] = useState(false);

  const images = product.product_media
    ?.filter((m) => m.media_type === "image")
    ?.sort((a, b) => a.sort_order - b.sort_order);

  const primaryImage = images?.[0];
  // const hoverImage = images?.[1];

  const discount =
    product.mrp > product.selling_price
      ? Math.round(((product.mrp - product.selling_price) / product.mrp) * 100)
      : null;

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted((prev) => !prev);
  };

  const ProductId = product.id || product.slug;

  return (
    <Link href={`/product/${ProductId}`} className="block w-full">
      <article
        className="bg-white"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image container — explicit height so fill works */}
        <div
          className="relative w-full overflow-hidden bg-[#f5f5f5]"
          style={{ paddingBottom: "133.33%" /* 3:4 ratio */ }}
        >
          <div className="absolute inset-0">
            {/* Primary image */}
            {primaryImage && (
              <img
                src={primaryImage.url}
                alt={product.list_title}
                className="w-full h-full object-cover transition-opacity duration-300"
                // style={{ opacity: hovered && hoverImage ? 0 : 1 }}
              />
            )}

            {/* SAVE badge */}
            {discount && (
              <span className="absolute left-2.5 top-2.5 z-10 bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white tracking-wide">
                SAVE {discount}%
              </span>
            )}

            {/* Wishlist button */}
            <button
              onClick={handleWishlist}
              className="absolute top-2.5 right-0 z-10 p-1"
              aria-label="Add to wishlist"
            >
              <Heart
                className="h-5 w-5 transition-colors"
                style={{
                  fill: isWishlisted ? "#dc2626" : "white",
                  stroke: isWishlisted ? "#dc2626" : "#1f2937",
                }}
              />
            </button>

            {/* ADD TO CART — slides up on hover */}
            <div
              className="absolute bottom-0 left-0 right-0 z-10 transition-transform duration-200"
              style={{ transform: hovered ? "translateY(0)" : "translateY(100%)" }}
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // TODO: add to cart
                }}
                className="w-full bg-black py-3 text-[11px] font-bold uppercase tracking-widest text-white"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Product info */}
        <div className="pt-2.5 pb-1">
          <h3 className="line-clamp-2 text-[12px] font-medium uppercase leading-[1.4] text-gray-900 tracking-wide">
            {product.list_title}
          </h3>
          <div className="mt-1 flex items-center gap-2">
            {product.mrp > product.selling_price && (
              <span className="text-[12px] text-gray-400 line-through">
                Rs.{product.mrp.toLocaleString("en-IN")}
              </span>
            )}
            <span className="text-[12px] font-semibold text-red-600">
              Rs.{product.selling_price.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}