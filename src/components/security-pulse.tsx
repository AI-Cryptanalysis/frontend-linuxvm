"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SecurityPulseProps {
  label?: string;
  status?: "active" | "warning" | "alert";
  className?: string;
}

export function SecurityPulse({ label = "SECURE", status = "active", className }: SecurityPulseProps) {
  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high/50 border border-border/10 backdrop-blur-sm",
      className
    )}>
      <div className={cn(
        "w-1.5 h-1.5 rounded-full",
        status === "active" ? "bg-[#56ffa7] pulse-dot" : "bg-destructive"
      )} />
      <span className="text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-muted-foreground">
        SYSTEM_{label}
      </span>
    </div>
  );
}
