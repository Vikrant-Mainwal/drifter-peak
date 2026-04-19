"use client";

const words = ["DRIFT ABOVE AVERAGE","PEAK MINDSET","NOT FOR EVERYONE","BUILT DIFFERENT","DROP 01","LIMITED UNITS"];

export function MarqueeSection() {
  return (
    <section className="py-6 overflow-hidden border-y" style={{ borderColor: "var(--border)" }}>
      <div className="marquee-wrapper mb-3">
        <div className="marquee-track">
          {[...words,...words].map((w,i) => (
            <span key={i} className="font-display text-3xl md:text-5xl uppercase tracking-widest mx-8 whitespace-nowrap"
              style={{ color: i%3===1 ? "var(--accent)" : "var(--fg)", opacity: i%3===1 ? 1 : 0.15 }}>
              {w}
            </span>
          ))}
        </div>
      </div>
      <div className="marquee-wrapper">
        <div className="marquee-track-reverse">
          {[...words.slice().reverse(),...words.slice().reverse()].map((w,i) => (
            <span key={i} className="font-mono text-xs tracking-[0.4em] uppercase mx-10 whitespace-nowrap" style={{ color: "var(--muted)" }}>{w}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
