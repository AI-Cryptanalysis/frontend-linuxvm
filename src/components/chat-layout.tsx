"use client";

import * as React from "react";
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
               <div className="w-10 h-10 rounded-2xl bg-surface-container-high flex items-center justify-center mr-5">
                  <div className="w-1.5 h-1.5 pulse-dot" />
               </div>
               <div className="bg-white/50 backdrop-blur-md p-6 rounded-[1.25rem] text-muted-foreground text-sm font-sans italic flex items-center gap-3 border border-white/10">
                 <div className="w-24 h-2 bg-muted-foreground/10 rounded animate-pulse" />
                 ASPIS is synthesizing response...
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
