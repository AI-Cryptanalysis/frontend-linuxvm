"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ShieldCheck, AlertTriangle, User } from "lucide-react";

export type Message = {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: string;
  status?: "secure" | "warning" | "alert";
};

export function MessageItem({ message }: { message: Message }) {
  const isAI = message.role === "assistant";

  return (
    <div
      className={cn(
        "flex w-full gap-5 mb-10 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4",
        isAI ? "justify-start" : "justify-end pr-8"
      )}
    >
      {isAI && (
        <div className="flex-shrink-0 mt-1">
          <div className="w-10 h-10 rounded-2xl btn-luminous flex items-center justify-center galactic-shadow">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
        </div>
      )}

      <div className={cn(
        "flex flex-col gap-2 max-w-[70%]",
        !isAI && "items-end"
      )}>
        <div
          className={cn(
            "p-6 rounded-[1.25rem] relative transition-all duration-300",
            isAI 
              ? "bg-white/70 backdrop-blur-2xl galactic-shadow ghost-border border-t-white/20" 
              : "bg-surface-container-low text-foreground font-medium"
          )}
        >
          {isAI && message.status && (
            <div className={cn(
              "absolute -top-3 left-6 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5",
              message.status === "secure" ? "bg-tertiary/10 text-tertiary" : "bg-destructive/10 text-destructive"
            )}>
              {message.status === "secure" ? <ShieldCheck className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
              {message.status} MONITORING ACTIVE
            </div>
          )}
          
          <p className="font-sans text-base leading-relaxed tracking-tight">
            {message.content}
          </p>
        </div>

        <div className="flex items-center gap-3 px-2">
          <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-muted-foreground opacity-40">
            {message.timestamp} — {isAI ? "LUMINOUS_GUARDIAN_01" : "OPERATOR_01"}
          </span>
          {!isAI && (
            <div className="w-6 h-6 rounded-lg bg-surface-container-highest flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
