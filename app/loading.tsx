"use client";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
      <div className="anim-fade-in flex flex-col items-center gap-6">
        <div className="font-display text-3xl tracking-[0.2em]" style={{ color: "var(--fg)" }}>
          DRIFTER<span style={{ color: "var(--accent)" }}>.</span>PEAK
        </div>
        <div className="w-32 h-px relative overflow-hidden" style={{ background: "var(--border)" }}>
          <div className="loader-shimmer absolute top-0 left-0 w-full h-full" />
        </div>
      </div>
    </div>
  );
}
