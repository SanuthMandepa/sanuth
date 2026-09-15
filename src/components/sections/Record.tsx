"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { timeline, certifications } from "@/data/content";
import styles from "./Record.module.css";

const KIND_LABEL = {
  work: "Experience",
  education: "Education",
  honour: "Honour",
} as const;

export default function Record() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(`.${styles.entry}`).forEach((entry) => {
        gsap.from(entry.querySelectorAll("[data-stagger]"), {
          y: 24,
          opacity: 0,
          duration: 0.85,
          stagger: 0.06,
          scrollTrigger: { trigger: entry, start: "top 82%" },
        });

        // The accent rule draws across the foot of the entry as it arrives.
        // Animating a custom property is the only way to reach a ::after.
        gsap.fromTo(
          entry,
          { "--scale": 0 },
          {
            "--scale": 1,
            duration: 1,
            ease: "swiss",
            scrollTrigger: { trigger: entry, start: "top 82%" },
          }
        );
      });

      gsap.from(`.${styles.cert}`, {
        opacity: 0,
        y: 16,
        duration: 0.6,
        stagger: 0.03,
        scrollTrigger: { trigger: `.${styles.certList}`, start: "top 85%" },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="record" className={`${styles.record} shell`}>
      <header className={styles.header}>
        <h2 className={styles.headerTitle}>Record</h2>
        <span className="meta">03 — Experience, education &amp; honours</span>
      </header>

      {timeline.map((entry) => (
        <article key={entry.index} className={styles.entry}>
          <div className={styles.period} data-stagger>
            <span className="meta">{entry.index}</span>
            <span className="meta">{entry.period}</span>
          </div>

          <div className={styles.main}>
            <h3 className={styles.title} data-stagger>
              {entry.title}
            </h3>
            <p className={styles.org} data-stagger>
              {entry.org}
              {entry.location && (
                <>
                  {" — "}
                  <span className={styles.location}>{entry.location}</span>
                </>
              )}
            </p>

            {entry.detail.length > 0 && (
              <div className={styles.detail}>
                {entry.detail.map((d, i) => (
                  <p key={i} className={styles.detailItem} data-stagger>
                    <span className={styles.detailMark} aria-hidden="true">
                      —
                    </span>
                    {d}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className={styles.kind} data-stagger>
            <span
              className={`${styles.kindTag} meta ${
                entry.kind === "honour" ? styles.kindHonour : ""
              }`}
            >
              {KIND_LABEL[entry.kind]}
            </span>
          </div>
        </article>
      ))}

      <div className={styles.certs}>
        <div className={styles.certsHead}>
          <h3 className={styles.certsTitle}>Certifications</h3>
          <span className="meta">{certifications.length} total</span>
        </div>

        <ol className={styles.certList}>
          {certifications.map((c, i) => (
            <li key={c.name} className={styles.cert}>
              <span className={styles.certNum}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>
                <span className={styles.certName}>{c.name}</span>
                <span className={styles.certIssuer}>
                  {c.issuer}
                  {c.note && (
                    <span className={styles.certNote}> · {c.note}</span>
                  )}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
