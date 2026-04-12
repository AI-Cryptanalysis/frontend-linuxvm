"use client";

import * as React from "react";
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
  Clock,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";

export interface ChatSession {
  _id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: "Neural Overview", active: true },
  { icon: MessageSquare, label: "Tethered Streams", count: 3 },
  { icon: Grid, label: "Synapse Nodes" },
  { icon: Activity, label: "Aetheric Monitor" },
  { icon: Terminal, label: "Command Core" },
];

const SECONDARY_ITEMS = [
  { icon: Settings, label: "Neural Config" },
  { icon: Shield, label: "Security Vault" },
];

export function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (val: boolean) => void }) {
  const [sessions, setSessions] = React.useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const searchParams = useSearchParams();
  const activeSession = searchParams.get('session');

  const fetchSessions = React.useCallback(async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.warn("[Sidebar] No access token found in localStorage");
        setIsLoading(false);
        return;
      }
      
      const res = await fetch("http://localhost:5070/chat/sessions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        console.error(`[Sidebar] API Error: ${res.status} ${res.statusText}`);
        setIsLoading(false);
        return;
      }

      const data = await res.json();
      console.log(`[Sidebar] Fetched ${data?.length || 0} sessions from backend`);
      
      if (Array.isArray(data)) {
        setSessions(data as ChatSession[]);
      }
    } catch (e) {
      console.error("[Sidebar] Fetch failed", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchSessions();
  }, [fetchSessions, searchParams]);

  const handleDeleteSession = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this intelligence report?")) return;

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`http://localhost:5070/chat/sessions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setSessions((prev: ChatSession[]) => prev.filter((s: ChatSession) => s._id !== id));
        if (activeSession === id) {
          window.location.href = "/";
        }
      }
    } catch (e) {
      console.error("Failed to delete session", e);
    }
  };

  return (
    <aside
      className={cn(
        "h-screen bg-surface-container-low transition-all duration-500 ease-in-out flex flex-col relative border-r border-border/5",
        collapsed ? "w-20" : "w-72"
      )}
    >
      <div className="p-6 flex items-center gap-3 flex-shrink-0">
        <div className="w-10 h-10 overflow-hidden rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 bg-surface-container-high border border-white/5">
          <img src="/logo.png" alt="ASPIS Logo" className="w-full h-full object-contain p-1" />
        </div>
        {!collapsed && (
          <span className="font-display text-2xl font-bold tracking-tighter text-foreground uppercase italic leading-none">
            ASP<span className="text-primary">IS</span>
          </span>
        )}
      </div>

      <div className="px-5 mb-4 flex-shrink-0">
        <Button 
          onClick={() => window.location.href = "/"}
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
              {isLoading ? (
                <div className="px-3 py-2 text-xs text-muted-foreground animate-pulse">Synchronizing neural links...</div>
              ) : sessions.length === 0 ? (
                <div className="px-3 py-2 text-[10px] text-muted-foreground italic opacity-50">No recent intelligence found</div>
              ) : (
                sessions.map((chat) => (
                  <div key={chat._id} className="group flex items-center relative">
                    <button
                      onClick={() => window.location.href = `/?session=${chat._id}`}
                      className={cn(
                        "flex-1 text-left px-3 py-2 rounded-lg text-xs font-sans transition-all duration-300 truncate border border-transparent flex items-center",
                        activeSession === chat._id 
                          ? "bg-surface-container-high text-foreground border-white/5 shadow-sm"
                          : "text-muted-foreground hover:bg-surface-container-high hover:text-foreground"
                      )}
                    >
                      <span className={cn(
                        "mr-2 text-primary transition-opacity",
                        activeSession === chat._id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      )}>›</span>
                      <span className="truncate">{chat.title}</span>
                    </button>
                    <button
                      onClick={(e) => handleDeleteSession(e, chat._id)}
                      className="absolute right-2 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-md transition-all duration-200"
                      title="Delete Intelligence Report"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
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
