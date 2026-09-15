"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, SplitText, prefersReducedMotion } from "@/lib/gsap";
import { profile, skillGroups } from "@/data/content";
import styles from "./About.module.css";

const FACTS = [
  { label: "Based in", value: profile.location },
  { label: "Degree", value: "BEng (Hons), 2:1" },
  { label: "Placement", value: "12 months, completed" },
  { label: "Status", value: "Open to graduate roles" },
];

export default function About() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const splits: SplitText[] = [];

      // The lead paragraph reveals line by line, masked.
      const lead = root.querySelector<HTMLElement>(`.${styles.bioLead}`);
      if (lead) {
        const split = new SplitText(lead, {
          type: "lines",
          linesClass: "aboutLine",
          mask: "lines",
        });
        splits.push(split);

        gsap.from(split.lines, {
          yPercent: 110,
          duration: 1.1,
          ease: "swiss",
          stagger: 0.08,
          scrollTrigger: { trigger: lead, start: "top 85%" },
        });
      }

      gsap.from(`.${styles.bioBody}, .${styles.factRow}`, {
        y: 26,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        scrollTrigger: { trigger: `.${styles.top}`, start: "top 70%" },
      });

      // Each skill row wipes in as the matrix scrolls past.
      gsap.utils.toArray<HTMLElement>(`.${styles.group}`).forEach((row) => {
        gsap.from(row.querySelectorAll(`.${styles.skill}`), {
          opacity: 0,
          y: 14,
          duration: 0.6,
          stagger: 0.015,
          scrollTrigger: { trigger: row, start: "top 90%" },
        });
      });

      gsap.fromTo(
        `.${styles.portraitImg}`,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: "none",
          scrollTrigger: {
            trigger: `.${styles.portraitCol}`,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      return () => splits.forEach((s) => s.revert());
    }, root);

    return () => ctx.revert();
  }, []);

  const [lead, ...rest] = profile.bio;

  return (
    <section ref={rootRef} id="about" className={`${styles.about} shell`}>
      <header className={styles.header}>
        <h2 className={styles.headerTitle}>About</h2>
        <span className="meta">02 — Profile</span>
      </header>

      <div className={styles.top}>
        <div className={styles.bio}>
          <p className={styles.bioLead}>{lead}</p>
          {rest.map((para, i) => (
            <p key={i} className={styles.bioBody}>
              {para}
            </p>
          ))}

          <dl className={styles.factRow}>
            {FACTS.map((f) => (
              <div key={f.label} className={styles.fact}>
                <dt className="meta">{f.label}</dt>
                <dd className={styles.factValue}>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <figure className={styles.portraitCol}>
          <div className={styles.portrait} data-hover data-cursor="Hi">
            <Image
              src="/me.png"
              alt={`${profile.name}, ${profile.title}`}
              fill
              className={styles.portraitImg}
              sizes="(max-width: 860px) 320px, 30vw"
            />
          </div>
          <figcaption className={styles.portraitCaption}>
            <span className="meta">{profile.name}</span>
            <span className="meta">Fig. 01</span>
          </figcaption>
        </figure>
      </div>

      <div className={styles.matrix}>
        <div className={styles.matrixHead}>
          <span className="meta">Technical skills</span>
          <span className="meta">
            {skillGroups.reduce((n, g) => n + g.items.length, 0)} entries
          </span>
        </div>

        {skillGroups.map((group, i) => (
          <div key={group.label} className={styles.group}>
            <h3 className={styles.groupLabel}>
              <span className="meta">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="meta">{group.label}</span>
            </h3>
            <div className={styles.groupItems}>
              {group.items.map((item) => (
                <span key={item} className={styles.skill}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
