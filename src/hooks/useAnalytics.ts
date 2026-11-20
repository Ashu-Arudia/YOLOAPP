"use client";

import { useEffect, useRef, useState } from "react";
import type { AnalyticsSnapshot } from "@/lib/api";

type WsStatus = "connecting" | "connected" | "disconnected" | "error";

interface UseAnalyticsReturn {
  data: AnalyticsSnapshot | null;
  status: WsStatus;
}

const WS_BASE =
  typeof window !== "undefined"
    ? `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.hostname}:8000`
    : "ws://localhost:8000";

export function useAnalytics(matchId: string | null): UseAnalyticsReturn {
  const [data, setData] = useState<AnalyticsSnapshot | null>(null);
  const [status, setStatus] = useState<WsStatus>("disconnected");
  const wsRef = useRef<WebSocket | null>(null);
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!matchId) return;

    let cancelled = false;

    function connect() {
      if (cancelled) return;
      setStatus("connecting");

      const ws = new WebSocket(`${WS_BASE}/ws/matches/${matchId}`);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!cancelled) setStatus("connected");
      };

      ws.onmessage = (evt) => {
        if (cancelled) return;
        try {
          const parsed = JSON.parse(evt.data as string) as AnalyticsSnapshot;
          setData(parsed);
        } catch {
          // ignore malformed frames
        }
      };

      ws.onerror = () => {
        if (!cancelled) setStatus("error");
      };

      ws.onclose = () => {
        if (!cancelled) {
          setStatus("disconnected");
          // Reconnect after 2 s
          retryRef.current = setTimeout(connect, 2000);
        }
      };
    }

    connect();

    return () => {
      cancelled = true;
      if (retryRef.current) clearTimeout(retryRef.current);
      wsRef.current?.close();
      setStatus("disconnected");
      setData(null);
    };
  }, [matchId]);

  return { data, status };
}
