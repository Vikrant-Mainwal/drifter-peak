"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Menu,
  X,
  Search,
  User,
  Heart,
  // Plus,
  // Minus,
  Mountain,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/ui/Toast";
import { CartIcon } from "@/features/cart/components/cart/CartIcon";
import { useCartStore } from "../../features/cart/lib/store/cartStore";

export const navLinks = [
  // { label: "Shop", href: "/shop" },
  { label: "Men", href: "/shop" },
  { label: "Women", href: "/shop" },
  { label: "Accessories", href: "/shop" },
];

export function Navbar() {
  const router = useRouter();

  const { user, profile, isLoggedIn, loading, signOut } = useAuth();
  const { toasts, show, dismiss } = useToast();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    await signOut();
    setUserMenuOpen(false);
    setMobileOpen(false);
    show("Signed out successfully", "info");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
    setSearchOpen(false);
    setMobileOpen(false);
  };

  useEffect(() => {
    if (mobileOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [mobileOpen]);

  return (
    <>
      <header className="navbar sticky top-0 left-0 right-0 z-50 bg-white border-b border-gray-300">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-16 md:h-20 flex items-center justify-between gap-6">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            {/* <Mountain size={scrolled ? 20 : 24} style={{ color: "var(--fg)" }} /> */}
            <div
              className="font-display uppercase tracking-[0.15em] text-2xl md:text-3xl"
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
                className="font-mono text-sm tracking-[0.25em] hover-line transition-colors duration-200"
                style={{ color: "var(--muted)" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* SEARCH full length */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center flex-1 max-w-xs border px-3 py-1.5 rounded-md"
            style={{ borderColor: "var(--border)" }}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 text-sm outline-none bg-transparent"
              style={{ color: "var(--fg)" }}
            />
            <button type="submit" aria-label="Search">
              <Search size={14} style={{ color: "var(--muted)" }} />
            </button>
          </form>

          {/* ACTIONS */}
          <div className="flex items-center gap-5 shrink-0">
            {/* SEARCH ICON (scrolled state, desktop) */}
            {/* <button
              className="hidden md:block"
              onClick={() => setSearchOpen((o) => !o)}
              aria-label="Search"
              style={{ color: "var(--fg)" }}
            >
              <Search size={18} />
            </button> */}

            {/* AUTH ICON (desktop) */}
            {!loading && (
              <div className="relative hidden md:block">
                <button
                  onClick={() =>
                    isLoggedIn
                      ? setUserMenuOpen((o) => !o)
                      : router.push("/login")
                  }
                  aria-label="Account"
                >
                  {isLoggedIn ? (
                    <div
                      className="w-6 h-6 rounded-full border flex items-center justify-center text-[10px]"
                      style={{
                        borderColor: "var(--border)",
                        color: "var(--fg)",
                      }}
                    >
                      {(
                        profile?.name?.[0] ??
                        user?.phone?.[0] ??
                        user?.email?.[0] ??
                        "?"
                      ).toUpperCase()}
                    </div>
                  ) : (
                    <User size={18} style={{ color: "var(--fg)" }} />
                  )}
                </button>

                {userMenuOpen && isLoggedIn && (
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
                        onClick={() => setUserMenuOpen(false)}
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
            )}

            {/* WISHLIST */}
            <Link
              href="/wishlist"
              className="hidden md:block"
              aria-label="Wishlist"
            >
              <Heart size={18} style={{ color: "var(--fg)" }} />
            </Link>

            <CartIcon />

            {/* MOBILE MENU TOGGLE */}
            <button
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ color: "var(--fg)" }}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* SEARCH bar*/}
        {/* {searchOpen && (
          <div
            className="hidden md:block border-t"
            style={{ borderColor: "var(--border)" }}
          >
            <form
              onSubmit={handleSearchSubmit}
              className="max-w-[1600px] mx-auto px-12 py-3 flex items-center gap-3"
            >
              <Search size={16} style={{ color: "var(--muted)" }} />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 text-sm outline-none bg-transparent"
                style={{ color: "var(--fg)" }}
              />
            </form>
          </div>
        )} */}
      </header>

      {/* MOBILE SIDE PANEL */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-200 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* backdrop */}
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />

        {/* panel */}
        <div
          className={`absolute top-0 left-0 h-full w-[85%] max-w-sm bg-white flex flex-col transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div
            className="flex items-center justify-between px-5 h-16 border-b"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex items-center gap-2">
              <Mountain size={18} style={{ color: "var(--fg)" }} />
              <span
                className="font-display text-lg uppercase tracking-[0.1em]"
                style={{ color: "var(--fg)" }}
              >
                Drifter Peak
              </span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} style={{ color: "var(--fg)" }} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
            {navLinks.map((link) => {
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 text-base border-b"
                  style={{ color: "var(--fg)", borderColor: "var(--border)" }}
                >
                  {link.label}
                </Link>
              );
            })}

            <Link
              href="/wishlist"
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-base border-b"
              style={{ color: "var(--fg)", borderColor: "var(--border)" }}
            >
              Favorites
            </Link>

            {isLoggedIn && (
              <Link
                href="/orders"
                onClick={() => setMobileOpen(false)}
                className="block py-3 text-base border-b"
                style={{ color: "var(--fg)", borderColor: "var(--border)" }}
              >
                Orders
              </Link>
            )}
          </nav>

          {/* bottom bar */}
          <div
            className="border-t p-3 mx-2"
            style={{ borderColor: "var(--border)" }}
          >
            {!loading &&
              (isLoggedIn ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-8 h-8 rounded-full border flex items-center justify-center text-xs shrink-0"
                      style={{
                        borderColor: "var(--border)",
                        color: "var(--fg)",
                      }}
                    >
                      {(
                        profile?.name?.[0] ??
                        user?.phone?.[0] ??
                        user?.email?.[0] ??
                        "?"
                      ).toUpperCase()}
                    </div>
                    <p
                      className="text-sm truncate"
                      style={{ color: "var(--fg)" }}
                    >
                      {profile?.name ?? user?.phone ?? user?.email ?? "Account"}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    aria-label="Logout"
                    className="shrink-0"
                  >
                    <LogOut size={18} style={{ color: "var(--fg)" }} />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block p-3 text-base text-center text-white rounded-md"
                  style={{ background: "var(--muted)" }}
                >
                  Login
                </Link>
              ))}
          </div>

          {/* mobile search bar */}
          {searchOpen && (
            <form
              onSubmit={handleSearchSubmit}
              className="px-5 pb-4 flex items-center gap-2 border-t pt-3"
              style={{ borderColor: "var(--border)" }}
            >
              <Search size={16} style={{ color: "var(--muted)" }} />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 text-sm outline-none bg-transparent"
                style={{ color: "var(--fg)" }}
              />
            </form>
          )}
        </div>
      </div>

      {/* TOAST */}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </>
  );
}
