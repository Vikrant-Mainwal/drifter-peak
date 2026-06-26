"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/ui/Toast";

const navLinks = [
  { label: "All", href: "/shop" },
  { label: "Men", href: "/shop" },
  { label: "Women", href: "/shop" },
  { label: "Accessories", href: "/shop" },
  { label: "Orders", href: "/order" },
];

export function Navbar() {
  const count = useCartStore((s) =>
    s.items.reduce((total, item) => total + item.quantity, 0),
  );
  const { openCart } = useCartStore();

  // NEW HOOKS
  const { user, isLoggedIn, loading, logout } = useUserRole();
  const { toasts, show, dismiss } = useToast();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const prevCount = useRef(count);
  const badgeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (count > prevCount.current && badgeRef.current) {
      badgeRef.current.classList.remove("anim-bounce-in");
      void badgeRef.current.offsetWidth;
      badgeRef.current.classList.add("anim-bounce-in");
    }
    prevCount.current = count;
  }, [count]);

  // LOGOUT HANDLER
  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    show("Signed out successfully", "info");
    window.location.reload(); // ensure UI refresh
  };

  return (
    <>
      <header className={`navbar fixed top-0 left-0 right-0 z-50 bg-white`}>
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-16 md:h-20 flex items-center justify-between  shadow-lg">
          {/* LOGO */}
          <Link href="/">
            <div
              className="font-display text-2xl md:text-3xl tracking-[0.15em] uppercase"
              style={{ color: "var(--fg)" }}
            >
              DRIFTER PEAK
            </div>
          </Link>

          {/* NAV LINKS */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-mono text-xs tracking-[0.25em] hover-line transition-colors duration-200"
                style={{ color: "var(--muted)" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-5">
            {/* CART */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 transition-opacity hover:opacity-70"
              style={{ color: "var(--fg)" }}
            >
              <ShoppingBag size={18} />
              {count > 0 && (
                <span
                  ref={badgeRef}
                  className="anim-bounce-in absolute -top-2 -right-2 w-4 h-4 font-mono text-[9px] flex items-center justify-center rounded-full"
                  style={{
                    background: "var(--accent)",
                    color: "var(--bg)",
                  }}
                >
                  {count}
                </span>
              )}
            </button>

            {/* AUTH */}
            {!loading &&
              (isLoggedIn ? (
                <div className="relative">
                  <button onClick={() => setUserMenuOpen((o) => !o)}>
                    <div
                      className="w-6 h-6 rounded-full border flex items-center justify-center text-[10px]"
                      style={{
                        borderColor: "var(--border)",
                        color: "var(--fg)",
                      }}
                    >
                      {user?.email?.[0]?.toUpperCase()}
                    </div>
                  </button>

                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setUserMenuOpen(false)}
                      />

                      <div
                        className="absolute right-0 top-full mt-2 w-44 border z-40"
                        style={{
                          background: "var(--bg)",
                          borderColor: "var(--border)",
                        }}
                      >
                        <Link
                          href="/profile"
                          className="block w-full text-left px-4 py-2 text-[10px]"
                          style={{ color: "var(--fg)" }}
                        >
                          Profile
                        </Link>
                        <Link
                          href="/orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2 text-[10px]"
                        >
                          ORDERS
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-[10px]"
                        >
                          LOGOUT
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:block text-[10px] tracking-[0.2em]"
                  style={{ color: "var(--muted)" }}
                >
                  LOGIN
                </Link>
              ))}

            {/* MOBILE MENU */}
            <button
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ color: "var(--fg)" }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div
        className={`mobile-menu fixed inset-0 z-40 flex flex-col justify-center px-10 ${
          mobileOpen ? "open" : ""
        }`}
        style={{ background: "var(--bg)" }}
      >
        <nav className="space-y-5">
          {navLinks.map((link, i) => (
            <div
              key={link.label}
              className={`anim-fade-up ${mobileOpen ? "" : "opacity-0"}`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <Link
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-display text-3xl uppercase tracking-tight"
                style={{ color: "var(--fg)" }}
              >
                {link.label}
              </Link>
            </div>
          ))}

          <div
            className={`anim-fade-up ${mobileOpen ? "" : "opacity-0"}`}
            style={{ animationDelay: "0.3s" }}
          >
            <Link
              href="/cart"
              onClick={() => setMobileOpen(false)}
              className="font-display text-6xl uppercase tracking-tight"
              style={{ color: "var(--accent)" }}
            >
              CART ({count})
            </Link>
          </div>
          <button>Login</button>
        </nav>
      </div>

      {/* TOAST */}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </>
  );
}
