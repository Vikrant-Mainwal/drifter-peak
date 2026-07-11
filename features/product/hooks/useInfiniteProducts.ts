"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchProducts } from "../api/fetchProducts";
import { FilterCategory } from "../types";
import { useProductListStore, listKey } from "../lib/store/productListStore";

export function useInfiniteProducts(
  category: FilterCategory,
  search?: string
) {
  const key = listKey(category, search);

  const cached = useProductListStore((s) => s.byKey[key]);
  const isLoadingFromStore = useProductListStore((s) => !!s.loadingKeys[key]);
  const setLoadingKey = useProductListStore((s) => s.setLoading);
  const setEntry = useProductListStore((s) => s.setEntry);
  const appendEntry = useProductListStore((s) => s.appendEntry);
  const isFresh = useProductListStore((s) => s.isFresh);

  const [error, setError] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(!cached);

  const cursorRef = useRef<string | null>(cached?.cursor ?? null);
  const hasMoreRef = useRef(cached?.hasMore ?? true);
  const isLoadingRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const load = useCallback(
    async (reset: boolean) => {
      if (isLoadingRef.current) return;
      isLoadingRef.current = true;
      setLoadingKey(key, true);
      setError(null);

      try {
        const cursor = reset ? null : cursorRef.current;
        const result = await fetchProducts({ category, cursor, search });

        cursorRef.current = result.nextCursor;
        hasMoreRef.current = result.hasMore;

        if (reset) {
          setEntry(key, {
            products: result.products,
            cursor: result.nextCursor,
            hasMore: result.hasMore,
            fetchedAt: Date.now(),
          });
        } else {
          appendEntry(key, result.products, result.nextCursor, result.hasMore);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        isLoadingRef.current = false;
        setLoadingKey(key, false);
        setIsInitialLoading(false);
      }
    },
    [category, search, key, setLoadingKey, setEntry, appendEntry]
  );

  // Runs whenever the filters (category/search) change, or on first mount.
  useEffect(() => {
    cursorRef.current = cached?.cursor ?? null;
    hasMoreRef.current = cached?.hasMore ?? true;

    // Already have fresh data for this exact category/search — e.g. the
    // shopper went cart -> home and this is remounting from scratch. Skip
    // the network round trip and skeleton entirely; show the cached page.
    if (isFresh(key)) {
      setIsInitialLoading(false);
      setError(null);
      return;
    }

    setIsInitialLoading(!cached);
    setError(null);
    load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // IntersectionObserver for infinite scroll. Only reconnects when the
  // sentinel DOM node itself changes (or the filters change, which
  // recreates `load`) — not on every loading/hasMore toggle.
  const setSentinel = useCallback(
    (node: HTMLDivElement | null) => {
      observerRef.current?.disconnect();
      observerRef.current = null;

      if (!node) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMoreRef.current && !isLoadingRef.current) {
            load(false);
          }
        },
        { threshold: 0.1 }
      );

      observerRef.current.observe(node);
    },
    [load]
  );

  return {
    products: cached?.products ?? [],
    isLoading: isLoadingFromStore,
    isInitialLoading,
    hasMore: cached?.hasMore ?? true,
    error,
    setSentinel,
  };
}