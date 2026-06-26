"use client";

import { useState } from "react";
import { CategoryFilter } from "./CategoryFilter";
import { ProductCard } from "./ProductCard";
import { ProductGridSkeleton } from "./ProductSkeleton";
import { useInfiniteProducts } from "../hooks/useInfiniteProducts";
import { FilterCategory } from "../types";

export function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("all");

  const { products, isLoading, isInitialLoading, hasMore, error, setSentinel } =
    useInfiniteProducts(activeCategory);

  const handleCategoryChange = (category: FilterCategory) => {
    setActiveCategory(category);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky filter bar */}
      <div className="sticky top-[56px] md:top-[64px] z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto py-3">
          <CategoryFilter active={activeCategory} onChange={handleCategoryChange} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 md:px-6 py-4">
        {/* Category heading */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 capitalize">
            {activeCategory === "all" ? "All Products" : activeCategory}
          </h2>
          {!isInitialLoading && (
            <p className="text-sm text-gray-400">
              {products.length} {products.length === 1 ? "item" : "items"} shown
            </p>
          )}
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Initial skeleton */}
        {isInitialLoading ? (
          <ProductGridSkeleton count={12} />
        ) : (
          <>
            {products.length === 0 && !isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 text-center px-4">
                <svg
                  className="w-16 h-16 text-gray-300 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <p className="text-gray-500 font-medium">No products found</p>
                <p className="text-gray-400 text-sm mt-1">
                  Try a different category
                </p>
              </div>
            ) : (
              <>
                {/* Product grid: 2 cols mobile, 4 cols desktop */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {products.map((product,i) => (
                    <ProductCard key={product.id} product={product} large={i === 0 || i === 3} delay={i * 70}/>
                  ))}
                </div>

                {/* Loading more skeletons */}
                {isLoading && (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-3 md:mt-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-white border border-gray-100 rounded-lg overflow-hidden animate-pulse"
                      >
                        <div className="aspect-[3/4] bg-gray-200" />
                        <div className="p-2.5 space-y-2">
                          <div className="h-3 bg-gray-200 rounded w-1/3" />
                          <div className="h-4 bg-gray-200 rounded" />
                          <div className="h-4 bg-gray-200 rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Infinite scroll sentinel */}
                {hasMore && (
                  <div ref={setSentinel} className="h-10 w-full" aria-hidden="true" />
                )}

                {/* End of results */}
                {!hasMore && products.length > 0 && (
                  <div className="text-center py-10 text-sm text-gray-400">
                    You&apos;ve seen all products
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}