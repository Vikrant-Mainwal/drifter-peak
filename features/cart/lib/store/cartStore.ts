"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem } from "@/features/cart/types/cart";
import {
  clearCartItems,
  getOrCreateCart,
  fetchCartItems,
  upsertCartItem,
  deleteCartItem,
  mergeGuestCartToDb,
} from "../supabase/cartQueries";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  loading: boolean;
  cartId: string | null;
  /** The user id the cart is currently synced to, or null for guest/none.
   *  Used by loadCart() to skip redundant reloads (and the loading flash
   *  that comes with them) when it's called again for the same user. */
  loadedForUserId: string | null;

  hydrated: boolean;
  setHydrated: (value: boolean) => void;

  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  loadCart: (userId: string | null) => Promise<void>;

  total: () => number;
  count: () => number;
}

const pendingSync = new Map<string, ReturnType<typeof setTimeout>>();
const SYNC_DELAY = 800;

function scheduleSync(cartId: string, variantId: string, quantity: number) {
  const key = `${cartId}:${variantId}`;
  const existing = pendingSync.get(key);
  if (existing) clearTimeout(existing);

  pendingSync.set(
    key,
    setTimeout(() => {
      pendingSync.delete(key);
      const fn =
        quantity <= 0
          ? deleteCartItem(cartId, variantId)
          : upsertCartItem(cartId, variantId, quantity);
      fn.catch((e) => console.error("cart sync failed", e));
    }, SYNC_DELAY),
  );
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      loading: false,
      cartId: null,
      loadedForUserId: null,

      hydrated: false,
      setHydrated: (value) => set({ hydrated: value }),

      addItem: (item, qty = 1) => {
        const { items, cartId } = get();
        const existing = items.find((i) => i.variant_id === item.variant_id);
        const cap = item.stock ?? Infinity;

        const nextItems = existing
          ? items.map((i) =>
              i.variant_id === item.variant_id
                ? { ...i, quantity: Math.min(i.quantity + qty, cap) }
                : i,
            )
          : [...items, { ...item, quantity: Math.min(qty, cap) }];

        set({ items: nextItems, isOpen: true });

        if (cartId) {
          const updated = nextItems.find(
            (i) => i.variant_id === item.variant_id,
          )!;
          scheduleSync(cartId, item.variant_id, updated.quantity);
        }
      },

      removeItem: (variantId) => {
        const { cartId } = get();
        set((state) => ({
          items: state.items.filter((i) => i.variant_id !== variantId),
        }));
        if (cartId) scheduleSync(cartId, variantId, 0);
      },

      updateQuantity: (variantId, quantity) => {
        const { cartId } = get();
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.variant_id === variantId
              ? { ...i, quantity: Math.min(quantity, i.stock ?? Infinity) }
              : i,
          ),
        }));
        const updated = get().items.find((i) => i.variant_id === variantId);

        if (cartId && updated) {
          scheduleSync(cartId, variantId, updated.quantity);
        }
      },

      clearCart: async () => {
        const { cartId } = get();

        set({ items: [] });

        if (!cartId) return;

        try {
          await clearCartItems(cartId);
        } catch (err) {
          console.error(err);
        }
      },

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      openCart: () => set({ isOpen: true }),

      closeCart: () => set({ isOpen: false }),

      loadCart: async (userId) => {
        const { loading, loadedForUserId } = get();

        if (!userId) {
          if (loadedForUserId === null) return;
          set({ cartId: null, items: [], loading: false, loadedForUserId: null });
          return;
        }

        // Already synced to this exact user — nothing to do. This is what
        // stops a redundant loadCart() call (e.g. from an auth event firing
        // again for the same user) from flashing the cart back to a loading
        // state and re-hitting the DB for no reason.
        if (loadedForUserId === userId) return;

        // A load for this user is already in flight — let it finish
        // instead of racing a second, overlapping fetch.
        if (loading) return;

        set({ loading: true });
        try {
          const cartId = await getOrCreateCart(userId);
          const { cartId: currentCartId, items: currentItems } = get();

          // Only merge if we haven't already synced to this cart in this session
          const alreadyLoaded = currentCartId === cartId;

          if (!alreadyLoaded && currentItems.length > 0) {
            await mergeGuestCartToDb(
              cartId,
              currentItems.map((i) => ({
                variant_id: i.variant_id,
                quantity: i.quantity,
              })),
            );
          }

          const dbItems = await fetchCartItems(cartId);
          set({ items: dbItems, cartId, loading: false, loadedForUserId: userId });
        } catch (e) {
          console.error("loadCart failed", e);
          set({ loading: false });
        }
      },

      total: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "drifter-cart",
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        items: state.items,
        cartId: state.cartId,
      }),

      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);