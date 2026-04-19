"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ADMIN_SIDEBAR_MENU } from "@/types/admin.types";
import {
  LayoutDashboard, Package, ShoppingBag,
  Users, LucideIcon, X, Store
} from "lucide-react";

// Icon map — add icons here as you add menu items
const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard, Package, ShoppingBag, Users,
};

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        // Mobile: fixed + slide in/out
        "fixed inset-y-0 left-0 z-50 w-56 flex flex-col transition-transform duration-300",
        // Desktop: always visible
        "md:static md:translate-x-0 md:z-auto",
        open ? "translate-x-0" : "-translate-x-full"
      )}
      style={{ background: "var(--card)", borderRight: "1px solid var(--border)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b"
        style={{ borderColor: "var(--border)" }}>
        <Link href="/" className="flex items-center gap-1">
          <p className="font-display text-xl tracking-[0.12em]" style={{ color: "var(--fg)" }}>
            DRIFTER<span style={{ color: "var(--accent)" }}>.</span>PEAK
          </p>
          <p className="font-mono text-[9px] tracking-[0.3em] mt-0.5" style={{ color: "var(--accent)" }}>
            ADMIN
          </p>
        </Link>
        {/* Close button — mobile only */}
        <button onClick={onClose} className="md:hidden opacity-50 hover:opacity-100"
          style={{ color: "var(--fg)" }}>
          <X size={16} />
        </button>
      </div>

      {/* Navigatio */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {ADMIN_SIDEBAR_MENU.map(item => {
          const Icon = ICONS[item.icon];
          const active = item.path === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.path);

          return (
            <Link key={item.path} href={item.path}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 font-mono text-[10px] tracking-[0.2em] transition-all duration-150",
                active
                  ? "text-[var(--bg)]"
                  : "text-[var(--muted)] hover:text-[var(--fg)]"
              )}
              style={{ background: active ? "var(--accent)" : "transparent" }}
            >
              {Icon && <Icon size={13} />}
              {item.name.toUpperCase()}
              {item.badge !== undefined && (
                <span className="ml-auto font-mono text-[9px] px-1.5 py-0.5 rounded-full"
                  style={{ background: active ? "rgba(0,0,0,0.2)" : "var(--accent)", color: active ? "inherit" : "var(--bg)" }}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom — store link */}
      <div className="px-3 py-4 border-t" style={{ borderColor: "var(--border)" }}>
        <Link href="/"
          className="flex items-center gap-3 px-3 py-2.5 font-mono text-[10px] tracking-[0.2em] hover:opacity-70 transition-opacity"
          style={{ color: "var(--muted)" }}>
          <Store size={13} /> VIEW STORE
        </Link>
      </div>
    </aside>
  );
}