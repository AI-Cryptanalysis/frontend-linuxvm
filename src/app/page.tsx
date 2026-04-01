"use client";

import * as React from "react";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { ChatLayout } from "@/components/chat-layout";
import { ChatInput } from "@/components/chat-input";
import { type Message } from "@/components/message-item";

export default function Home() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isTyping, setIsTyping] = React.useState(false);

  React.useEffect(() => {
    const initialMessage: Message = {
      id: "1",
      role: "assistant",
      content: "LUMINOUS_GUARDIAN_INITIALIZED: Digital realm integrity check complete. I am your specialized security analyst and protector.\nI am now monitoring your systems. You can ask me to run a scan or explain technical risks at any time.",
      timestamp: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      status: "secure",
    };
    setMessages([initialMessage]);
  }, []);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Connect to the backend from env vars
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "assistant/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: content }),
      });

      if (!response.ok) {
        throw new Error("Luminous Guardian Brain is temporarily offline.");
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "No data received from Guardian.",
        timestamp: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        status: "secure",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `ALERT: ${error instanceof Error ? error.message : "System communication failure."}`,
        timestamp: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        status: "warning",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <LayoutWrapper>
      <div className="flex flex-col h-full w-full min-h-0 overflow-hidden relative">
        <ChatLayout messages={messages} isTyping={isTyping} />
        <ChatInput onSend={handleSendMessage} disabled={isTyping} />
      </div>
    </LayoutWrapper>
  );
}
