"use client";
import { usePathname } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { useRouter } from "next/navigation";
import { ADMIN_SIDEBAR_MENU } from "@/types/admin.types";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const pathname  = usePathname();
  const { user, logout } = useUserRole();
  const router    = useRouter();

  // Derive page title from menu config — no hardcoding
  const current   = ADMIN_SIDEBAR_MENU.find(item =>
    item.path === "/admin" ? pathname === "/admin" : pathname.startsWith(item.path)
  );
  const pageTitle = current?.name ?? "Dashboard";

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
      style={{ borderColor: "var(--border)", background: "var(--bg)" }}>
      <div className="flex items-center gap-4">
        {/* Hamburger — mobile only */}
        <button onClick={onMenuClick} className="md:hidden opacity-60 hover:opacity-100 transition-opacity"
          style={{ color: "var(--fg)" }}>
          <Menu size={18} />
        </button>
        <h4 className="font-display text-2xl md:text-3xl uppercase tracking-wide"
          style={{ color: "var(--fg)" }}>
          {pageTitle}
        </h4>
      </div>

      <div className="flex items-center gap-4">
        {/* User info */}
        <div className="hidden md:block text-right">
          <p className="font-mono text-[9px] tracking-[0.2em]" style={{ color: "var(--muted)" }}>ADMIN</p>
          <p className="font-mono text-[10px]" style={{ color: "var(--fg)" }}>{user?.email}</p>
        </div>
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full border flex items-center justify-center font-mono text-xs"
          style={{ borderColor: "var(--accent)", background: "rgba(232,255,0,0.08)", color: "var(--accent)" }}>
          {user?.email?.[0]?.toUpperCase()}
        </div>
        {/* Logout */}
        <button onClick={handleLogout}
          className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] opacity-50 hover:opacity-100 transition-opacity"
          style={{ color: "var(--fg)" }}>
          <LogOut size={13} />
          <span className="hidden md:inline">LOGOUT</span>
        </button>
      </div>
    </header>
  );
}