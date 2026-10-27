"use client";

import { useRef, type PointerEvent, type MouseEvent } from "react";

export function useSwipeNavigation(next: () => void, previous: () => void) {
  const start = useRef<{ x: number; y: number } | null>(null);
  const suppressClickUntil = useRef(0);
  return {
    onPointerDown(event: PointerEvent<HTMLElement>) {
      if (event.pointerType === "mouse" || !event.isPrimary) return;
      start.current = { x: event.clientX, y: event.clientY };
    },
    onPointerCancel() { start.current = null; },
    onPointerUp(event: PointerEvent<HTMLElement>) {
      const origin = start.current;
      start.current = null;
      if (!origin) return;
      const dx = event.clientX - origin.x, dy = event.clientY - origin.y;
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
      event.preventDefault();
      suppressClickUntil.current = performance.now() + 400;
      if (dx < 0) next(); else previous();
    },
    onClickCapture(event: MouseEvent<HTMLElement>) {
      if (event.detail && performance.now() < suppressClickUntil.current) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
  };
}
