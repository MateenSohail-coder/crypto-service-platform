"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * useSSE - connects to /api/sse and listens for server-sent events
 * @param {Object} handlers - { eventName: callbackFn }
 * @param {boolean} enabled - whether to connect (only when user is logged in)
 */
export function useSSE(handlers, enabled = true) {
  const esRef = useRef(null);
  const handlersRef = useRef(handlers);
  const reconnectTimer = useRef(null);
  const reconnectDelay = useRef(1000);

  // Always keep handlers ref fresh without reconnecting
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  const connect = useCallback(() => {
    if (!enabled) return;

    const token = localStorage.getItem("token");
    if (!token || token === "null" || token === "undefined") return;

    // Close existing connection
    if (esRef.current) {
      esRef.current.close();
    }

    const url = `/api/sse`;
    const es = new EventSource(`${url}?token=${token}`);
    esRef.current = es;

    es.addEventListener("connected", () => {
      console.log("SSE connected");
      reconnectDelay.current = 1000; // Reset delay on successful connect
    });

    // Attach all event handlers
    Object.entries(handlersRef.current).forEach(([event, handler]) => {
      es.addEventListener(event, (e) => {
        try {
          const data = JSON.parse(e.data);
          handler(data);
        } catch (err) {
          console.error(`SSE parse error for event "${event}":`, err);
        }
      });
    });

    es.onerror = () => {
      es.close();
      esRef.current = null;

      // Exponential backoff reconnect (max 30s)
      reconnectTimer.current = setTimeout(() => {
        reconnectDelay.current = Math.min(reconnectDelay.current * 2, 30000);
        connect();
      }, reconnectDelay.current);
    };
  }, [enabled]);

  useEffect(() => {
    if (enabled) {
      connect();
    }

    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (esRef.current) {
        esRef.current.close();
        esRef.current = null;
      }
    };
  }, [connect, enabled]);
}
