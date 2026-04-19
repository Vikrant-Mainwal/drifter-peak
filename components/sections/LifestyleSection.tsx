"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useReveal } from "@/lib/hooks";

const lifestyleImages = [
  { src: "https://images.unsplash.com/photo-1611911813383-67769b37a149?w=800&q=80", caption: "@drifterpeak" },
  { src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80", caption: "@community" },
  { src: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80", caption: "@lifestyle" },
  { src: "https://images.unsplash.com/photo-1483721310020-03333e577078?w=800&q=80", caption: "@movement" },
];

export function LifestyleSection() {
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef  = useReveal();
  const ctaRef     = useReveal(200);

  useEffect(() => {
    const handler = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const progress = -rect.top / (rect.height + window.innerHeight);
      if (row1Ref.current) row1Ref.current.style.transform = `translateX(${progress * -80}px)`;
      if (row2Ref.current) row2Ref.current.style.transform = `translateX(${progress * 80}px)`;
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <section ref={sectionRef} className="py-24 overflow-hidden">
      <div ref={headerRef as React.RefObject<HTMLDivElement>} className="reveal px-6 md:px-12 max-w-[1600px] mx-auto mb-16">
        <p className="font-mono text-xs tracking-[0.3em] mb-4" style={{ color: "var(--accent)" }}>— THE MOVEMENT</p>
        <h2 className="font-display text-[clamp(48px,8vw,110px)] leading-none tracking-tight uppercase" style={{ color: "var(--fg)" }}>PEAK LIFE</h2>
      </div>

      {/* Row 1 */}
      <div ref={row1Ref} className="lifestyle-row flex gap-4 mb-4 px-6">
        {[...lifestyleImages,...lifestyleImages].map((img,i) => (
          <div key={i} className="flex-shrink-0 w-64 md:w-80 aspect-[3/4] relative overflow-hidden" style={{ background: "var(--card)" }}>
            <Image src={img.src} alt={img.caption} fill className="object-cover" sizes="320px" />
            <div className="absolute bottom-0 left-0 right-0 p-4" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }}>
              <p className="font-mono text-[10px] tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.8)" }}>{img.caption}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Row 2 */}
      <div ref={row2Ref} className="lifestyle-row flex gap-4 px-6">
        {[...lifestyleImages.slice().reverse(),...lifestyleImages.slice().reverse()].map((img,i) => (
          <div key={i} className="flex-shrink-0 w-48 md:w-60 aspect-square relative overflow-hidden" style={{ background: "var(--card)" }}>
            <Image src={img.src} alt={img.caption} fill className="object-cover" sizes="240px" />
          </div>
        ))}
      </div>

      {/* CTA block */}
      <div ref={ctaRef as React.RefObject<HTMLDivElement>} className="reveal mt-20 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="relative overflow-hidden p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <p className="font-display text-[18vw] leading-none tracking-tighter uppercase whitespace-nowrap" style={{ color: "var(--fg)", opacity: 0.03 }}>JOIN US</p>
          </div>
          <div className="relative z-10">
            <p className="font-mono text-xs tracking-[0.3em] mb-4" style={{ color: "var(--accent)" }}>JOIN THE MOVEMENT</p>
            <h3 className="font-display text-[clamp(36px,6vw,80px)] leading-none tracking-tight uppercase" style={{ color: "var(--fg)" }}>
              NOT FOR EVERYONE.<br /><span style={{ color: "var(--accent)" }}>ARE YOU IN?</span>
            </h3>
          </div>
          <div className="relative z-10 flex flex-col gap-4 items-start md:items-end">
            <Link href="/shop">
              <button className="btn-press px-10 py-5 font-display text-xl tracking-[0.2em] uppercase" style={{ background: "var(--accent)", color: "var(--bg)" }}>
                SHOP THE DROP
              </button>
            </Link>
            <p className="font-mono text-[10px] tracking-[0.25em]" style={{ color: "var(--muted)" }}>FREE SHIPPING ON ORDERS OVER ₹2000</p>
          </div>
        </div>
      </div>
    </section>
  );
}
