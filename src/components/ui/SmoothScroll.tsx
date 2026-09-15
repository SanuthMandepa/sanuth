"use client";

import { useEffect, useRef } from "react";
import { ReactLenis, type LenisRef } from "lenis/react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/**
 * Lenis driven by GSAP's ticker rather than its own RAF loop.
 *
 * This is the part that makes scroll-linked animation feel solid: one clock
 * drives both the smoothing and every ScrollTrigger, so pinned sections and
 * parallax can never drift a frame apart from the scroll position.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    // Honour the OS setting — smoothing hijacks scroll, which is exactly what
    // people who enable "reduce motion" are asking us not to do.
    if (prefersReducedMotion()) return;

    const lenis = lenisRef.current?.lenis;
    if (!lenis) return;

    lenis.on("scroll", ScrollTrigger.update);

    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.off("scroll", ScrollTrigger.update);
    };
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,
        lerp: 0.1,
        wheelMultiplier: 1,
        touchMultiplier: 1.6,
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
