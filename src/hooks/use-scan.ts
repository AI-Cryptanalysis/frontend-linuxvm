'use client';

/**
 * use-scan.ts — ASPIS real-time WebSocket hook
 * Uses dynamic import to ensure socket.io-client only runs in the browser.
 */

import { useEffect, useRef, useState, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ScanMessageType = 'status' | 'tool' | 'ai' | 'error' | 'system';

export interface ScanMessage {
  id: string;
  type: ScanMessageType;
  text: string;
  timestamp: string;
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

// ─── Config ───────────────────────────────────────────────────────────────────

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5070';

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useScan() {
  // Use unknown so we can dynamically type the socket after import
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const socketRef = useRef<any>(null);

  const [messages, setMessages] = useState<ScanMessage[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const [isScanning, setIsScanning] = useState(false);
  const [fullReport, setFullReport] = useState<string>('');

  const now = () =>
    new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

  const push = useCallback((type: ScanMessageType, text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, type, text, timestamp: now() },
    ]);
  }, []);

  // ── Connect on mount — dynamic import guarantees browser-only execution ───
  useEffect(() => {
    // Dynamic import: socket.io-client is never loaded during SSR/server render
    import('socket.io-client').then(({ io }) => {
      const socket = io(BACKEND_URL, {
        autoConnect: true,
        reconnectionAttempts: 5,
        timeout: 10000,
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        setStatus('connected');
        console.log('[ASPIS WS] Connected ✔', socket.id);
      });

      socket.on('disconnect', (reason: string) => {
        setStatus('disconnected');
        console.warn('[ASPIS WS] Disconnected:', reason);
        setIsScanning(false);
      });

      socket.on('connect_error', (err: Error) => {
        setStatus('disconnected');
        console.error('[ASPIS WS] connect_error:', err.message);
        push('error', `Connection failed: ${err.message}`);
        setIsScanning(false);
      });

      // ── Scan events ──────────────────────────────────────────────────────

      socket.on('scan:status', ({ data }: { data: string }) => {
        push('status', data);
      });

      // Append live tool lines to the same message block
      socket.on('scan:tool', ({ data }: { data: string }) => {
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.type === 'tool') {
            return [...prev.slice(0, -1), { ...last, text: last.text + data }];
          }
          return [
            ...prev,
            { id: `${Date.now()}`, type: 'tool' as ScanMessageType, text: data, timestamp: now() },
          ];
        });
      });

      // Append AI tokens to the same bubble
      socket.on('scan:ai', ({ data }: { data: string }) => {
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.type === 'ai') {
            return [...prev.slice(0, -1), { ...last, text: last.text + data }];
          }
          return [
            ...prev,
            { id: `${Date.now()}`, type: 'ai' as ScanMessageType, text: data, timestamp: now() },
          ];
        });
      });

      socket.on('scan:complete', ({ data }: { data: string }) => {
        setFullReport(data);
        setIsScanning(false);
      });

      socket.on('scan:error', ({ data }: { data: string }) => {
        push('error', data);
        setIsScanning(false);
      });
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [push]);

  // ── Public API ────────────────────────────────────────────────────────────

  const startScan = useCallback(
    (prompt: string) => {
      if (!socketRef.current || isScanning || !prompt.trim()) return;
      setIsScanning(true);
      setFullReport('');
      socketRef.current.emit('start_scan', { prompt });
    },
    [isScanning],
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setFullReport('');
  }, []);

  return { messages, status, isScanning, fullReport, startScan, clearMessages };
}
