import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "../db/supabase";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
};

type CartStore = {
  items: CartItem[];
  isOpen: boolean;

  addItem: (item: CartItem) => Promise<void>;
  removeItem: (id: string, size: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number, size: string) => Promise<void>;

  // ✅ ADD THIS
  setItems: (items: CartItem[]) => void;

  loadCart: () => Promise<void>;

  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCartOpen: () => void;
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      // ✅ NEW FUNCTION
      setItems: (items) => set({ items }),

      // 🔥 LOAD FROM DB (recommended)
      loadCart: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from("cart_items")
          .select("*")
          .eq("user_id", user.id);

        if (!data) return;

        const formatted = data.map((item) => ({
          id: item.product_id,
          name: item.name,
          price: item.price,
          image: item.image,
          size: item.size,
          quantity: item.quantity,
        }));

        set({ items: formatted });
      },

      // 🔥 ADD ITEM (fixed merge)
      addItem: async (item) => {
        const prev = get().items;

        const existing = prev.find(
          (i) => i.id === item.id && i.size === item.size
        );

        let updated;

        if (existing) {
          updated = prev.map((i) =>
            i.id === item.id && i.size === item.size
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
        } else {
          updated = [...prev, item];
        }

        set({ items: updated });

        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          await supabase.from("cart_items").upsert({
            user_id: user.id,
            product_id: item.id,
            size: item.size,
            quantity: existing
              ? existing.quantity + item.quantity
              : item.quantity,
            name: item.name,
            price: item.price,
            image: item.image,
          });
        } catch {
          set({ items: prev });
        }
      },

      // 🔥 REMOVE ITEM
      removeItem: async (id, size) => {
        const prev = get().items;

        set({
          items: prev.filter(
            (item) => !(item.id === id && item.size === size)
          ),
        });

        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          await supabase
            .from("cart_items")
            .delete()
            .eq("product_id", id)
            .eq("size", size)
            .eq("user_id", user.id);
        } catch {
          set({ items: prev });
        }
      },

      // 🔥 UPDATE QUANTITY
      updateQuantity: async (id, quantity, size) => {
        const prev = get().items;

        if (quantity <= 0) {
          return get().removeItem(id, size);
        }

        set({
          items: prev.map((item) =>
            item.id === id && item.size === size
              ? { ...item, quantity }
              : item
          ),
        });

        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          await supabase.from("cart_items").upsert({
            user_id: user.id,
            product_id: id,
            size,
            quantity,
          });
        } catch {
          set({ items: prev });
        }
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCartOpen: () =>
        set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: "cart-storage",
    }
  )
);