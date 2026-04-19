"use client";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
  className?: string;
  delay?: string;
  style?: React.CSSProperties;
}

export function AnimatedText({ children, className = "", delay = "0s", style }: Props) {
  return (
    <div className="overflow-hidden">
      <span
        className={cn("block anim-reveal-up", className)}
        style={{ animationDelay: delay, ...style }}
      >
        {children}
      </span>
    </div>
  );
}

export function FadeIn({ children, className = "", delay = "0s", style }: Props) {
  return (
    <div
      className={cn("anim-fade-up", className)}
      style={{ animationDelay: delay, ...style }}
    >
      {children}
    </div>
  );
}
