import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "accent" | "success" | "danger" | "warning";

const styles: Record<BadgeVariant, string> = {
  default: "border-[var(--border)] text-[var(--muted)]",
  accent:  "bg-[var(--accent)] text-[var(--bg)]",
  success: "bg-green-500/10 text-green-400 border-green-500/20",
  danger:  "bg-red-500/10 text-red-400 border-red-500/20",
  warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
};

export function Badge({ children, variant = "default" }: { children: string; variant?: BadgeVariant }) {
  return (
    <span className={cn("inline-block font-mono text-[9px] tracking-[0.2em] px-2 py-0.5 border", styles[variant])}>
      {children}
    </span>
  );
}