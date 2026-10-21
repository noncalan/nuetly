"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type RefObject } from "react";

/** Exit durations mirror --dur-exit / --dur-sheet-exit in globals.css. */
export const DIALOG_EXIT_MS = 140;
export const SHEET_EXIT_MS = 200;

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type PresenceState = "closed" | "open" | "closing";

export type Presence = {
  isMounted: boolean;
  isOpen: boolean;
  isClosing: boolean;
  open: () => void;
  /** Plays the exit animation (overlay gets data-closing), then unmounts. */
  close: () => void;
  /** Unmounts without an exit animation (Escape, navigation). */
  closeNow: () => void;
};

export function usePresence(exitMs: number): Presence {
  const [state, setState] = useState<PresenceState>("closed");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const open = useCallback(() => {
    window.clearTimeout(timer.current);
    setState("open");
  }, []);

  const closeNow = useCallback(() => {
    window.clearTimeout(timer.current);
    setState("closed");
  }, []);

  const close = useCallback(() => {
    window.clearTimeout(timer.current);
    setState((current) => (current === "closed" ? current : "closing"));
    timer.current = window.setTimeout(() => setState("closed"), exitMs);
  }, [exitMs]);

  return {
    isMounted: state !== "closed",
    isOpen: state === "open",
    isClosing: state === "closing",
    open,
    close,
    closeNow,
  };
}

/**
 * Moves focus into an overlay on mount and hands it back to whatever opened it on unmount —
 * unless focus has meanwhile moved somewhere meaningful outside (e.g. the next question heading).
 */
export function useFocusReturn(
  containerRef: RefObject<HTMLElement | null>,
  initialFocusRef: RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const container = containerRef.current;
    initialFocusRef.current?.focus();
    return () => {
      const active = document.activeElement;
      const isFocusLost = !active || active === document.body || Boolean(container?.contains(active));
      if (isFocusLost && opener?.isConnected) opener.focus();
    };
  }, [containerRef, initialFocusRef]);
}

/** Keeps Tab / Shift+Tab cycling inside the element that handles the event. */
export function trapTab(event: KeyboardEvent<HTMLElement>): void {
  if (event.key !== "Tab") return;
  const container = event.currentTarget;
  const nodes = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE));
  if (nodes.length === 0) return;
  const first = nodes[0];
  const last = nodes[nodes.length - 1];
  const active = document.activeElement;
  // active === container: the user clicked plain text inside the overlay, focusing the container itself.
  if (event.shiftKey && (active === first || active === container || !container.contains(active))) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

/** `data-closing` is a boolean attribute: present while the exit animation runs. */
export function closingAttr(isClosing: boolean): "" | undefined {
  return isClosing ? "" : undefined;
}
