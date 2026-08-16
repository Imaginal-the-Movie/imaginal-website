"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const MAX_OPACITY = 0.26;
const MIN_OPACITY = 0.015;

export function ImageBackdrop() {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const backdrop = backdropRef.current;
    if (!backdrop) return;

    let current = MAX_OPACITY;
    let target = MAX_OPACITY;
    let frame = 0;

    const animate = () => {
      current += (target - current) * 0.075;
      backdrop.style.opacity = current.toFixed(4);

      if (Math.abs(target - current) > 0.0005) {
        frame = requestAnimationFrame(animate);
      } else {
        current = target;
        backdrop.style.opacity = current.toFixed(4);
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
      const easedProximity =
        centerProximity * centerProximity * (3 - 2 * centerProximity);

      target = MIN_OPACITY + (MAX_OPACITY - MIN_OPACITY) * easedProximity;

      if (!frame) frame = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={backdropRef} className="imageBackdrop" aria-hidden="true">
      <Image
        src="/imaginal-background.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
      />
    </div>
  );
}
