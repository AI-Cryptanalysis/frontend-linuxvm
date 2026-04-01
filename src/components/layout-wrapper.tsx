"use client";

import * as React from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { MobileNav } from "./mobile-nav";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // Sync collapsed state with desktop view
  React.useEffect(() => {
    if (!isDesktop) {
      setIsSidebarCollapsed(false);
    }
  }, [isDesktop]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-surface transition-colors duration-500">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full flex-shrink-0">
        <Sidebar 
          collapsed={isSidebarCollapsed} 
          setCollapsed={setIsSidebarCollapsed}
        />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0 border-none bg-transparent">
          <div className="h-full w-72">
            <Sidebar 
               collapsed={false} 
               setCollapsed={() => setIsMobileMenuOpen(false)} 
            />
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex flex-col flex-1 min-w-0 relative h-full">
        <Header 
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        <main className="flex-1 flex flex-col min-h-0 relative overflow-hidden h-full">
          {/* Ensure children can scroll independently */}
          <div className="flex-1 overflow-hidden flex flex-col h-full">
            {children}
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
