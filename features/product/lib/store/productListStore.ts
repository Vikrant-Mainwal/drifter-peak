"use client";

import { create } from "zustand";
import type { FilterCategory, Product, SortOption } from "../../types";

// How long a cached page of products is considered fresh. Within this
// window, remounting ProductGrid (e.g. navigating cart -> home) reuses the
// cached data instantly instead of refetching and re-showing the skeleton.
// After it expires, the next mount fetches fresh data as normal.
const STALE_MS = 2 * 60 * 1000;

interface ListEntry {
  products: Product[];
  cursor: string | null;
  hasMore: boolean;
  fetchedAt: number;
}

interface ProductListStore {
  byKey: Record<string, ListEntry>;
  loadingKeys: Record<string, boolean>;
  isFresh: (key: string) => boolean;
  setLoading: (key: string, value: boolean) => void;
  setEntry: (key: string, entry: ListEntry) => void;
  appendEntry: (
    key: string,
    products: Product[],
    cursor: string | null,
    hasMore: boolean,
  ) => void;
}

export const useProductListStore = create<ProductListStore>((set, get) => ({
  byKey: {},
  loadingKeys: {},

  isFresh: (key) => {
    const entry = get().byKey[key];
    return !!entry && Date.now() - entry.fetchedAt < STALE_MS;
  },

  setLoading: (key, value) =>
    set((state) => ({
      loadingKeys: { ...state.loadingKeys, [key]: value },
    })),

  setEntry: (key, entry) =>
    set((state) => ({
      byKey: { ...state.byKey, [key]: entry },
    })),

  appendEntry: (key, products, cursor, hasMore) =>
    set((state) => {
      const prev = state.byKey[key];
      return {
        byKey: {
          ...state.byKey,
          [key]: {
            products: prev ? [...prev.products, ...products] : products,
            cursor,
            hasMore,
            fetchedAt: Date.now(),
          },
        },
      };
    }),
}));

export function listKey(category: FilterCategory, sort?: SortOption, search?: string) {
  return `${category}::${sort ?? "newest"}::${search ?? ""}`;
}