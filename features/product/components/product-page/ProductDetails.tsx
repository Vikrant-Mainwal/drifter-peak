"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Product, ProductVariant } from "@/features/product/types";
import { useCartStore } from "@/features/cart/lib/store/cartStore";

interface Props {
  product: Product;
  variants: ProductVariant[];
  image: string; //  NEW: primary product image, passed from the server page
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
      {/* Brand */}
      {product.brand && (
        <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-400 mb-1.5">
          {product.brand}
        </p>
      )}

      {/* Title */}
      <h1 className="text-2xl md:text-[28px] font-semibold leading-snug text-neutral-900">
        {product.detail_title ?? product.list_title}
      </h1>

      {/* Slogan */}
      {product.slogan && (
        <p className="text-sm text-neutral-500 mt-1">{product.slogan}</p>
      )}

      {/* Price */}
      <div className="flex items-baseline gap-2.5 mt-4">
        <span className="text-xl font-semibold text-neutral-900">
          ₹{displayPrice.toLocaleString("en-IN")}
        </span>
        {displayPrice < product.mrp && (
          <>
            <span className="text-sm text-neutral-400 line-through">
              ₹{product.mrp.toLocaleString("en-IN")}
            </span>
            <span className="text-sm text-green-600 font-medium">
              {discountPct}% off
            </span>
          </>
        )}
      </div>

      {/*   Color     */}
      {hasColors && (
        <div className="mt-6">
          <p className="text-[11px] uppercase tracking-[0.1em] text-neutral-400 mb-2">
            Colour —{" "}
            <span className="normal-case tracking-normal text-neutral-700">
              {selectedColor}
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            {allColors.map((color) => (
              <button
                key={color}
                onClick={() => {
                  setSelectedColor(color);
                  setSelectedSize("");
                }}
                className={`px-3 py-1 rounded text-sm border transition-all duration-150 ${
                  selectedColor === color
                    ? "bg-neutral-900 border-neutral-900 text-white"
                    : "border-neutral-300 text-neutral-700 hover:border-neutral-500"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/*   Size     */}
      {hasSizes && (
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] uppercase tracking-[0.1em] text-neutral-400">
              Size
            </p>
            {product.size_chart_url && (
              <button
                onClick={() => setShowSizeChart(true)}
                className="text-xs text-neutral-500 underline underline-offset-2"
              >
                Size chart
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
                        ? "border-neutral-300 text-neutral-700 hover:border-neutral-500"
                        : "border-neutral-100 text-neutral-300 cursor-not-allowed line-through"
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

      {/*   CTA buttons    */}
      <div className="mt-6 flex flex-col gap-3">
        <button
          disabled={!selectedVariant}
          onClick={handleAddToCart}
          className={`w-full py-4 rounded text-sm font-semibold tracking-[0.1em] transition-all duration-150 ${
            selectedVariant
              ? "bg-neutral-900 text-white hover:bg-neutral-700 active:scale-[0.98]"
              : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
          }`}
        >
          {hasSizes && !selectedSize
            ? "SELECT A SIZE"
            : added
              ? "ADDED"
              : "ADD TO CART"}
        </button>
        <button
          disabled={!selectedVariant}
          onClick={handleBuyNow}
          className={`w-full py-4 rounded text-sm font-semibold tracking-[0.1em] border transition-all duration-150 ${
            selectedVariant
              ? "border-neutral-900 text-neutral-900 hover:bg-neutral-50 active:scale-[0.98]"
              : "border-neutral-200 text-neutral-400 cursor-not-allowed"
          }`}
        >
          BUY NOW
        </button>
      </div>

      {/*   Perks     */}
      <div className="mt-4 flex flex-col gap-1 text-xs text-neutral-400">
        {product.is_returnable && <p>- Returnable</p>}
        {product.is_exchangeable && (
          <p>- Exchange within {product.exchange_window_days} days</p>
        )}
        <p>- Secure payments</p>
      </div>

      {/*   Description    */}
      {product.description && (
        <div className="mt-6 pt-6 border-t border-neutral-100">
          <p className="text-sm text-neutral-600 leading-relaxed">
            {product.description}
          </p>
        </div>
      )}

      {/*   Specs     */}
      {product.specs && Object.keys(product.specs).length > 0 && (
        <div className="mt-6 pt-6 border-t border-neutral-100">
          <p className="text-xs uppercase tracking-[0.1em] text-neutral-400 mb-3">
            Product specs
          </p>
          <table className="w-full text-sm">
            <tbody>
              {Object.entries(product.specs).map(([label, value]) => (
                <tr key={label} className="border-b border-neutral-50">
                  <td className="py-2 pr-4 text-neutral-400 align-top w-2/5">
                    {label}
                  </td>
                  <td className="py-2 text-neutral-700">{value as string}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}