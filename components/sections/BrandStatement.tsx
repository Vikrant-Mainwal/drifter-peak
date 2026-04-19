"use client";
import { useEffect, useRef } from "react";
import { useReveal } from "@/lib/hooks";

const lines = [
  { text: "We don't chase trends.", accent: false },
  { text: "We set them.",           accent: true  },
  { text: "For the ones who",       accent: false },
  { text: "drift above average.",   accent: true  },
];

export function BrandStatement() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgTextRef  = useRef<HTMLParagraphElement>(null);
  const labelRef   = useReveal();
  const statsRef   = useReveal(400);

  /* Parallax on bg text */
  useEffect(() => {
    const handler = () => {
      if (!sectionRef.current || !bgTextRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const progress = -rect.top / (rect.height + window.innerHeight);
      bgTextRef.current.style.transform = `translateY(${progress * 120 - 30}px)`;
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <section ref={sectionRef} id="brand" className="relative py-32 md:py-48 px-6 md:px-12 overflow-hidden">
      <div className="absolute top-0 left-12 md:left-24 h-full w-px" style={{ background: "var(--border)" }} />
      <div className="absolute top-0 right-12 md:right-24 h-full w-px" style={{ background: "var(--border)" }} />

      {/* Parallax bg text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <p ref={bgTextRef} className="parallax-bg font-display text-[20vw] leading-none uppercase tracking-tighter whitespace-nowrap" style={{ color: "var(--fg)", opacity: 0.02 }}>DRIFTER</p>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div ref={labelRef as React.RefObject<HTMLDivElement>} className="reveal mb-14">
          <p className="font-mono text-xs tracking-[0.35em]" style={{ color: "var(--accent)" }}>OUR MANIFESTO —</p>
        </div>

        {/* Statement lines */}
        <div className="space-y-3 mb-16">
          {lines.map((line, i) => (
            <RevealLine key={i} text={line.text} accent={line.accent} delay={i * 100} />
          ))}
        </div>

        {/* Stats */}
        <div ref={statsRef as React.RefObject<HTMLDivElement>} className="reveal stagger grid grid-cols-3 gap-8 pt-16 border-t" style={{ borderColor: "var(--border)", transitionDelay: "0.4s" }}>
          {[{ num: "200", label: "UNITS PER DROP" },{ num: "100%", label: "PREMIUM COTTON" },{ num: "0", label: "COMPROMISES" }].map(stat => (
            <div key={stat.label}>
              <p className="font-display text-[clamp(36px,6vw,72px)] leading-none tracking-tight mb-2" style={{ color: "var(--fg)" }}>{stat.num}</p>
              <p className="font-mono text-[10px] tracking-[0.3em]" style={{ color: "var(--muted)" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RevealLine({ text, accent, delay }: { text: string; accent: boolean; delay: number }) {
  const ref = useReveal(delay);
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="reveal-text">
      <span className="font-display text-[clamp(38px,7vw,90px)] leading-[1.05] tracking-tight uppercase"
        style={{ color: accent ? "var(--accent)" : "var(--fg)", transitionDelay: `${delay}ms` }}>
        {text}
      </span>
    </div>
  );
}
