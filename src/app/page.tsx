'use client';

import * as React from 'react';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { ChatLayout } from '@/components/chat-layout';
import { ChatInput } from '@/components/chat-input';
import { useScan } from '@/hooks/use-scan';

export default function Home() {
  // ── WebSocket hook — real-time streaming & UI message management ───────────
  const { 
    chatMessages, 
    status, 
    isScanning, 
    startScan, 
    clearMessages,
    pushUserMessage 
  } = useScan();

  // ── User sends a message ──────────────────────────────────────────────────
  const handleSendMessage = (content: string) => {
    // Fire the WebSocket scan via the hook's synchronized method
    pushUserMessage(content);
  };

  return (
    <LayoutWrapper>
      <div className="flex flex-col h-full w-full min-h-0 overflow-hidden relative">
        <ChatLayout messages={chatMessages} isTyping={isScanning} />
        <ChatInput onSend={handleSendMessage} disabled={isScanning} />
      </div>
    </LayoutWrapper>
  );
}
