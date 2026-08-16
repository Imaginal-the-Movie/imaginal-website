"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef } from "react";

type ProximityStyles = CSSProperties & {
  "--pointer-center-proximity": number;
};

export function PointerProximityField({ children }: { children: ReactNode }) {
  const fieldRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    let current = 1;
    let target = 1;
    let frame = 0;

    const animate = () => {
      current += (target - current) * 0.075;
      field.style.setProperty("--pointer-center-proximity", current.toFixed(4));

      if (Math.abs(target - current) > 0.0005) {
        frame = requestAnimationFrame(animate);
      } else {
        current = target;
        field.style.setProperty("--pointer-center-proximity", current.toFixed(4));
        frame = 0;
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      const horizontalDistance = (event.clientX / window.innerWidth - 0.5) * 2;
      const verticalDistance = (event.clientY / window.innerHeight - 0.5) * 2;
      const distanceFromCenter = Math.min(
        1,
        Math.hypot(horizontalDistance, verticalDistance),
      );
      const centerProximity = 1 - distanceFromCenter;

      target = centerProximity * centerProximity * (3 - 2 * centerProximity);

      if (!frame) frame = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const initialStyle: ProximityStyles = { "--pointer-center-proximity": 1 };

  return (
    <main ref={fieldRef} style={initialStyle}>
      {children}
    </main>
  );
}
