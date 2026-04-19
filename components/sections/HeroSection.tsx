"use client";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Gradient bg */}
      <div className="absolute inset-0 z-0" style={{ background: "radial-gradient(ellipse 80% 60% at 60% 30%, rgba(232,255,0,0.06) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 20% 80%, rgba(255,45,45,0.05) 0%, transparent 50%)" }} />

      {/* Ghost text */}
      <div className="absolute inset-0 flex items-center justify-center z-0 select-none pointer-events-none overflow-hidden">
        <span className="anim-fade-in delay-500 font-display text-[25vw] leading-none tracking-tighter uppercase whitespace-nowrap" style={{ color: "var(--fg)", opacity: 0.03 }}>PEAK</span>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 pb-16 md:pb-24 pt-32 w-full">
        <div className="max-w-4xl">
          {/* Live badge */}
          <div className="anim-fade-up delay-800 flex items-center gap-3 mb-8">
            <div className="pulse-dot w-2 h-2 rounded-full" style={{ background: "var(--accent)" }} />
            <span className="font-mono text-xs tracking-[0.3em]" style={{ color: "var(--accent)" }}>DROP 01 — LIMITED UNITS AVAILABLE</span>
          </div>

          {/* BUILT */}
          <div className="overflow-hidden mb-4">
            <h1 className="anim-reveal-up delay-900 font-display text-[clamp(70px,14vw,200px)] leading-[0.85] tracking-tighter uppercase" style={{ color: "var(--fg)" }}>BUILT</h1>
          </div>
          {/* DIFFERENT */}
          <div className="overflow-hidden mb-8">
            <h1 className="anim-reveal-up delay-1000 font-display text-[clamp(70px,14vw,200px)] leading-[0.85] tracking-tighter uppercase" style={{ color: "transparent", WebkitTextStroke: "2px var(--fg)" }}>DIFFERENT</h1>
          </div>

          {/* Sub + CTA */}
          <div className="anim-fade-up delay-1200 flex flex-col sm:flex-row items-start sm:items-center gap-8">
            <p className="font-body text-lg max-w-xs leading-relaxed" style={{ color: "var(--muted)" }}>
              Premium streetwear for the ones who move above the noise. Peak mindset only.
            </p>
            <a href="/shop">
              <button className="btn-press relative flex-shrink-0 px-10 py-5 font-display text-xl tracking-[0.2em] uppercase overflow-hidden" style={{ background: "var(--accent)", color: "var(--bg)" }}>
                EXPLORE DROP
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="anim-fade-in delay-1800 absolute bottom-8 right-8 md:right-12 z-10 flex flex-col items-center gap-2">
        <div className="loader-shimmer w-px h-12" style={{ background: "var(--muted)" }} />
        <span className="font-mono text-[9px] tracking-[0.3em] rotate-90 origin-center" style={{ color: "var(--muted)" }}>SCROLL</span>
      </div>

      {/* Bottom tags */}
      <div className="anim-fade-in delay-1500 absolute bottom-8 left-6 md:left-12 z-10 flex items-center gap-6">
        {["DROP 01","6 PIECES","LIMITED"].map((tag, i) => (
          <span key={tag} className="font-mono text-[10px] tracking-[0.25em]" style={{ color: "var(--muted)" }}>
            {tag}{i < 2 && <span className="ml-6" style={{ color: "var(--border)" }}>—</span>}
          </span>
        ))}
      </div>
    </section>
  );
}
