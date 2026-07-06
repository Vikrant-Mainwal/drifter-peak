"use client";

import { useEffect, useRef, useState } from "react";
import { useCartStore } from "../../lib/store/cartStore";

interface Props {
  productId: string;
  slug: string;
  name: string;
  variantId: string;
  size: string;
  color: string | null;
  mrp: number;
  price: number;
  stock: number;
  image: string;
}

export function AddToCartButton(props: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const outOfStock = props.stock <= 0;

  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const handleAdd = () => {
    if (outOfStock) return;
    addItem({
      variant_id: props.variantId,
      product_id: props.productId,
      slug: props.slug,
      name: props.name,
      mrp: props.mrp,
      price: props.price,
      size: props.size,
      color: props.color,
      image: props.image,
      stock: props.stock,
    });
    setAdded(true);

    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={outOfStock}
      className="btn-press w-full py-4 font-display text-xl tracking-[0.15em] uppercase disabled:opacity-40"
      style={{
        background: outOfStock ? "var(--muted)" : "var(--fg)",
        color: "var(--bg)",
      }}
    >
      {outOfStock ? "OUT OF STOCK" : added ? "ADDED" : "ADD TO CART"}
    </button>
  );
}
