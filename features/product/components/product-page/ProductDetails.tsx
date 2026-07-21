"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Zap, Heart, Minus, Plus, ShieldCheck } from "lucide-react";
import type { Product, ProductVariant } from "@/features/product/types";
import { useCartStore } from "@/features/cart/lib/store/cartStore";

interface Props {
  product: Product;
  variants: ProductVariant[];
  image: string;
}

// Small name -> hex lookup so color options render as real swatches.
// Extend this list as new colors show up in the catalog.
const COLOR_HEX: Record<string, string> = {
  black: "#111111",
  white: "#ffffff",
  grey: "#9ca3af",
  gray: "#9ca3af",
  navy: "#1e2a44",
  green: "#3f6b4f",
  olive: "#5c5a3f",
  beige: "#d8c9ae",
  cream: "#f0e9dc",
  brown: "#6b4a35",
  red: "#b91c1c",
  blue: "#2563eb",
  maroon: "#6b1d2b",
};

function colorToHex(name: string) {
  return COLOR_HEX[name.trim().toLowerCase()] ?? "#d4d4d4";
}

export default function ProductDetails({ product, variants, image }: Props) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const allColors = useMemo(
    () =>
      Array.from(
        new Set(
          variants
            .map((v) => v.color)
            .filter((color): color is string => color != null),
        ),
      ),
    [variants],
  );

  const allSizes = useMemo(
    () =>
      Array.from(
        new Set(
          variants
            .map((v) => v.size)
            .filter((size): size is string => size != null),
        ),
      ),
    [variants],
  );

  const hasColors = allColors.length > 0;
  const hasSizes = allSizes.length > 0;

  const [selectedColor, setSelectedColor] = useState(allColors[0] ?? "");
  const [selectedSize, setSelectedSize] = useState("");
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);

  const selectedVariant = useMemo(() => {
    if (!selectedSize) return null;
    return (
      variants.find(
        (v) => v.color === selectedColor && v.size === selectedSize,
      ) ?? null
    );
  }, [variants, selectedColor, selectedSize]);

  const variantPrices = variants
    .map((v) => v.price)
    .filter((price): price is number => price != null);

  const displayPrice =
    selectedVariant?.price ??
    (variantPrices.length ? Math.min(...variantPrices) : product.selling_price);

  const discountPct =
    product.mrp > displayPrice
      ? Math.round(((product.mrp - displayPrice) / product.mrp) * 100)
      : 0;

  const isBestSeller = product.tags?.some(
    (t) => t.toLowerCase().replace(/\s/g, "") === "bestseller",
  );

  function isAvailable(size: string) {
    const v = variants.find(
      (v) => v.color === selectedColor && v.size === size,
    );
    return !!v && v.stock > 0;
  }

  function buildCartItem() {
    if (!selectedVariant) return null;
    return {
      variant_id: selectedVariant.id,
      product_id: product.id,
      slug: product.slug,
      name: product.list_title,
      mrp: product.mrp,
      price: selectedVariant.price ?? displayPrice,
      size: selectedVariant.size ?? "",
      color: selectedVariant.color ?? null,
      image,
      stock: selectedVariant.stock,
      quantity,
    };
  }

  function handleAddToCart() {
    const item = buildCartItem();
    if (!item) return;
    addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleBuyNow() {
    const item = buildCartItem();
    if (!item) return;
    addItem(item);
    router.push("/checkout");
  }

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="hidden md:flex items-center gap-1.5 text-xs text-neutral-400 mb-4">
        <Link href="/" className="hover:text-neutral-600">
          Home
        </Link>
        {product.gender && (
          <>
            <span>/</span>
            <span className="capitalize">{product.gender}</span>
          </>
        )}
        {product.category && (
          <>
            <span>/</span>
            <span className="capitalize">{product.category}</span>
          </>
        )}
        <span>/</span>
        <span className="text-neutral-600">{product.list_title}</span>
      </nav>

      {/* Best Seller badge */}
      {isBestSeller && (
        <span className="inline-block mb-2 rounded px-2.5 py-1 text-[11px] font-medium bg-orange-50 text-orange-600">
          Best Seller
        </span>
      )}

      {/* Brand */}
      {product.brand && (
        <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-400 mb-1.5">
          {product.brand}
        </p>
      )}

      {/* Title */}
      <h2 className="text-2xl md:text-[28px] font-semibold leading-snug text-neutral-900">
        {product.detail_title ?? product.list_title}
      </h2>

      {/* Slogan */}
      {product.slogan && (
        <p className="text-sm text-neutral-500 mt-1">{product.slogan}</p>
      )}

      {/* Rating / review count / sold — wire in once the reviews table exists
      <div className="flex items-center gap-2 mt-2 text-sm text-neutral-600">
        <span className="flex items-center gap-1 text-amber-500">
          <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
          {product.rating}
        </span>
        <span className="text-neutral-400">({product.review_count} reviews)</span>
        <span className="text-neutral-300">|</span>
        <span className="text-neutral-400">Sold {product.sold_count}+</span>
      </div>
      */}

      {/* Price */}
      <div className="flex items-baseline gap-2.5 mt-4">
        <span className="text-2xl font-semibold text-neutral-900">
          ₹{displayPrice.toLocaleString("en-IN")}
        </span>
        {displayPrice < product.mrp && (
          <div className="flex items-baseline gap-2.5">
            <span className="text-sm text-neutral-400 line-through">
              ₹{product.mrp.toLocaleString("en-IN")}
            </span>
            <span className="text-sm text-orange-600 font-medium">
              {discountPct}% OFF
            </span>
          </div>
        )}
      </div>
      <p className="text-xs text-neutral-400 mt-1">Inclusive of all taxes</p>

      {/* Color — circular swatches */}
      {hasColors && (
        <div className="mt-6">
          <p className="text-[11px] uppercase tracking-[0.1em] text-neutral-400 mb-2">
            Color:{" "}
            <span className="normal-case text-neutral-700 font-medium">
              {selectedColor}
            </span>
          </p>
          <div className="flex flex-wrap gap-3">
            {allColors.map((color) => (
              <button
                key={color}
                title={color}
                onClick={() => {
                  setSelectedColor(color);
                  setSelectedSize("");
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-150 ${
                  selectedColor === color
                    ? "border-neutral-900"
                    : "border-transparent"
                }`}
              >
                <span
                  className="w-6 h-6 rounded-full border border-black/10"
                  style={{ backgroundColor: colorToHex(color) }}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size */}
      {hasSizes && (
        <div className="mt-5" id="size-selector">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] uppercase tracking-[0.1em] text-neutral-400">
              Size
            </p>
            {product.size_chart_url && (
              <button
                onClick={() => setShowSizeChart(true)}
                className="text-xs text-neutral-500 underline underline-offset-2"
              >
                Size Guide
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {allSizes.map((size) => {
              const available = isAvailable(size);
              const active = selectedSize === size;
              return (
                <button
                  key={size}
                  disabled={!available}
                  onClick={() =>
                    setSelectedSize(selectedSize === size ? "" : size)
                  }
                  className={`min-w-[46px] px-3 py-1.5 rounded text-sm border text-center transition-all duration-150 ${
                    active
                      ? "bg-neutral-900 border-neutral-900 text-white"
                      : available
                        ? "border-neutral-300 text-black hover:border-neutral-900"
                        : "border-neutral-100 text-neutral-300 cursor-not-allowed"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
          {selectedSize && selectedVariant?.stock === 0 && (
            <p className="text-xs text-red-500 mt-1.5">
              {selectedSize} is out of stock
            </p>
          )}
        </div>
      )}

      {/* Size chart modal */}
      {showSizeChart && product.size_chart_url && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setShowSizeChart(false)}
        >
          <div
            className="relative max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowSizeChart(false)}
              className="absolute -top-9 right-0 text-white text-3xl leading-none"
            >
              ×
            </button>
            <Image
              src={product.size_chart_url}
              alt="Size chart"
              width={500}
              height={600}
              className="w-full rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Stock / delivery info box */}
      <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-neutral-200 p-3.5">
        <ShieldCheck className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-green-700">In Stock</p>
          <p className="text-xs text-neutral-400 mt-0.5">
            Delivery in 2-4 days &nbsp;|&nbsp; Free shipping on orders above
            ₹999
          </p>
        </div>
      </div>

      {/* Quantity */}
      <div className="mt-5 flex items-center gap-4">
        <p className="text-[11px] uppercase tracking-[0.1em] text-neutral-400">
          Quantity
        </p>
        <div className="flex items-center border border-neutral-300 rounded">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className={`w-9 h-9 flex items-center justify-center ${quantity===0 ? "opacity-30": "opacity-100"}`}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center text-sm">{quantity}</span>
          <button
            disabled={quantity===5}
            onClick={() => setQuantity((q) => q + 1)}
            className={`w-9 h-9 flex items-center justify-center ${quantity===5 ? "opacity-30": "opacity-100"}`}
            aria-label="Increase quantity" 
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* CTA buttons — side by side */}
      <div id="product-cta" className="mt-6 flex gap-3">
        <button
          disabled={!selectedVariant}
          onClick={handleAddToCart}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded text-sm font-semibold tracking-[0.03em] border transition-all duration-150 ${
            selectedVariant
              ? "border-neutral-900 text-neutral-900 hover:bg-neutral-50 active:scale-[0.98]"
              : "border-neutral-200 text-neutral-400 cursor-not-allowed"
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {hasSizes && !selectedSize
            ? "SELECT A SIZE"
            : added
              ? "ADDED"
              : "ADD TO CART"}
        </button>
        <button
          disabled={!selectedVariant}
          onClick={handleBuyNow}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded text-sm font-semibold tracking-[0.03em] bg-neutral-900 text-white transition-all duration-150 ${
            selectedVariant ? "active:scale-[0.98]" : "opacity-40 cursor-not-allowed"
          }`}
        >
          <Zap className="w-4 h-4" />
          BUY NOW
        </button>
      </div>

      {/* Wishlist */}
      {/* <button
        onClick={() => setWishlisted((w) => !w)}
        className="mt-3 flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700"
      >
        <Heart
          className="w-4 h-4"
          style={{
            fill: wishlisted ? "#dc2626" : "transparent",
            stroke: wishlisted ? "#dc2626" : "currentColor",
          }}
        />
        Add to Wishlist
      </button> */}
    </div>
  );
}