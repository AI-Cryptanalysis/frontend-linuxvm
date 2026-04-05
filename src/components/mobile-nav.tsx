"use client";

import * as React from "react";
import { LayoutDashboard, MessageSquare, Plus, Activity, User, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const RECENT_CHATS = [
  { id: "1", title: "Spectral Analysis #42", time: "2h ago" },
  { id: "2", title: "Neural Link Calibration", time: "5h ago" },
  { id: "3", title: "Aether Flux Debugging", time: "Yesterday" },
  { id: "4", title: "Ghost Protocol Audit", time: "Mar 28" },
];

export function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="bg-surface-container-lowest/80 backdrop-blur-3xl border-t border-border/10 px-6 py-3 flex items-center justify-between shadow-[0_-8px_40px_-12px_rgba(83,8,231,0.12)]">
        <NavButton icon={LayoutDashboard} active />
        
        <Sheet>
          <SheetTrigger className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 relative outline-none",
            "text-muted-foreground hover:bg-surface-container-high"
          )}>
            <MessageSquare className="w-6 h-6" />
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[65vh] rounded-t-3xl bg-surface-container-low/95 backdrop-blur-3xl border-t border-white/10 p-6 flex flex-col z-[100] outline-none">
            <SheetHeader className="mb-6 border-b border-border/5 pb-4">
              <SheetTitle className="flex items-center gap-2 text-muted-foreground font-display text-sm tracking-widest uppercase">
                <Clock className="w-4 h-4 text-primary" />
                Recent Intelligence
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2 pb-6">
              {RECENT_CHATS.map((chat) => (
                <button
                  key={chat.id}
                  className="w-full text-left px-5 py-4 rounded-xl text-sm font-sans bg-surface-container-lowest border border-white/5 shadow-sm text-foreground hover:bg-surface-container hover:border-primary/20 transition-all flex justify-between items-center group cursor-pointer"
                >
                  <span className="truncate flex-1 font-medium">{chat.title}</span>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground opacity-50 ml-4 group-hover:text-primary transition-colors">{chat.time}</span>
                </button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
        
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

const NavButton = React.forwardRef<HTMLButtonElement, { icon: any; active?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ icon: Icon, active, className, ...props }, ref) => {
    return (
      <button ref={ref} {...props} className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 relative outline-none",
        active ? "text-primary bg-primary/5" : "text-muted-foreground hover:bg-surface-container-high",
        className
      )}>
        <Icon className={cn("w-6 h-6", active && "drop-shadow-[0_0_8px_rgba(83,8,231,0.3)]")} />
        {active && (
          <span className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full pulse-dot" />
        )}
      </button>
    );
  }
);
NavButton.displayName = "NavButton";
