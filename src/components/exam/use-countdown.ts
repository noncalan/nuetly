"use client";

import { useEffect, useRef, useState } from "react";

const TICK_MS = 250;

/**
 * Seconds left until `deadline`. Calls `onExpire` once when time runs out.
 * In the prototype the clock is local; the real app takes the deadline from the server.
 */
export function useCountdown(startedAt: number, deadline: number, onExpire: () => void): number {
  const [now, setNow] = useState(startedAt);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  });

  useEffect(() => {
    let hasExpired = false;
    const id = window.setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (!hasExpired && current >= deadline) {
        hasExpired = true;
        onExpireRef.current();
      }
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [deadline]);

  return Math.max(0, Math.ceil((deadline - now) / 1000));
}
