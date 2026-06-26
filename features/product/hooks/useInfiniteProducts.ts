"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchProducts } from "../api/fetchProducts";
import { FilterCategory, Product } from "../types";

export function useInfiniteProducts(
  category: FilterCategory,
  search?: string
) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cursorRef = useRef<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadProducts = useCallback(
    async (reset = false) => {
      if (isLoading) return;
      setIsLoading(true);
      setError(null);

      try {
        const cursor = reset ? null : cursorRef.current;
        const result = await fetchProducts({ category, cursor, search });

        setProducts((prev) => (reset ? result.products : [...prev, ...result.products]));
        cursorRef.current = result.nextCursor;
        setHasMore(result.hasMore);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        setIsLoading(false);
        setIsInitialLoading(false);
      }
    },
    [category, search, isLoading]
  );

  // Reset when filters change
  useEffect(() => {
    cursorRef.current = null;
    setProducts([]);
    setHasMore(true);
    setIsInitialLoading(true);
    setError(null);

    const load = async () => {
      setIsLoading(true);
      try {
        const result = await fetchProducts({ category, cursor: null, search });
        setProducts(result.products);
        cursorRef.current = result.nextCursor;
        setHasMore(result.hasMore);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        setIsLoading(false);
        setIsInitialLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, search]);

  // IntersectionObserver for infinite scroll sentinel
  const setSentinel = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      sentinelRef.current = node;

      if (!node || !hasMore) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !isLoading) {
            loadProducts(false);
          }
        },
        { threshold: 0.1 }
      );

      observerRef.current.observe(node);
    },
    [hasMore, isLoading, loadProducts]
  );

  return {
    products,
    isLoading,
    isInitialLoading,
    hasMore,
    error,
    setSentinel,
  };
}
