import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
}

const paddings = { sm: "p-4", md: "p-6", lg: "p-8" };

export function Card({ children, className, padding = "md" }: CardProps) {
  return (
    <div className={cn("border", paddings[padding], className)}
      style={{ borderColor: "var(--border)", background: "var(--card)" }}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center justify-between mb-6", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display text-2xl uppercase tracking-wide" style={{ color: "var(--fg)" }}>
      {children}
    </h2>
  );
}