"use client";
import { useEffect } from "react";

export function ScrollProgress() {
  useEffect(() => {
    const bar = document.querySelector(".scroll-progress-bar") as HTMLElement;
    if (!bar) return;
    const handler = () => {
      const scrollTop = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docH > 0 ? scrollTop / docH : 0;
      bar.style.transform = `scaleX(${pct})`;
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return <div className="scroll-progress-bar" />;
}
