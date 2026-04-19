"use client";
import Link from "next/link";
import { Instagram, Twitter } from "lucide-react";
import { useReveal } from "@/lib/hooks";

export function Footer() {
  const ref = useReveal();
  return (
    <footer className="border-t py-16 px-6 md:px-12" style={{ borderColor: "var(--border)" }}>
      <div className="max-w-[1600px] mx-auto">
        {/* Big text */}
        <div className="mb-20 overflow-hidden">
          <p
            ref={ref as React.RefObject<HTMLParagraphElement>}
            className="reveal font-display text-[clamp(50px,10vw,150px)] leading-none tracking-tighter uppercase"
            style={{ color: "var(--fg)", opacity: 0.08 }}
          >
            DRIFT ABOVE AVERAGE
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] mb-5" style={{ color: "var(--accent)" }}>SHOP</p>
            <ul className="space-y-3">
              {["New Arrivals","Tees","Hoodies","Bottoms","Jackets"].map(item => (
                <li key={item}><Link href="/shop" className="font-body text-base hover-line" style={{ color: "var(--muted)" }}>{item}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] mb-5" style={{ color: "var(--accent)" }}>BRAND</p>
            <ul className="space-y-3">
              {["Our Story","Manifesto","Sustainability","Press"].map(item => (
                <li key={item}><Link href="#" className="font-body text-base hover-line" style={{ color: "var(--muted)" }}>{item}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] mb-5" style={{ color: "var(--accent)" }}>SUPPORT</p>
            <ul className="space-y-3">
              {["Shipping","Returns","Size Guide","Contact"].map(item => (
                <li key={item}><Link href="#" className="font-body text-base hover-line" style={{ color: "var(--muted)" }}>{item}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] mb-5" style={{ color: "var(--accent)" }}>FOLLOW</p>
            <div className="flex flex-col gap-4">
              <Link href="#" className="flex items-center gap-2 hover:opacity-70 transition-opacity" style={{ color: "var(--muted)" }}>
                <Instagram size={14} /><span className="font-mono text-xs tracking-wider">@DRIFTERPEAK</span>
              </Link>
              <Link href="#" className="flex items-center gap-2 hover:opacity-70 transition-opacity" style={{ color: "var(--muted)" }}>
                <Twitter size={14} /><span className="font-mono text-xs tracking-wider">@DRIFTERPEAK</span>
              </Link>
            </div>
            <div className="mt-8">
              <p className="font-mono text-[10px] tracking-[0.2em] mb-3" style={{ color: "var(--muted)" }}>JOIN THE MOVEMENT</p>
              {/* <div className="flex border" style={{ borderColor: "var(--border)" }}>
                <input type="email" placeholder="your@email.com" className="flex-1 bg-transparent px-4 py-3 font-mono text-xs tracking-wider outline-none" style={{ color: "var(--fg)" }} />
                <button className="btn-press px-4 py-3 font-mono text-xs tracking-wider" style={{ background: "var(--accent)", color: "var(--bg)" }}>→</button>
              </div> */}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-8 border-t gap-4" style={{ borderColor: "var(--border)" }}>
          <p className="font-mono text-[10px] tracking-[0.2em]" style={{ color: "var(--muted)" }}>© 2026 DRIFTER PEAK. ALL RIGHTS RESERVED.</p>
          <p className="font-mono text-[10px] tracking-[0.2em]" style={{ color: "var(--muted)" }}>NOT FOR EVERYONE.</p>
        </div>
      </div>
    </footer>
  );
}
