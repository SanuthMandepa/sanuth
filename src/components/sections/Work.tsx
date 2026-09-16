"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useSpotlight } from "@/components/ui/Interactive";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { projects } from "@/data/content";
import {
  LAYOUTS,
  HEADINGS,
  type LayoutId,
  type HeadingId,
} from "@/components/work/layouts";
import styles from "./Work.module.css";
import s from "@/components/work/layouts.module.css";

/* Which variant to ship once a choice is made. Change these two and delete the
   switcher below to lock the section down. */
const DEFAULT_LAYOUT: LayoutId = "stack";
const DEFAULT_HEADING: HeadingId = "count";

export default function Work() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [layout, setLayout] = useState<LayoutId>(DEFAULT_LAYOUT);
  const [heading, setHeading] = useState<HeadingId>(DEFAULT_HEADING);

  useSpotlight(rootRef, "[data-spotlight]");

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      // Cards rise as they arrive, whichever layout is showing.
      const cards = gsap.utils.toArray<HTMLElement>("[data-anim]");
      cards.forEach((card) => {
        gsap.from(card, {
          y: 50,
          opacity: 0,
          duration: 0.75,
          ease: "swiss",
          scrollTrigger: { trigger: card, start: "top 90%" },
        });
      });

      // The stack layout also dims each card as the next slides over it.
      if (layout !== "stack") return;
      const stacked = gsap.utils.toArray<HTMLElement>(`.${s.stackCard}`);
      stacked.forEach((card, i) => {
        if (i === stacked.length - 1) return;
        gsap.to(card, {
          scale: 0.95,
          opacity: 0.6,
          ease: "none",
          scrollTrigger: {
            trigger: stacked[i + 1],
            start: "top bottom",
            end: "top top+=120",
            scrub: true,
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, [reduced, layout]);

  const Layout = LAYOUTS[layout].Comp;
  const Heading = HEADINGS[heading];

  return (
    <section ref={rootRef} id="work" className={`${styles.work} surface-white`}>
      <div className="shell">
        <header className={styles.head}>
          <div className="section-head">
            <span className="eyebrow">{Heading.eyebrow}</span>
            <h2 className="section-title">{Heading.render()}</h2>
          </div>

          {/* Preview control. Temporary: remove once a variant is chosen. */}
          <div className={styles.switcher}>
            <div className={styles.switchGroup}>
              <span className={styles.switchLabel}>Layout</span>
              <div className={styles.pills}>
                {(Object.keys(LAYOUTS) as LayoutId[]).map((id) => (
                  <button
                    key={id}
                    onClick={() => setLayout(id)}
                    className={`${styles.pill} ${
                      layout === id ? styles.pillOn : ""
                    }`}
                    aria-pressed={layout === id}
                  >
                    {LAYOUTS[id].label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.switchGroup}>
              <span className={styles.switchLabel}>Heading</span>
              <div className={styles.pills}>
                {(Object.keys(HEADINGS) as HeadingId[]).map((id) => (
                  <button
                    key={id}
                    onClick={() => setHeading(id)}
                    className={`${styles.pill} ${
                      heading === id ? styles.pillOn : ""
                    }`}
                    aria-pressed={heading === id}
                  >
                    {HEADINGS[id].label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Keyed so switching variants remounts cleanly and re-runs the
            entry animation rather than leaving stale ScrollTriggers. */}
        <div key={layout}>
          <Layout projects={projects} />
        </div>
      </div>
    </section>
  );
}
