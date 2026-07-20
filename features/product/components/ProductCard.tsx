"use client";

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

  const images = product.product_media
    ?.filter((m) => m.media_type === "image")
    ?.sort((a, b) => a.sort_order - b.sort_order);

  const primaryImage = images?.[0];

  const discount =
    product.mrp > product.selling_price
      ? Math.round(((product.mrp - product.selling_price) / product.mrp) * 100)
      : null;

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted((prev) => !prev);
  };

  const productId = product.id || product.slug;

  return (
    <Link href={`/product/${productId}`} className="block w-full">
      <article className="bg-white">
        <div
          className="relative w-full overflow-hidden bg-[#f5f5f5] rounded-sm"
          style={{ paddingBottom: "125%" }}
        >
          <div className="absolute inset-0">
            {primaryImage && (
              <img
                src={primaryImage.url}
                alt={product.list_title}
                className="w-full h-full object-cover"
              />
            )}

            <button
              onClick={handleWishlist}
              className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center"
              aria-label="Add to wishlist"
            >
              <Heart
                className="h-4 w-4 transition-colors"
                style={{
                  fill: isWishlisted ? "#dc2626" : "transparent",
                  stroke: isWishlisted ? "#dc2626" : "#1f2937",
                }}
              />
            </button>
          </div>
        </div>

        <div className="pt-3 pb-1">
          <h3 className="line-clamp-2 text-sm font-medium text-neutral-900 leading-snug">
            {product.list_title}
          </h3>

          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-sm font-semibold text-neutral-900">
              ₹{product.selling_price.toLocaleString("en-IN")}
            </span>
            {discount && (
              <>
                <span className="text-xs text-neutral-400 line-through">
                  ₹{product.mrp.toLocaleString("en-IN")}
                </span>
                <span className="text-xs font-medium text-red-600">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>

          {/* Rating / review count — wire in once the reviews table exists
          <div className="mt-1 flex items-center gap-1 text-xs text-neutral-500">
            <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
            <span>{product.rating} ({product.review_count})</span>
          </div>
          */}
        </div>
      </article>
    </Link>
  );
}