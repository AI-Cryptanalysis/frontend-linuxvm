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
        {/* Optimized Header Space: Reduced margins even further */}
        <div className="mb-12 mt-2 pl-4 lg:pl-[8.5rem]">
          <h1 className="font-display text-4xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight">
            Spectral<br />Intelligence<br />Interface
          </h1>
          <p className="mt-4 font-sans text-sm lg:text-base text-muted-foreground max-w-sm leading-relaxed opacity-60">
            Neural connectivity stabilized. Monitoring high-energy security signatures.
          </p>
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
                 Luminous Guardian is synthesizing response...
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
