'use client';

import * as React from "react";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { ChatLayout } from "@/components/chat-layout";
import { ChatInput } from "@/components/chat-input";
import { type Message } from "@/components/message-item";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";

export default function Home() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isTyping, setIsTyping] = React.useState(false);

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  React.useEffect(() => {
    if (!isAuthenticated) return;

    const loadHistory = async () => {
      try {
        const history = await fetchApi<any[]>("/chat/history");
        if (history && history.length > 0) {
          const formattedHistory: Message[] = history.map((msg: any) => ({
            id: msg._id,
            role: msg.role,
            content: msg.message,
            timestamp: new Date(msg.createdAt).toLocaleTimeString("en-US", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
            }),
            status: msg.role === "assistant" ? "secure" : undefined,
          }));
          setMessages(formattedHistory);
        } else {
          const initialMessage: Message = {
            id: "1",
            role: "assistant",
            content:
              "LUMINOUS_GUARDIAN_INITIALIZED: Digital realm integrity check complete. I am your specialized security analyst and protector.\nI am now monitoring your systems. You can ask me to run a scan or explain technical risks at any time.",
            timestamp: new Date().toLocaleTimeString("en-US", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
            }),
            status: "secure",
          };
          setMessages([initialMessage]);
        }
      } catch (error) {
        toast.error("Failed to load chat history");
        const initialMessage: Message = {
            id: "1",
            role: "assistant",
            content:
              "LUMINOUS_GUARDIAN_INITIALIZED...",
            timestamp: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit"}),
            status: "secure",
        };
        setMessages([initialMessage]);
      }
    };
    
    loadHistory();
  }, [isAuthenticated]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const tempId = Date.now().toString();
    const userMessage: Message = {
      id: tempId,
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Connect to the authenticated backend chat
      const data = await fetchApi<{ response: string }>("/chat/message", {
        method: "POST",
        body: JSON.stringify({ message: content }),
      });

      if (data.response === "Groq Brain Offline: Please check your API key.") {
        throw new Error("Luminous Guardian Brain is temporarily offline.");
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "No data received from Guardian.",
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "secure",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `ALERT: ${error.message || "System communication failure."}`,
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "warning",
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast.error("Message Error", { description: error.message });
    } finally {
      setIsTyping(false);
    }
  };

  if (authLoading || !isAuthenticated) {
    return <div className="flex h-screen w-full items-center justify-center">Initializing tactical interface...</div>;
  }


  return (
    <LayoutWrapper>
      <div className="flex flex-col h-full w-full min-h-0 overflow-hidden relative">
        <ChatLayout messages={uiMessages} isTyping={isScanning} />
        <ChatInput onSend={handleSendMessage} disabled={isScanning} />
      </div>
    </LayoutWrapper>
  );
}
