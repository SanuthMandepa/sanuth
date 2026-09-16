"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { ArrowRight, Download } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { Magnetic, SwapText } from "@/components/ui/Interactive";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { profile } from "@/data/content";
import styles from "./Hero.module.css";

/* Three.js is ~600KB. Keeping it out of the first bundle means the headline
   paints immediately and the canvas arrives a moment later. */
const PortraitCanvas = dynamic(
  () => import("@/components/3d/PortraitCanvas"),
  { ssr: false }
);

export default function Hero({ ready }: { ready: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!ready) return;
    const root = rootRef.current;
    if (!root) return;

    const reveal = root.querySelectorAll("[data-reveal]");

    if (reduced) {
      gsap.set(reveal, { visibility: "visible", opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(reveal, { visibility: "visible" });

      /* The headline is revealed whole rather than split into characters:
         SplitText wraps each char in its own span, which leaves the gradient
         words with no text to clip to and renders them invisible. */
      gsap
        .timeline({ delay: 0.1 })
        .from(`.${styles.titleInner}`, {
          yPercent: 106,
          duration: 1,
          ease: "swiss",
        })
        .from(
          [`.${styles.pill}`, `.${styles.lead}`, `.${styles.actions}`],
          { y: 24, opacity: 0, duration: 0.7, stagger: 0.09 },
          0.25
        )
        .from(
          `.${styles.stat}`,
          { y: 20, opacity: 0, duration: 0.6, stagger: 0.08 },
          0.5
        )
        .from(
          [`.${styles.glowA}`, `.${styles.glowB}`],
          { scale: 0.7, opacity: 0, duration: 1.6 },
          0
        );

      gsap.to(`.${styles.glowA}`, {
        yPercent: 28,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, [ready, reduced]);

  return (
    <section ref={rootRef} id="index" className={`${styles.hero} surface-cream`}>
      <div className={`${styles.glow} ${styles.glowA}`} aria-hidden="true" />
      <div className={`${styles.glow} ${styles.glowB}`} aria-hidden="true" />

      <div className={`${styles.grid} shell`}>
        <div className={styles.copy}>
          {profile.available && (
            <span className={styles.pill} data-reveal>
              <span className={styles.pulse} />
              Open to graduate roles
            </span>
          )}

          <h1 className={styles.title} data-reveal>
            <span className={styles.titleInner}>
              I build things that{" "}
              <span className={styles.accent}>actually ship</span>
            </span>
          </h1>

          <p className={styles.lead} data-reveal>
            {profile.title} in {profile.location}. Machine learning, full
            stack, and <span className="serif">the messy bits in between</span>.
          </p>

          <div className={styles.actions} data-reveal>
            <Magnetic strength={0.28}>
              <a href="#work" className={`${styles.btn} ${styles.btnPrimary}`}>
                <SwapText>See the work</SwapText>
                <ArrowRight size={18} strokeWidth={2.5} />
              </a>
            </Magnetic>
            <Magnetic strength={0.28}>
              <a
                href={profile.cv}
                download
                className={`${styles.btn} ${styles.btnGhost}`}
              >
                <Download size={18} strokeWidth={2.5} />
                <SwapText>Download CV</SwapText>
              </a>
            </Magnetic>
          </div>

          <div className={styles.stats}>
            {profile.stats.map((s) => (
              <div key={s.label} className={styles.stat} data-reveal>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.stage}>
            <PortraitCanvas />
          </div>

          <span className={styles.hint}>Move your cursor over the portrait</span>
        </div>
      </div>
    </section>
  );
}
