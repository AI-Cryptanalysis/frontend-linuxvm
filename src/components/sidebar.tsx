"use client";

import * as React from "react";
import Image from "next/image";
import { 
  Shield, 
  LayoutDashboard, 
  MessageSquare, 
  Settings, 
  Activity, 
  ChevronLeft, 
  ChevronRight,
  Terminal,
  Grid,
  Plus,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: "Neural Overview", active: true },
  { icon: MessageSquare, label: "Tethered Streams", count: 3 },
  { icon: Grid, label: "Synapse Nodes" },
  { icon: Activity, label: "Aetheric Monitor" },
  { icon: Terminal, label: "Command Core" },
];

const RECENT_CHATS = [
  { id: "1", title: "Spectral Analysis #42", time: "2h ago" },
  { id: "2", title: "Neural Link Calibration", time: "5h ago" },
  { id: "3", title: "Aether Flux Debugging", time: "Yesterday" },
  { id: "4", title: "Ghost Protocol Audit", time: "Mar 28" },
];

const SECONDARY_ITEMS = [
  { icon: Settings, label: "Neural Config" },
  { icon: Shield, label: "Security Vault" },
];

export function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (val: boolean) => void }) {
  return (
    <aside
      className={cn(
        "h-screen bg-surface-container-low transition-all duration-500 ease-in-out flex flex-col relative border-r border-border/5",
        collapsed ? "w-20" : "w-72"
      )}
    >
      <div className="p-6 flex items-center gap-3 flex-shrink-0">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 overflow-hidden">
          <Image src="/logo.png" alt="ASPIS" width={40} height={40} className="w-full h-full object-contain" />
        </div>
        {!collapsed && (
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            ASPIS
          </span>
        )}
      </div>

      <div className="px-5 mb-4 flex-shrink-0">
        <Button 
          className={cn(
            "w-full btn-luminous rounded-2xl h-14 flex items-center justify-center gap-3 text-white font-bold tracking-widest text-xs galactic-shadow transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]",
            collapsed ? "w-10 h-10 px-0 rounded-xl mx-auto" : "px-6"
          )}
        >
          <Plus className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>NEW SCAN</span>}
        </Button>
      </div>

      {/* Scrollable Navigation Area */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {SIDEBAR_ITEMS.map((item, index) => (
          <button
            key={index}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative",
              item.active 
                ? "bg-surface-container-lowest text-primary galactic-shadow" 
                : "text-muted-foreground hover:bg-surface-container-high hover:text-foreground"
            )}
          >
            <item.icon className={cn("w-5 h-5", item.active ? "text-primary" : "text-muted-foreground")} />
            {!collapsed && (
              <>
                <span className="font-sans font-medium text-sm">{item.label}</span>
                {item.active && (
                  <div className="absolute right-4 w-1.5 h-1.5 bg-[#56ffa7] pulse-dot rounded-full" />
                )}
                {item.count && (
                  <span className="ml-auto bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {item.count}
                  </span>
                )}
              </>
            )}
          </button>
        ))}
        
        {!collapsed && (
          <div className="pt-6 pb-2 px-4 transition-opacity duration-300">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-muted-foreground">Recent Intelligence</span>
            </div>
            <div className="space-y-1">
              {RECENT_CHATS.map((chat) => (
                <button
                  key={chat.id}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-sans text-muted-foreground hover:bg-surface-container-high hover:text-foreground transition-all duration-300 truncate group"
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity mr-2 text-primary">›</span>
                  {chat.title}
                </button>
              ))}
            </div>
          </div>
        )}

        <Separator className="my-6 bg-border/5 mx-2" />

        {SECONDARY_ITEMS.map((item, index) => (
          <button
            key={index}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
              "text-muted-foreground hover:bg-surface-container-high hover:text-foreground"
            )}
          >
            <item.icon className="w-5 h-5 text-muted-foreground" />
            {!collapsed && <span className="font-sans font-medium text-sm">{item.label}</span>}
          </button>
        ))}
      </nav>

      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-surface-container-lowest border border-border/10 shadow-lg hover:bg-surface-container-high z-50 flex-shrink-0"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </Button>
    </aside>
  );
}
