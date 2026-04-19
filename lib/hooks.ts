"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { getCartState, subscribeToCart, getCartTotal, getCartCount } from "./store";


export function useCart() {
  const [state, setState] = useState(getCartState());
  useEffect(() => {
    const unsub = subscribeToCart(() => setState({ ...getCartState() }));
    return unsub;
  }, []);
  return { items: state.items, isOpen: state.isOpen, total: getCartTotal(), count: getCartCount() };
}

export function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const saved = localStorage.getItem("dp-theme") as "dark" | "light" | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.toggle("light", saved === "light");
    }
  }, []);
  const toggle = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("dp-theme", next);
    document.documentElement.classList.toggle("light", next === "light");
  }, [theme]);
  return { theme, toggle };
}

/** Attach to any element — adds .visible when it scrolls into view */
export function useReveal(delay = 0) {
  const ref = useRef<HTMLElement | HTMLDivElement | HTMLParagraphElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.add("visible");
          }, delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "-60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);
  return ref;
}