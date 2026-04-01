"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ShieldCheck, Activity, ShieldAlert } from "lucide-react";

export type Message = {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: string;
  status?: "secure" | "warning" | "alert";
};

export function MessageItem({ message }: { message: Message }) {
  const isAI = message.role === "assistant";

  // Helper to parse tactical sections
  const renderContent = (content: string) => {
    if (!isAI) return <p className="font-sans text-base leading-relaxed">{content}</p>;

    const sections = content.split(/\*\*(.*?)\*\*/g);
    return sections.map((part, i) => {
      // Tactical Score HUD
      if (part === "SECURITY_SCORE") {
        const scoreMatch = sections[i + 1]?.match(/\d+/);
        const score = scoreMatch ? parseInt(scoreMatch[0]) : 100;
        return (
          <div key={i} className="my-4 p-4 rounded-xl bg-surface-container-highest border border-white/10 flex items-center gap-4 galactic-shadow">
            <div className="relative w-16 h-16 flex items-center justify-center">
               <svg className="w-full h-full transform -rotate-90">
                 <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                 <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" 
                         strokeDasharray={175} strokeDashoffset={175 - (175 * score) / 100}
                         className={cn(score > 70 ? "text-tertiary" : score > 40 ? "text-warning" : "text-destructive")} />
               </svg>
               <span className="absolute text-sm font-bold">{score}</span>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-50">Global Integrity Score</h4>
              <p className="text-lg font-bold tracking-tighter">SURVEILLANCE_STATUS_OK</p>
            </div>
          </div>
        );
      }

      // Vulnerability Table HUD
      if (part === "VULNERABILITIES") {
        return <div key={i} className="mt-4 mb-2 text-xs font-bold uppercase tracking-widest text-destructive flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Tactical Threat List</div>;
      }

      // Bold sections
      if (i % 2 !== 0) {
        return <span key={i} className="font-bold text-foreground/90 block mt-4 mb-1 uppercase tracking-wider text-[11px]">{part}</span>;
      }

      // Normal text and tables (very basic split)
      if (part.includes("|")) {
        const rows = part.split("\n").filter(r => r.includes("|") && !r.includes("---"));
        return (
          <div key={i} className="overflow-x-auto my-4 rounded-lg border border-white/5 bg-black/5">
            <table className="w-full text-left text-xs">
              <tbody className="divide-y divide-white/5">
                {rows.map((row, ri) => (
                  <tr key={ri} className="hover:bg-white/5 transition-colors">
                    {row.split("|").filter(c => c.trim()).map((cell, ci) => (
                      <td key={ci} className="p-3 opacity-80">{cell.trim()}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      return <span key={i} className="opacity-80 block mb-2">{part}</span>;
    });
  };

  return (
    <div className={cn("flex w-full gap-5 mb-10 transition-all duration-500 animate-in fade-in", isAI ? "justify-start" : "justify-end pr-8")}>
      {isAI && (
        <div className="flex-shrink-0 mt-1">
          <div className="w-10 h-10 rounded-2xl btn-luminous flex items-center justify-center galactic-shadow">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
        </div>
      )}

      <div className={cn("flex flex-col gap-2 max-w-[75%]", !isAI && "items-end")}>
        <div className={cn("p-6 rounded-[1.25rem] relative transition-all duration-300", isAI ? "bg-white/70 backdrop-blur-2xl galactic-shadow ghost-border" : "bg-surface-container-low")}>
          {isAI && message.status && (
             <div className={cn("absolute -top-3 left-6 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5", message.status === "secure" ? "bg-tertiary/10 text-tertiary" : "bg-destructive/10 text-destructive")}>
               <Activity className="w-3 h-3 animate-pulse" /> {message.status} MONITORING ACTIVE
             </div>
          )}
          {renderContent(message.content)}
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-30 px-2">
          {message.timestamp} — {isAI ? "GUARDIAN_OPS_V2" : "OPERATOR_01"}
        </div>
      </div>
    </div>
  );
}
