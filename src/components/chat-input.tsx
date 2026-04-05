"use client";

import * as React from "react";
import { Send, Plus, Command, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ChatInput({ onSend, onStop, disabled }: { onSend: (content: string) => void, onStop?: () => void, disabled?: boolean }) {
  const [input, setInput] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  return (
    <div className="p-8 pb-12 w-full max-w-5xl mx-auto sticky bottom-0 z-40">
      <form 
        onSubmit={handleSubmit}
        className="relative flex items-center gap-3 bg-surface-container-lowest/80 backdrop-blur-3xl rounded-[2rem] p-3 galactic-shadow ghost-border group focus-within:shadow-primary/5 transition-all duration-500"
      >
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          className="w-12 h-12 rounded-full text-muted-foreground hover:bg-surface-container-high hover:text-primary transition-all"
        >
          <Plus className="w-6 h-6" />
        </Button>

        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={handleInput}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Initiate Neural Command..."
          className="flex-1 bg-transparent border-none outline-none resize-none py-3 font-sans text-[15px] placeholder:text-muted-foreground placeholder:font-light max-h-[200px] custom-scrollbar overflow-y-auto"
          disabled={disabled}
        />

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high text-muted-foreground">
            <Command className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Neural_Lnk</span>
          </div>
          
          {disabled ? (
            <Button 
              type="button" 
              onClick={(e) => {
                e.preventDefault();
                if (onStop) onStop();
              }}
              className="w-12 h-12 rounded-full transition-all duration-500 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white"
            >
              <Square className="w-4 h-4 fill-current" />
            </Button>
          ) : (
            <Button 
              type="submit" 
              disabled={!input.trim()}
              className={cn(
                "w-12 h-12 rounded-full transition-all duration-500",
                input.trim() ? "btn-luminous shadow-lg shadow-primary/30 text-white" : "bg-surface-container-high text-muted-foreground"
              )}
            >
              <Send className="w-5 h-5" />
            </Button>
          )}
        </div>
      </form>
      
      <div className="mt-4 flex justify-center items-center gap-8 text-[10px] font-sans font-bold uppercase tracking-widest text-muted-foreground/30">
        <span className="flex items-center gap-2 italic">Aetheric core status: stable</span>
        <span className="w-1.5 h-1.5 rounded-full bg-primary/20" />
        <span className="flex items-center gap-2">Protocol: ASPIS_v4.5</span>
      </div>
    </div>
  );
}
