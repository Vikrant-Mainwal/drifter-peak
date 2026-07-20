import Link from "next/link";
import { ProductCard } from "@/features/product/components/ProductCard";
import type { Product } from "@/features/product/types";

export default function RelatedProducts({
  products,
}: {
  products: Product[];
}) {
  if (!products.length) return null;

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-neutral-900">
          You may also like
        </h2>
        <Link
          href="/shop"
          className="text-sm text-neutral-500 hover:text-neutral-700 flex items-center gap-1"
        >
          View all <span aria-hidden>→</span>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}