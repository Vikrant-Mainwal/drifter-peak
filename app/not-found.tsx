"use client";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: "var(--bg)" }}>
      <div className="anim-fade-up text-center">
        <p className="font-display text-[20vw] leading-none tracking-tighter mb-0" style={{ color: "var(--fg)", opacity: 0.06 }}>404</p>
        <p className="font-mono text-xs tracking-[0.35em] mb-6 -mt-8" style={{ color: "var(--accent)" }}>PAGE NOT FOUND</p>
        <h1 className="font-display text-[clamp(40px,8vw,100px)] leading-none tracking-tight uppercase mb-8" style={{ color: "var(--fg)" }}>
          YOU DRIFTED<br />TOO FAR.
        </h1>
        <a href="/">
          <button className="btn-press px-10 py-5 font-display text-xl tracking-[0.2em] uppercase" style={{ background: "var(--accent)", color: "var(--bg)" }}>
            BACK TO PEAK
          </button>
        </a>
      </div>
    </div>
  );
}
