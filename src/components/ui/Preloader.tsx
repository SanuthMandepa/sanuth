"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./Preloader.module.css";

const COLUMNS = 6;

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      onComplete();
      return;
    }

    let cancelled = false;

    /* Resolves when the page is genuinely usable, with a failsafe so a slow
       third party can never strand the visitor behind the loader. */
    const ready = Promise.race([
      Promise.all([
        document.fonts?.ready ?? Promise.resolve(),
        new Promise<void>((resolve) => {
          if (document.readyState === "complete") resolve();
          else window.addEventListener("load", () => resolve(), { once: true });
        }),
      ]),
      new Promise((resolve) => window.setTimeout(resolve, 4000)),
    ]);

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(`.${styles.panel}`);
      const progress = { value: 0 };

      const intro = gsap
        .timeline()
        .to(progress, {
          value: 100,
          duration: 1.8,
          ease: "power2.inOut",
          onUpdate: () => setCount(Math.round(progress.value)),
        })
        .to(barRef.current, { scaleX: 1, duration: 1.8, ease: "power2.inOut" }, 0);

      Promise.all([intro.then(), ready]).then(() => {
        if (cancelled) return;

        gsap
          .timeline({ onComplete })
          .to(contentRef.current, {
            y: -40,
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
          })
          .to(
            panels,
            {
              yPercent: -100,
              duration: 0.9,
              ease: "swissInOut",
              stagger: { each: 0.06 },
            },
            "-=0.25"
          );
      });
    }, rootRef);

    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, [onComplete, reduced]);

  return (
    <div ref={rootRef} className={styles.preloader} aria-hidden="true">
      <div
        className={styles.panels}
        style={{ "--cols": COLUMNS } as React.CSSProperties}
      >
        {Array.from({ length: COLUMNS }).map((_, i) => (
          <div
            key={i}
            className={styles.panel}
            style={{ "--p": i } as React.CSSProperties}
          />
        ))}
      </div>

      <div ref={contentRef} className={styles.content}>
        <span className={styles.name}>Sanuth Mandepa</span>
        <span className={styles.counter}>{count}</span>
        <div className={styles.track}>
          <div ref={barRef} className={styles.bar} />
        </div>
        <span className={styles.role}>Graduate Software Engineer</span>
      </div>
    </div>
  );
}
