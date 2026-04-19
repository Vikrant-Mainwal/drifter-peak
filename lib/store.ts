"use client";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  image: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  total: () => number;
  count: () => number;
}

let cartListeners: (() => void)[] = [];
let cartState: { items: CartItem[]; isOpen: boolean } = {
  items: [],
  isOpen: false,
};

export function getCartState() {
  return cartState;
}

export function subscribeToCart(listener: () => void) {
  cartListeners.push(listener);
  return () => {
    cartListeners = cartListeners.filter((l) => l !== listener);
  };
}

function notifyCart() {
  cartListeners.forEach((l) => l());
}

export function addToCart(item: CartItem) {
  const existing = cartState.items.find(
    (i) => i.id === item.id && i.size === item.size
  );
  if (existing) {
    cartState = {
      ...cartState,
      items: cartState.items.map((i) =>
        i.id === item.id && i.size === item.size
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ),
    };
  } else {
    cartState = { ...cartState, items: [...cartState.items, item] };
  }
  notifyCart();
}

export function removeFromCart(id: string, size: string) {
  cartState = {
    ...cartState,
    items: cartState.items.filter((i) => !(i.id === id && i.size === size)),
  };
  notifyCart();
}

export function updateCartQuantity(id: string, size: string, quantity: number) {
  if (quantity <= 0) {
    removeFromCart(id, size);
    return;
  }
  cartState = {
    ...cartState,
    items: cartState.items.map((i) =>
      i.id === id && i.size === size ? { ...i, quantity } : i
    ),
  };
  notifyCart();
}

export function toggleCartOpen() {
  cartState = { ...cartState, isOpen: !cartState.isOpen };
  notifyCart();
}

export function getCartTotal() {
  return cartState.items.reduce((s, i) => s + i.price * i.quantity, 0);
}

export function getCartCount() {
  return cartState.items.reduce((s, i) => s + i.quantity, 0);
}
