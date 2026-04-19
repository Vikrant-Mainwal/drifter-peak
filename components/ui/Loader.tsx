"use client";
import { useEffect, useRef } from "react";

export function Loader() {
  const ref = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      count = Math.min(count + Math.floor(Math.random() * 18 + 5), 100);
      if (counterRef.current) {
        counterRef.current.textContent = String(count).padStart(3, "0");
      }
      if (count >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          if (ref.current) ref.current.classList.add("done");
        }, 400);
      }
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={ref} className="loader-screen fixed inset-0 z-[100] flex flex-col items-center justify-center" style={{ background: "var(--bg)" }}>
      <div className="anim-fade-up font-display text-4xl md:text-6xl tracking-[0.15em] uppercase mb-16" style={{ color: "var(--fg)" }}>
        DRIFTER<span style={{ color: "var(--accent)" }}>.</span>PEAK
      </div>
      <div className="w-48 h-px relative" style={{ background: "var(--border)" }}>
        <div className="loader-progress absolute top-0 left-0 w-0" />
      </div>
      <span ref={counterRef} className="font-mono text-xs tracking-[0.4em] mt-6" style={{ color: "var(--muted)" }}>000</span>
      <p className="anim-fade-in delay-400 font-mono text-[10px] tracking-[0.4em] mt-16" style={{ color: "var(--muted)" }}>
        PEAK MINDSET ONLY
      </p>
    </div>
  );
}
