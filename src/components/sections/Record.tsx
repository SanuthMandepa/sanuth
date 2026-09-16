"use client";

import { useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { getIcon } from "@/lib/icons";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { timeline, certifications } from "@/data/content";
import styles from "./Record.module.css";

export default function Record() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      gsap.from(`.${styles.entry}`, {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "swiss",
        scrollTrigger: { trigger: `.${styles.list}`, start: "top 82%" },
      });

      gsap.from(`.${styles.cert}`, {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.03,
        ease: "swiss",
        scrollTrigger: { trigger: `.${styles.certs}`, start: "top 88%" },
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={rootRef} id="record" className={`${styles.record} surface-cream`}>
      <div className="shell">
        <header className="section-head">
          <span className="eyebrow">Record</span>
          <h2 className="section-title">
            Where I have <span className="grad-text">been so far</span>
          </h2>
        </header>

        <div className={styles.list}>
          {timeline.map((entry) => {
            const Icon = getIcon(entry.icon);
            return (
              <article
                key={entry.index}
                className={`${styles.entry} ${
                  entry.kind === "honour" ? styles.entryFeature : ""
                }`}
              >
                <span className={styles.icon}>
                  <Icon size={28} strokeWidth={2} />
                </span>
                <div className={styles.body}>
                  <span className={styles.period}>{entry.period}</span>
                  <h3 className={styles.title}>{entry.title}</h3>
                  <span className={styles.org}>{entry.org}</span>
                  <p className={styles.detail}>{entry.detail}</p>
                </div>
              </article>
            );
          })}
        </div>

        <div className={styles.certsHead}>
          <h3 className={styles.certsTitle}>Certifications</h3>
          {/* "Total", not "completed": two of these are partial and say so. */}
          <span className={styles.certsCount}>
            {certifications.length} total
          </span>
        </div>

        <div className={styles.certs}>
          {certifications.map((c) => (
            <div key={c.name} className={styles.cert}>
              <Check size={16} strokeWidth={3} className={styles.certCheck} />
              <span>
                <span className={styles.certName}>{c.name}</span>
                <span className={styles.certIssuer}>
                  {c.issuer}
                  {c.note ? ` (${c.note})` : ""}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
