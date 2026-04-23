import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createClient } from "@/lib/supabase/client";

export type CartItem = {
  id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
};

type CartStore = {
  items: CartItem[];
  loading: boolean;
  isOpen: boolean;

  loadCart: () => Promise<void>;
  addItem: (item: Omit<CartItem, "id">) => Promise<void>;
  removeItem: (product_id: string, size: string) => Promise<void>;
  updateQuantity: (
    product_id: string,
    quantity: number,
    size: string
  ) => Promise<void>;
  clearCart: () => Promise<void>;

  openCart: () => void;
  closeCart: () => void;
  toggleCartOpen: () => void;
};

let isLoadingCart = false;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      loading: false,
      isOpen: false,

      // LOAD CART (safe)
      loadCart: async () => {
        if (typeof window === "undefined") return;
        if (isLoadingCart) return;

        isLoadingCart = true;
        set({ loading: true });

        try {
          const supabase = createClient();

          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (!user) {
            set({ loading: false });
            return;
          }

          const { data, error } = await supabase
            .from("cart_items")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: true });

          if (error) throw error;

          const items =
            data?.map((row) => ({
              id: row.id,
              product_id: row.product_id,
              name: row.product_name,
              image: row.product_image,
              price: row.price,
              quantity: row.quantity,
              size: row.size,
            })) || [];

          set((state) => ({
            items: items.length > 0 ? items : state.items,
            loading: false,
          }));
        } catch (e) {
          console.error("loadCart error:", e);
          set({ loading: false });
        } finally {
          isLoadingCart = false;
        }
      },

      // ADD ITEM
      addItem: async (item) => {
        const prev = get().items;

        const existing = prev.find(
          (i) =>
            i.product_id === item.product_id && i.size === item.size
        );

        let updated;

        if (existing) {
          updated = prev.map((i) =>
            i.product_id === item.product_id && i.size === item.size
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
        } else {
          updated = [...prev, { ...item, id: crypto.randomUUID() }];
        }

        set({ items: updated });

        try {
          const supabase = createClient();

          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (!user) return;

          await supabase.from("cart_items").upsert(
            {
              user_id: user.id,
              product_id: item.product_id,
              product_name: item.name,
              product_image: item.image,
              price: item.price,
              quantity: existing
                ? existing.quantity + item.quantity
                : item.quantity,
              size: item.size,
            },
            {
              onConflict: "user_id,product_id,size",
            }
          );
        } catch (e) {
          console.error("addItem error:", e);
          set({ items: prev });
        }
      },

      // REMOVE ITEM
      removeItem: async (product_id, size) => {
        const prev = get().items;

        set({
          items: prev.filter(
            (item) =>
              !(item.product_id === product_id && item.size === size)
          ),
        });

        try {
          const supabase = createClient();

          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (!user) return;

          await supabase
            .from("cart_items")
            .delete()
            .eq("user_id", user.id)
            .eq("product_id", product_id)
            .eq("size", size);
        } catch (e) {
          console.error("removeItem error:", e);
          set({ items: prev });
        }
      },

      // UPDATE QUANTITY
      updateQuantity: async (product_id, quantity, size) => {
        const prev = get().items;

        if (quantity <= 0) {
          return get().removeItem(product_id, size);
        }

        set({
          items: prev.map((item) =>
            item.product_id === product_id && item.size === size
              ? { ...item, quantity }
              : item
          ),
        });

        try {
          const supabase = createClient();

          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (!user) return;

          await supabase
            .from("cart_items")
            .update({ quantity })
            .eq("user_id", user.id)
            .eq("product_id", product_id)
            .eq("size", size);
        } catch (e) {
          console.error("updateQuantity error:", e);
          set({ items: prev });
        }
      },

      // CLEAR CART
      clearCart: async () => {
        const prev = get().items;
        set({ items: [] });

        try {
          const supabase = createClient();

          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (!user) return;

          await supabase
            .from("cart_items")
            .delete()
            .eq("user_id", user.id);
        } catch (e) {
          console.error("clearCart error:", e);
          set({ items: prev });
        }
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCartOpen: () =>
        set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        items: state.items,
        isOpen: state.isOpen,
      }),
    }
  )
);