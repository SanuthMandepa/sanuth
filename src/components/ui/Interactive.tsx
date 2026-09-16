"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Hover primitives, all pointer-driven and all no-ops for coarse pointers and
 * reduced motion. They attach to a wrapper element rather than cloning the
 * child, so they compose with anything.
 */

function isFinePointer() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/* --------------------------------------------------------------- magnetic */

/**
 * The element leans toward the cursor while it is nearby and springs back on
 * exit. `strength` is the fraction of the offset it follows.
 */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !isFinePointer()) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(el);
    };
  }, [strength, reduced]);

  return (
    <span ref={ref} className={className} style={{ display: "inline-flex" }}>
      {children}
    </span>
  );
}

/* --------------------------------------------------------------- spotlight */

/**
 * Writes the pointer position into `--mx` / `--my` on every descendant marked
 * `data-spotlight`, so CSS can paint a glow that follows the cursor. One
 * listener for the whole section rather than one per card.
 */
export function useSpotlight(
  rootRef: React.RefObject<HTMLElement | null>,
  selector: string
) {
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced || !isFinePointer()) return;

    const cards = Array.from(root.querySelectorAll<HTMLElement>(selector));
    if (!cards.length) return;

    const onMove = (e: PointerEvent) => {
      for (const card of cards) {
        const r = card.getBoundingClientRect();
        // Skip anything scrolled well out of view.
        if (r.bottom < -200 || r.top > window.innerHeight + 200) continue;
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [rootRef, selector, reduced]);
}

/* -------------------------------------------------------------------- tilt */

/** Subtle 3D tilt toward the cursor. Kept small so text stays readable. */
export function useTilt(
  rootRef: React.RefObject<HTMLElement | null>,
  selector: string,
  max = 6
) {
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced || !isFinePointer()) return;

    const cards = Array.from(root.querySelectorAll<HTMLElement>(selector));
    const cleanups: (() => void)[] = [];

    for (const card of cards) {
      const rotX = gsap.quickTo(card, "rotationX", {
        duration: 0.6,
        ease: "power3",
      });
      const rotY = gsap.quickTo(card, "rotationY", {
        duration: 0.6,
        ease: "power3",
      });

      const onMove = (e: PointerEvent) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        rotY(px * max * 2);
        rotX(-py * max * 2);
      };
      const onLeave = () => {
        rotX(0);
        rotY(0);
      };

      gsap.set(card, { transformPerspective: 900, transformStyle: "preserve-3d" });
      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        card.removeEventListener("pointermove", onMove);
        card.removeEventListener("pointerleave", onLeave);
        gsap.killTweensOf(card);
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, [rootRef, selector, max, reduced]);
}

/* ------------------------------------------------------------ hover swap */

/**
 * Two stacked copies of a label: the first slides out upward while the second
 * slides in from below. Purely CSS-driven once the markup is in place.
 */
export function SwapText({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <span className={className} data-swap>
      <span data-swap-a>{children}</span>
      <span data-swap-b aria-hidden="true">
        {children}
      </span>
    </span>
  );
}
