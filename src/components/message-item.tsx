"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ShieldCheck, AlertTriangle, User, Activity, Flame, ShieldAlert, Terminal as TerminalIcon, Copy, Check } from "lucide-react";

export type Message = {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: string;
  status?: "secure" | "warning" | "alert";
};

function TerminalCodeBlock({ children, inline, className, ...props }: any) {
  const [copied, setCopied] = React.useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const isTerminal = !inline;

  if (!isTerminal) {
    return <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs font-mono text-primary" {...props}>{children}</code>;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0f] shadow-lg shadow-black/40 group relative">
      <div className="flex items-center justify-between bg-white/5 px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mr-8">Shell_Output</span>
        </div>
      </div>
      <button 
        onClick={handleCopy}
        className="absolute top-2 right-4 p-1.5 rounded-md bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
      <pre className="p-4 text-[12px] leading-relaxed font-mono whitespace-pre-wrap overflow-x-auto text-[#33ff99]/80 custom-scrollbar">
        <code {...props}>{children}</code>
      </pre>
    </div>
  );
}

export function MessageItem({ message }: { message: Message }) {
  const isAI = message.role === "assistant";

  // Helper to parse tactical sections
  const renderContent = (content: string) => {
    if (!isAI) return <p className="font-sans text-[15px] font-medium leading-relaxed text-foreground/90">{content}</p>;

    return (
      <div className="text-[15px] font-medium text-foreground/90 leading-relaxed tracking-wide space-y-4">
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
              <div className="text-xs italic text-muted-foreground opacity-60 my-2 font-sans flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse flex-shrink-0" />
                 <span {...props}>{children}</span>
              </div>
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
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center galactic-shadow shadow-lg shadow-primary/20 overflow-hidden bg-black/5">
            <Image src="/logo.png" alt="ASPIS" width={40} height={40} className="w-full h-full object-contain" />
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
          {message.timestamp} — {isAI ? "ASPIS_OPS_V2" : "OPERATOR_01"}
        </div>
      </div>
    </div>
  );
}
