"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * A single hairline ring in difference-blend, so it reads as ink on paper and
 * as paper on ink without needing to know what it is over. Deliberately quiet —
 * in this design the type is the event, not the pointer.
 */
export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse || prefersReducedMotion()) return;

    const ring = ringRef.current;
    const label = labelRef.current;
    if (!ring || !label) return;

    document.documentElement.classList.add("cursor-active");
    gsap.set(ring, { xPercent: -50, yPercent: -50, scale: 0 });

    const xTo = gsap.quickTo(ring, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(ring, "y", { duration: 0.4, ease: "power3" });

    let entered = false;

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      if (!entered) {
        entered = true;
        gsap.to(ring, { scale: 1, duration: 0.4 });
      }
    };

    const onOver = (e: PointerEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>(
        "a, button, [data-hover]"
      );
      if (!target) return;

      const text = target.dataset.cursor ?? "";
      label.textContent = text;
      gsap.to(ring, {
        scale: text ? 3.4 : 2.2,
        duration: 0.4,
      });
      gsap.to(label, { opacity: text ? 1 : 0, duration: 0.3 });
    };

    const onOut = (e: PointerEvent) => {
      const target = (e.target as HTMLElement)?.closest(
        "a, button, [data-hover]"
      );
      if (!target) return;
      gsap.to(ring, { scale: 1, duration: 0.4 });
      gsap.to(label, { opacity: 0, duration: 0.2 });
    };

    const onLeave = () => gsap.to(ring, { scale: 0, duration: 0.3 });

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerout", onOut, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      document.documentElement.classList.remove("cursor-active");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerout", onOut);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 36,
        height: 36,
        borderRadius: "50%",
        border: "1px solid #fff",
        mixBlendMode: "difference",
        pointerEvents: "none",
        zIndex: 9998,
        display: "grid",
        placeItems: "center",
        willChange: "transform",
      }}
    >
      <span
        ref={labelRef}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 4,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#fff",
          opacity: 0,
          whiteSpace: "nowrap",
        }}
      />
    </div>
  );
}
