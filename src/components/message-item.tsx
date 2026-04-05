"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Activity } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// ─── Sub-components ──────────────────────────────────────────────────────────

const TerminalCodeBlock = ({ node, inline, className, children, ...props }: any) => {
  const match = /language-(\w+)/.exec(className || "");
  return !inline ? (
    <div className="my-6 rounded-xl overflow-hidden border border-white/10 bg-[#020204] galactic-shadow group border-l-4 border-l-tertiary/50">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 group-hover:text-tertiary/80 transition-colors font-mono">
          SYSTEM_DECRYPTOR_v4.2 // STREAMING...
        </span>
      </div>
      <pre className="p-5 overflow-x-auto custom-scrollbar bg-black/40">
        <code className={cn("text-[13px] leading-relaxed font-mono text-[#00ff9d] drop-shadow-[0_0_8px_rgba(0,255,157,0.3)]", className)} {...props}>
          {children}
        </code>
      </pre>
    </div>
  ) : (
    <code className="px-1.5 py-0.5 rounded-md bg-tertiary/10 font-mono text-xs text-tertiary border border-tertiary/20" {...props}>
      {children}
    </code>
  );
};

export type Message = {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: string;
  status?: "secure" | "warning" | "alert";
};

export function MessageItem({ message }: { message: Message }) {
  const isAI = message.role === "assistant";

  const renderContent = (content: string) => {
    if (!isAI) return <p className="font-sans text-base leading-relaxed font-medium">{content}</p>;

    return (
      <div className="text-[15px] font-semibold text-foreground/90 leading-relaxed tracking-wide space-y-4">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            table: ({ node, ...props }) => (
              <div className="overflow-x-auto my-6 rounded-xl border border-white/5 bg-black/5 custom-scrollbar">
                <table className="w-full text-left text-sm" {...props} />
              </div>
            ),
            thead: ({ node, ...props }) => <thead className="bg-white/5" {...props} />,
            th: ({ node, ...props }) => <th className="p-4 font-bold border-b border-white/10" {...props} />,
            td: ({ node, ...props }) => <td className="p-4 opacity-80 border-b border-white/5" {...props} />,
            strong: ({ node, ...props }) => <strong className="font-bold text-foreground" {...props} />,
            em: ({ node, children, ...props }) => (
              <span className="text-xs italic text-muted-foreground opacity-60 my-2 font-sans inline-flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse flex-shrink-0" />
                 <span {...props}>{children}</span>
              </span>
            ),
            code: TerminalCodeBlock
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div className={cn("flex w-full gap-5 mb-10 transition-all duration-500 animate-in fade-in", isAI ? "justify-start" : "justify-end pr-8")}>
      {isAI && (
        <div className="flex-shrink-0 mt-1">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center galactic-shadow shadow-lg shadow-primary/20 overflow-hidden bg-white/10 backdrop-blur-md border border-white/10">
            <Image src="/logo.png" alt="ASPIS" width={40} height={40} className="w-full h-full object-contain" />
          </div>
        </div>
      )}

      <div className={cn("flex flex-col gap-2 transition-all duration-300 w-fit", isAI ? "max-w-[92%] mr-auto" : "max-w-[85%] ml-auto items-end")}>
        <div className={cn("p-6 rounded-[1.25rem] relative shadow-sm transition-all duration-300", isAI ? "bg-white/70 backdrop-blur-2xl galactic-shadow ghost-border" : "bg-surface-container-low/80 backdrop-blur-md border border-border/5")}>
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
