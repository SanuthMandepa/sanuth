"use client";

import { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Drives Lenis from GSAP's ticker so one clock advances both the smoothing and
 * every ScrollTrigger, so pinned sections and parallax can never drift a
 * frame apart from the scroll position.
 *
 * This lives in a child rather than in SmoothScroll itself because ReactLenis
 * creates its instance inside an effect and publishes it via state. A parent
 * reading `ref.current.lenis` on mount always gets `undefined` and bails out,
 * which with autoRaf off leaves nothing driving the loop and silently kills
 * scrolling altogether. `useLenis` subscribes properly and re-runs when the
 * instance appears.
 */
function LenisTicker() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const update = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.off("scroll", ScrollTrigger.update);
    };
  }, [lenis]);

  return null;
}

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();

  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
        lerp: 0.1,
        wheelMultiplier: 1,
        touchMultiplier: 1.6,
        syncTouch: false,
        // Hand the wheel and touch back to the browser when the visitor has
        // asked for reduced motion, instead of stopping Lenis, which
        // would block scrolling rather than simply un-smoothing it.
        smoothWheel: !reduced,
      }}
    >
      <LenisTicker />
      {children}
    </ReactLenis>
  );
}
