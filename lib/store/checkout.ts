// lib/store/checkout.store.ts
import { create } from 'zustand';
import type { Address, CartItem } from '@/types/index';

interface CheckoutState {
  selectedAddressId: string | null;
  cartItems: CartItem[];
  setSelectedAddressId: (id: string) => void;
  setCartItems: (items: CartItem[]) => void;
  clearCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  selectedAddressId: null,
  cartItems: [],
  setSelectedAddressId: (id) => set({ selectedAddressId: id }),
  setCartItems: (items) => set({ cartItems: items }),
  clearCheckout: () => set({ selectedAddressId: null, cartItems: [] }),
}));