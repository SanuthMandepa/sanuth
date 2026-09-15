"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { profile } from "@/data/content";
import styles from "./Hero.module.css";

const ROLES = [
  { n: "01", label: "Full-stack engineering" },
  { n: "02", label: "Applied machine learning" },
  { n: "03", label: "Interface and motion" },
];

export default function Hero({ ready }: { ready: boolean }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Wait for the preloader to clear, otherwise the reveal plays behind it.
    if (!ready) return;

    const root = rootRef.current;
    if (!root) return;

    if (prefersReducedMotion()) {
      gsap.set(root.querySelectorAll("[data-reveal]"), {
        visibility: "visible",
        opacity: 1,
        y: 0,
      });
      return;
    }

    const ctx = gsap.context(() => {
      const splits: SplitText[] = [];

      const lines = gsap.utils.toArray<HTMLElement>(`.${styles.lineInner}`);
      lines.forEach((line) => {
        splits.push(new SplitText(line, { type: "chars", charsClass: "heroChar" }));
      });

      const chars = gsap.utils.toArray<HTMLElement>(".heroChar");

      gsap.set(root.querySelectorAll("[data-reveal]"), { visibility: "visible" });

      const tl = gsap.timeline({ delay: 0.15 });

      // Characters rise into their mask, each a beat behind the last.
      tl.from(chars, {
        yPercent: 118,
        duration: 1.25,
        ease: "swiss",
        stagger: { each: 0.022, from: "start" },
      })
        .from(
          `.${styles.top} > *`,
          { yPercent: -120, opacity: 0, duration: 0.9, stagger: 0.08 },
          0.25
        )
        .from(
          `.${styles.lower}`,
          { opacity: 0, y: 26, duration: 1 },
          0.5
        )
        .from(
          `.${styles.fieldLine}`,
          { scaleY: 0, transformOrigin: "top center", duration: 1.4, stagger: 0.035 },
          0
        )
        .from(`.${styles.scrollCue}`, { opacity: 0, duration: 0.8 }, 1.1);

      // Parallax: the display type holds while the page moves under it, and the
      // supporting rows drift faster. Scrubbed, so it tracks the scroll exactly.
      gsap.to(`.${styles.nameBlock}`, {
        yPercent: 26,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(`.${styles.lower}`, {
        yPercent: 62,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      return () => splits.forEach((s) => s.revert());
    }, root);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section ref={rootRef} id="index" className={styles.hero}>
      <div className={styles.field} aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={styles.fieldLine} />
        ))}
      </div>

      <header className={`${styles.top} shell`} data-reveal>
        <span className="meta">{profile.location}</span>
        <span className="meta">Portfolio — 2026</span>
        {profile.available && (
          <span className={`${styles.available} meta`}>
            <span className={styles.dot} />
            Open to graduate roles
          </span>
        )}
      </header>

      <div className={`${styles.middle} shell`}>
        <h1 className={styles.nameBlock}>
          <span className={styles.line}>
            <span className={styles.lineInner} data-reveal>
              {profile.firstName}
            </span>
          </span>
          <span className={styles.line}>
            <span
              className={`${styles.lineInner} ${styles.lineOutline}`}
              data-reveal
            >
              {profile.lastName}
            </span>
          </span>
        </h1>
      </div>

      <div className={`${styles.lower} shell`}>
        <p className={styles.statement}>
          Software engineer working across the stack — from{" "}
          <em>Vision Transformers on 366,000 ECG recordings</em> to a
          LangGraph claim-auditing system shipped solo.
        </p>

        <div className={styles.roleCol}>
          {ROLES.map((r) => (
            <div key={r.n} className={styles.roleItem}>
              <span className="meta">{r.n}</span>
              <span>{r.label}</span>
            </div>
          ))}
        </div>

        <nav className={styles.actions}>
          <a
            href="#work"
            className={styles.action}
            data-hover
            data-cursor="View"
          >
            <span>Selected work</span>
            <span className={styles.arrow}>↗</span>
          </a>
          <a
            href={profile.cv}
            download
            className={styles.action}
            data-hover
            data-cursor="Save"
          >
            <span>Curriculum vitae</span>
            <span className={styles.arrow}>↓</span>
          </a>
        </nav>
      </div>

      <div className={styles.scrollCue} aria-hidden="true">
        <div className={styles.scrollTrack}>
          <div className={styles.scrollThumb} />
        </div>
        <span className="meta">Scroll</span>
      </div>
    </section>
  );
}
