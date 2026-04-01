"use client";

import * as React from "react";
import { Search, Bell, User, Maximize2, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SecurityPulse } from "./security-pulse";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="h-20 bg-surface/60 backdrop-blur-xl border-b border-border/5 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-8 flex-1">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-primary hover:bg-primary/10"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="relative w-full max-w-sm group hidden sm:block font-sans">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            className="w-full bg-surface-container-lowest border-none pl-12 h-11 rounded-2xl font-sans text-sm placeholder:text-muted-foreground focus-visible:ring-primary/20 ghost-border transition-all" 
            placeholder="Search Intelligence Links..." 
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl relative hover:bg-surface-container-high">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-surface" />
          </Button>

          <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-surface-container-high hidden sm:flex">
            <Maximize2 className="w-5 h-5 text-muted-foreground" />
          </Button>
          
          <div className="w-[1.5px] h-8 bg-border/10 mx-2 hidden sm:block" />
          
          <div className="flex items-center gap-3 pl-2 group cursor-pointer">
            <div className="flex flex-col items-end justify-center hidden sm:flex">
              <span className="text-sm font-sans font-bold text-foreground group-hover:text-primary transition-colors">Admin_Nova</span>
              <SecurityPulse label="SECURE" className="h-5 px-2 bg-primary/5 border-none" />
            </div>
            <Avatar className="w-10 h-10 rounded-2xl border-2 border-surface-container-high galactic-shadow group-hover:scale-105 transition-transform duration-300">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback><User className="w-5 h-5" /></AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
