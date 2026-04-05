"use client";

import * as React from "react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageItem, type Message } from "./message-item";

export function ChatLayout({ messages, isTyping }: { messages: Message[], isTyping?: boolean }) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever messages or typing state changes
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, isTyping]);

  return (
    /* Use h-full and min-h-0 to ensure ScrollArea fills the space but respects its container for scrolling */
    <ScrollArea className="flex-1 w-full bg-surface min-h-0 overflow-hidden">
      <div className="max-w-4xl mx-auto py-10 px-8 flex flex-col pb-32">
        {/* Optimized Header Space: High-end Editorial UI */}
        <div className="mb-14 mt-4 pl-4 lg:pl-[8.5rem] relative animate-in fade-in slide-in-from-bottom-8 duration-1000">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary pulse-dot" />
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-primary drop-shadow-[0_0_8px_rgba(83,8,231,0.5)]">System Online</span>
          </div>

          <h1 className="font-display text-5xl lg:text-7xl font-extrabold text-foreground leading-[0.95] tracking-tighter uppercase relative z-10">
            ASPIS<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary drop-shadow-lg inline-block mt-2">Intelligence</span><br />
            <span className="text-muted-foreground/30 font-light tracking-tight inline-block mt-2">Core</span>
          </h1>

          <div className="mt-8 flex items-start gap-4 max-w-md">
            <div className="w-1 min-h-[3.5rem] bg-gradient-to-b from-primary/50 to-transparent rounded-full flex-shrink-0" />
            <p className="font-sans text-sm lg:text-base text-muted-foreground leading-relaxed">
              <strong className="text-foreground inline-block mb-1 font-semibold text-xs tracking-widest uppercase">ASPIS Operator IA initialized.</strong><br/>
              Monitoring global network topology for high-level tactical threats. Ready for neural command.
            </p>
          </div>
          
          {/* Ambient Background Glow */}
          <div className="absolute top-10 left-[-4rem] lg:left-[4.5rem] w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10 pointer-events-none" />
        </div>

        {/* Message Container */}
        <div className="space-y-8 flex-1">
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
          
          {isTyping && (
            <div className="flex justify-start mb-8 animate-in fade-in duration-500">
               <div className="w-10 h-10 rounded-2xl flex items-center justify-center galactic-shadow shadow-lg shadow-primary/20 overflow-hidden bg-black/5 mr-5 flex-shrink-0 mt-1">
                 <Image src="/logo.png" alt="ASPIS" width={40} height={40} className="w-full h-full object-contain opacity-70 animate-pulse" />
               </div>
               <div className="bg-white/40 backdrop-blur-3xl p-6 rounded-[1.25rem] flex flex-col gap-4 border border-white/10 w-full max-w-[75%] ghost-border relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-[shimmer_2s_infinite]" />
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full pulse-dot bg-primary" />
                    <span className="text-xs uppercase tracking-widest font-bold text-muted-foreground">ASPIS Core Processing</span>
                  </div>
                  <div className="space-y-3 mt-2">
                    <div className="w-3/4 h-3 bg-muted-foreground/10 rounded-md" />
                    <div className="w-1/2 h-3 bg-muted-foreground/10 rounded-md" />
                    <div className="w-5/6 h-3 bg-muted-foreground/10 rounded-md" />
                  </div>
                  <div className="mt-4 border border-white/5 rounded-xl p-4 bg-black/5 space-y-4">
                    <div className="w-1/3 h-4 bg-muted-foreground/15 rounded-md mb-2" />
                    <div className="flex gap-4">
                      <div className="w-1/4 h-3 bg-muted-foreground/10 rounded-md" />
                      <div className="w-1/4 h-3 bg-muted-foreground/10 rounded-md" />
                      <div className="w-1/4 h-3 bg-muted-foreground/10 rounded-md" />
                    </div>
                    <div className="w-full h-px bg-white/5 my-2" />
                    <div className="flex gap-4">
                      <div className="w-1/4 h-3 bg-muted-foreground/10 rounded-md" />
                      <div className="w-2/4 h-3 bg-muted-foreground/10 rounded-md" />
                    </div>
                  </div>
               </div>
            </div>
          )}
          
          {/* Dedicated Scroll Anchor */}
          <div ref={messagesEndRef} className="h-4 w-full" />
        </div>
      </div>
    </ScrollArea>
  );
}
