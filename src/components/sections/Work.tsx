"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useSpotlight } from "@/components/ui/Interactive";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { projects } from "@/data/content";
import { StackLayout } from "@/components/work/layouts";
import styles from "./Work.module.css";
import s from "@/components/work/layouts.module.css";

export default function Work() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useSpotlight(rootRef, `.${s.card}`);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(`.${s.card}`);

      cards.forEach((card, i) => {
        // Entry. Only y and opacity, and only once, so it cannot collide with
        // the scrubbed dim below.
        gsap.from(card, {
          y: 50,
          opacity: 0,
          duration: 0.75,
          ease: "swiss",
          scrollTrigger: { trigger: card, start: "top 90%" },
        });

        if (i === cards.length - 1) return;

        /* Dim the card as the next one slides over it.
           This animates a white veil sitting inside the card, NOT the card's
           own transform. Scaling an element that contains text makes the
           browser rasterise it then resample, which is what made the stack
           look blurry while scrolling. Nothing here scales. */
        const veil = card.querySelector(`.${s.dim}`);
        if (!veil) return;

        gsap.to(veil, {
          opacity: 0.55,
          ease: "none",
          scrollTrigger: {
            trigger: cards[i + 1],
            start: "top bottom",
            end: "top top+=140",
            scrub: true,
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={rootRef} id="work" className={`${styles.work} surface-white`}>
      <div className="shell">
        <header className={styles.head}>
          <div className="section-head">
            <span className="eyebrow">Selected work</span>
            <h2 className="section-title">
              Five things I{" "}
              <span className="grad-text">built and shipped</span>
            </h2>
          </div>
        </header>

        <StackLayout projects={projects} />
      </div>
    </section>
  );
}
