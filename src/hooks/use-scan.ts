'use client';

/**
 * use-scan.ts — ASPIS real-time WebSocket hook
 * Optimized to prevent "Maximum update depth exceeded" by merging state updates.
 */

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import type { Message } from '@/components/message-item';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ScanMessageType = 'status' | 'tool' | 'ai' | 'error' | 'system';

export interface ScanMessage {
  id: string;
  type: ScanMessageType;
  text: string;
  timestamp: string;
}

export interface BackendChatMessage {
  _id: string;
  role: 'user' | 'assistant';
  message: string;
  createdAt: string;
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

// ─── Config ───────────────────────────────────────────────────────────────────

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5070';

// ─── Utils ────────────────────────────────────────────────────────────────────

const getNowTimestamp = () =>
  new Date().toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useScan() {
  const socketRef = useRef<any>(null);

  // States
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ScanMessage[]>([]);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        '**Spectral Intelligence Interface**\n\n_Neural connectivity stabilized. Monitoring high-energy security signatures._\n\nI am your specialized security analyst and protector. I am now monitoring your systems. You can ask me to run a scan or perform a deep tactical audit at any time.',
      timestamp: 'SYSTEM_BOOT',
      status: 'secure',
    },
  ]);
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const [isScanning, setIsScanning] = useState(false);
  const [fullReport, setFullReport] = useState<string>('');

  // ─── Initialize Session from URL ───────────────────────────────────────────
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const session = params.get('session');
      if (session) {
        setSessionId(session);
        const token = localStorage.getItem('access_token');
        if (token) {
          fetch(`${BACKEND_URL}/chat/sessions/${session}/history`, {
            headers: { Authorization: `Bearer ${token}` }
          })
            .then(r => r.json())
            .then((data: BackendChatMessage[]) => {
              if (Array.isArray(data) && data.length > 0) {
                const history = data.map((m: BackendChatMessage) => ({
                  id: m._id,
                  role: m.role,
                  content: m.message,
                  timestamp: new Date(m.createdAt).toLocaleTimeString('en-US', {
                    hour12: false, hour: '2-digit', minute: '2-digit'
                  }),
                  status: 'secure' as const
                }));
                setChatMessages(history);
              }
            })
            .catch(console.error);
        }
      }
    }
  }, []);

  // ─── Direct UI Sync ────────────────────────────────────────────────────────
  const getContentFromStream = (stream: ScanMessage[]) => {
    const statusText = stream.filter(m => m.type === 'status').map(m => m.text).join('\n');
    const toolText = stream.filter(m => m.type === 'tool').map(m => m.text).join('');
    let aiText = stream.filter(m => m.type === 'ai').map(m => m.text).join('');
    const errorText = stream.filter(m => m.type === 'error').map(m => m.text).join('\n');

    aiText = aiText.replace(/🤖.*?📝.*?\.\.\./g, '').trim();

    const preambleSigs = [
        "Hello. I'm ASPIS",
        "Hello. As a Senior",
        "As a Senior Cybersecurity Analyst",
        "How can I assist you today?"
    ];
    
    const bodyContent = aiText.split(/\.|\?/).filter(s => {
        const clean = s.trim();
        return !preambleSigs.some(sig => clean.includes(sig)) && clean.length > 5;
    }).join('. ');

    let content = '';
    if (statusText) content += `_${statusText.trim()}_\n\n`;
    if (toolText)   content += `\`\`\`\n${toolText.trim()}\n\`\`\`\n\n`;
    if (bodyContent) content += bodyContent.trim();
    if (errorText)   content = `ALERT: ${errorText}`;
    
    return { content, isError: !!errorText };
  };

  const syncChatFromStream = useCallback((updatedStream: ScanMessage[]) => {
    const { content, isError } = getContentFromStream(updatedStream);
    if (!content) return;

    setChatMessages((prev: Message[]) => {
      const liveIndex = prev.findIndex((m: Message) => m.id === 'stream-live');
      
      const newMessage: Message = {
        id: 'stream-live',
        role: 'assistant',
        content,
        timestamp: getNowTimestamp(),
        status: isError ? 'warning' : 'secure',
      };

      if (liveIndex !== -1) {
        const next = [...prev];
        next[liveIndex] = newMessage;
        return next;
      } 
      
      return [...prev, newMessage];
    });
  }, []);

  // ─── Socket Events ─────────────────────────────────────────────────────────
  useEffect(() => {
    let active = true;

    import('socket.io-client').then(({ io }) => {
      if (!active || socketRef.current) return;

      const socket = io(BACKEND_URL, {
        autoConnect: true,
        reconnectionAttempts: 5,
        timeout: 10000,
      });

      socketRef.current = socket;

      socket.on('connect', () => setStatus('connected'));
      socket.on('disconnect', () => {
        setStatus('disconnected');
        setIsScanning(false);
      });

      const handleIncomingData = (type: ScanMessageType, data: string, append = true) => {
        setMessages((prev: ScanMessage[]) => {
          let next: ScanMessage[];
          const last = prev[prev.length - 1];
          
          if (append && last?.type === type) {
            next = [...prev.slice(0, -1), { ...last, text: last.text + data }];
          } else {
            next = [...prev, { id: `${Date.now()}-${Math.random()}`, type, text: data, timestamp: getNowTimestamp() }];
          }
          
          syncChatFromStream(next);
          return next;
        });
      };

      socket.on('scan:status', ({ data }: { data: string }) => handleIncomingData('status', data, false));
      socket.on('scan:tool', ({ data }: { data: string }) => handleIncomingData('tool', data, true));
      socket.on('scan:ai', ({ data }: { data: string }) => handleIncomingData('ai', data, true));
      
      socket.on('scan:complete', ({ data }: { data: string }) => {
        setFullReport(data);
        setIsScanning(false);
      });

      socket.on('scan:session_created', ({ data }: { data: string }) => {
        setSessionId(data);
        if (typeof window !== 'undefined') {
          window.history.pushState({}, '', `/?session=${data}`);
        }
      });

      socket.on('scan:error', ({ data }: { data: string }) => {
        handleIncomingData('error', data, false);
        setIsScanning(false);
      });
    });

    return () => {
      active = false;
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [syncChatFromStream]);

  // ─── API ───────────────────────────────────────────────────────────────────
  const startScan = useCallback((prompt: string) => {
    if (!socketRef.current || isScanning || !prompt.trim()) return;
    setIsScanning(true);
    setFullReport('');
    setMessages([]); 
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    
    socketRef.current.emit('start_scan', { 
      prompt,
      sessionId,
      token
    });
  }, [isScanning, sessionId]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setChatMessages((prev: Message[]) => [prev[0]]);
    setFullReport('');
  }, []);

  const pushUserMessage = useCallback((content: string) => {
    setChatMessages((prev: Message[]) => {
      const liveIndex = prev.findIndex((m: Message) => m.id === 'stream-live');
      let next = [...prev];
      if (liveIndex !== -1) {
        next[liveIndex] = { ...next[liveIndex], id: `scan-${Date.now()}` };
      }

      const userMsg: Message = {
        id: `${Date.now()}-user`,
        role: 'user',
        content,
        timestamp: getNowTimestamp(),
      };
      
      return [...next, userMsg];
    });
    
    startScan(content);
  }, [startScan]);

  return useMemo(() => ({
    chatMessages,
    status,
    isScanning,
    fullReport,
    startScan,
    clearMessages,
    pushUserMessage
  }), [chatMessages, status, isScanning, fullReport, startScan, clearMessages, pushUserMessage]);
}
