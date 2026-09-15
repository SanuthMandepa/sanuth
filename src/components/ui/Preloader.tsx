"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import styles from "./Preloader.module.css";

const COLUMNS_DESKTOP = 6;
const COLUMNS_MOBILE = 3;

/** Shown beside the counter so the wait reads as work, not as a stall. */
const STAGES = [
  { at: 0, label: "Initialising" },
  { at: 28, label: "Loading type" },
  { at: 55, label: "Building grid" },
  { at: 78, label: "Composing" },
  { at: 96, label: "Ready" },
];

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  const [count, setCount] = useState(0);
  const [stage, setStage] = useState(STAGES[0].label);
  const [columns, setColumns] = useState(COLUMNS_DESKTOP);

  // Decide the column count before paint so the panels never visibly reflow.
  useEffect(() => {
    setColumns(
      window.matchMedia("(max-width: 640px)").matches
        ? COLUMNS_MOBILE
        : COLUMNS_DESKTOP
    );
  }, []);

  useEffect(() => {
    // Reduced motion: no theatre, just get out of the way.
    if (prefersReducedMotion()) {
      onComplete();
      return;
    }

    let cancelled = false;

    /* Resolves once the page is genuinely usable — fonts decoded and the load
       event fired — with a failsafe so a slow third party can never strand the
       visitor behind the loader. */
    const assetsReady = Promise.race([
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

      // The count runs on its own curve, but the exit waits on real readiness,
      // so the number never claims to be done while the page still isn't.
      const intro = gsap
        .timeline()
        .to(progress, {
          value: 100,
          duration: 2.1,
          ease: "power2.inOut",
          onUpdate: () => {
            const v = progress.value;
            setCount(Math.floor(v));
            const current = [...STAGES].reverse().find((s) => v >= s.at);
            if (current) setStage(current.label);
          },
        })
        .to(
          barRef.current,
          { scaleX: 1, duration: 2.1, ease: "power2.inOut" },
          0
        );

      Promise.all([intro.then(), assetsReady]).then(() => {
        if (cancelled) return;

        gsap
          .timeline({ onComplete })
          .to([counterRef.current, metaRef.current], {
            yPercent: -130,
            duration: 0.7,
            ease: "swissIn",
            stagger: 0.05,
          })
          .to(
            barRef.current,
            { scaleX: 0, transformOrigin: "right center", duration: 0.5 },
            "<"
          )
          // The moment you asked for: each column clears on its own beat.
          .to(
            panels,
            {
              yPercent: -100,
              duration: 1.05,
              ease: "swissInOut",
              stagger: { each: 0.07, from: "start" },
            },
            "-=0.35"
          );
      });
    }, rootRef);

    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, [onComplete]);

  return (
    <div ref={rootRef} className={styles.preloader} aria-hidden="true">
      <div
        ref={panelsRef}
        className={styles.panels}
        style={{ "--cols": columns } as React.CSSProperties}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className={styles.panel} />
        ))}
      </div>

      <div className={styles.content}>
        <div ref={metaRef} className={styles.top}>
          <span className={styles.topItem}>Sanuth Mandepa</span>
          <span className={styles.topItem}>Graduate Software Engineer</span>
        </div>

        <div className={styles.track}>
          <div ref={barRef} className={styles.bar} />
        </div>

        <div className={styles.bottom}>
          <div ref={counterRef} className={styles.counter}>
            {String(count).padStart(3, "0")}
            <span className={styles.percent}>%</span>
          </div>
          <div className={styles.status}>{stage}</div>
        </div>
      </div>
    </div>
  );
}
