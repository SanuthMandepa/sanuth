"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable on touch devices
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    document.documentElement.classList.add("custom-cursor-active");

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;

      // Small active inner dot
      gsap.to(dotRef.current, {
        x: clientX,
        y: clientY,
        duration: 0.1,
        ease: "power2.out",
      });

      // Larger laggy outer circle
      gsap.to(ringRef.current, {
        x: clientX,
        y: clientY,
        duration: 0.4,
        ease: "power3.out",
      });
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-magnetic]") ||
        target.closest("[data-hover]")
      ) {
        gsap.to(dotRef.current, { scale: 0, duration: 0.2 });
        gsap.to(ringRef.current, {
          scale: 1.8,
          backgroundColor: "rgba(0, 240, 255, 0.1)",
          borderColor: "var(--accent-cyan)",
          duration: 0.3,
        });
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-magnetic]") ||
        target.closest("[data-hover]")
      ) {
        gsap.to(dotRef.current, { scale: 1, duration: 0.2 });
        gsap.to(ringRef.current, {
          scale: 1,
          backgroundColor: "transparent",
          borderColor: "var(--accent-purple)",
          duration: 0.3,
        });
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);
    window.addEventListener("mouseout", onMouseOut);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: "var(--accent-cyan)",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "1px solid var(--accent-purple)",
          pointerEvents: "none",
          zIndex: 9998,
          transform: "translate(-50%, -50%)",
          transition: "background-color 0.3s, border-color 0.3s",
        }}
      />
    </>
  );
}
