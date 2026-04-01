"use client";

import * as React from "react";
import { LayoutDashboard, MessageSquare, Plus, Activity, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="bg-surface-container-lowest/80 backdrop-blur-3xl border-t border-border/10 px-6 py-3 flex items-center justify-between shadow-[0_-8px_40px_-12px_rgba(83,8,231,0.12)]">
        <NavButton icon={LayoutDashboard} active />
        <NavButton icon={MessageSquare} />
        
        <div className="relative -top-8 transition-transform duration-500 hover:scale-105 active:scale-95">
          <button className="w-16 h-16 btn-luminous rounded-full flex items-center justify-center text-white shadow-xl shadow-primary/40 border-4 border-surface ring-1 ring-primary/20">
            <Plus className="w-8 h-8" />
          </button>
        </div>

        <NavButton icon={Activity} />
        <NavButton icon={User} />
      </div>
      {/* Safe Area Spacer for iOS/Modern Browsers */}
      <div className="bg-surface-container-lowest/80 backdrop-blur-3xl h-safe-bottom" />
    </nav>
  );
}

function NavButton({ icon: Icon, active }: { icon: any; active?: boolean }) {
  return (
    <button className={cn(
      "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 relative",
      active ? "text-primary bg-primary/5" : "text-muted-foreground hover:bg-surface-container-high"
    )}>
      <Icon className={cn("w-6 h-6", active && "drop-shadow-[0_0_8px_rgba(83,8,231,0.3)]")} />
      {active && (
        <span className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full pulse-dot" />
      )}
    </button>
  );
}
