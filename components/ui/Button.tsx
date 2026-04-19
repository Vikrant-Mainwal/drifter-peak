"use client";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps {
  loading?: boolean;
  children: ReactNode;
  variant?: "primary" | "outline" | "accent" | "ghost";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  fullWidth?: boolean;
}

const variants = {
  primary: { background: "var(--fg)", color: "var(--bg)" },
  outline:  { background: "transparent", color: "var(--fg)", border: "1px solid var(--border)" },
  accent:   { background: "var(--accent)", color: "var(--bg)" },
  ghost:    { background: "transparent", color: "var(--muted)" },
};
const sizes = { sm: "px-5 py-2.5 text-sm", md: "px-8 py-4 text-base", lg: "px-12 py-5 text-xl" };

export function Button({ children, variant = "primary", size = "md", onClick, className, disabled, type = "button", fullWidth }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn("btn-press font-display tracking-[0.15em] uppercase disabled:opacity-40", sizes[size], fullWidth ? "w-full" : "", className)}
      style={variants[variant]}
    >
      {children}
    </button>
  );
}
