'use client';

import * as React from 'react';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { ChatLayout } from '@/components/chat-layout';
import { ChatInput } from '@/components/chat-input';
import { type Message } from '@/components/message-item';
import { useScan } from '@/hooks/use-scan';

export default function Home() {
  // ── Chat history shown in the UI ───────────────────────────────────────────
  const [uiMessages, setUiMessages] = React.useState<Message[]>([]);

  // ── WebSocket hook — real-time streaming ───────────────────────────────────
  const { messages: streamMessages, isScanning, startScan } = useScan();

  // ── Initial greeting message ───────────────────────────────────────────────
  React.useEffect(() => {
    setUiMessages([
      {
        id: '1',
        role: 'assistant',
        content:
          'ASPIS_INITIALIZED: Digital realm integrity check complete. I am your specialized security analyst and protector.\nI am now monitoring your systems. You can ask me to run a scan or explain technical risks at any time.',
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        status: 'secure',
      },
    ]);
  }, []);

  // ── Convert stream messages → UI messages ─────────────────────────────────
  // We accumulate all streaming events into a single live assistant message.
  // When scan is complete the message is already built up token by token.
  React.useEffect(() => {
    if (streamMessages.length === 0) return;

    const ts = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    // Build a live assistant message from the stream
    // status → shown as italic prefix lines
    // tool   → shown in a monospace block
    // ai     → the main AI response text
    // error  → shown as warning

    let statusText = '';
    let toolText = '';
    let aiText = '';
    let hasError = false;
    let errorText = '';

    for (const msg of streamMessages) {
      if (msg.type === 'status') statusText += msg.text + '\n';
      if (msg.type === 'tool')   toolText += msg.text;
      if (msg.type === 'ai')     aiText += msg.text;
      if (msg.type === 'error') { hasError = true; errorText += msg.text; }
    }

    // Assemble into one formatted content string
    let content = '';
    if (statusText) content += `_${statusText.trim()}_\n\n`;
    if (toolText)   content += `\`\`\`\n${toolText.trim()}\n\`\`\`\n\n`;
    if (aiText)     content += aiText;
    if (hasError)   content = `ALERT: ${errorText}`;

    if (!content) return;

    // Replace or create the live streaming message (always id='stream-live')
    setUiMessages((prev) => {
      const withoutLive = prev.filter((m) => m.id !== 'stream-live');
      return [
        ...withoutLive,
        {
          id: 'stream-live',
          role: 'assistant',
          content,
          timestamp: ts,
          status: hasError ? 'warning' : 'secure',
        },
      ];
    });
  }, [streamMessages]);

  // ── User sends a message ──────────────────────────────────────────────────
  const handleSendMessage = (content: string) => {
    const ts = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    // Add user message immediately
    setUiMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: ts,
      },
    ]);

    // Fire the WebSocket scan — streaming events will update uiMessages above
    startScan(content);
  };

  return (
    <LayoutWrapper>
      <div className="flex flex-col h-full w-full min-h-0 overflow-hidden relative">
        <ChatLayout messages={uiMessages} isTyping={isScanning} />
        <ChatInput onSend={handleSendMessage} disabled={isScanning} />
      </div>
    </LayoutWrapper>
  );
}
