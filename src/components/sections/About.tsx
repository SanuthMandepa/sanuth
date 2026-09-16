"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { getIcon } from "@/lib/icons";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { profile, skillGroups } from "@/data/content";
import styles from "./About.module.css";

const FACTS = [
  { label: "Based in", value: profile.location },
  { label: "Degree", value: "BEng (Hons), 2:1" },
  { label: "Placement", value: "12 months" },
];

export default function About() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      gsap.from(`.${styles.bio} > *, .${styles.fact}`, {
        y: 28,
        opacity: 0,
        duration: 0.7,
        stagger: 0.07,
        ease: "swiss",
        scrollTrigger: { trigger: `.${styles.top}`, start: "top 78%" },
      });

      gsap.from(`.${styles.portraitWrap}`, {
        scale: 0.9,
        opacity: 0,
        duration: 0.9,
        ease: "swiss",
        scrollTrigger: { trigger: `.${styles.top}`, start: "top 78%" },
      });

      gsap.from(`.${styles.skillCard}`, {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "swiss",
        scrollTrigger: { trigger: `.${styles.skills}`, start: "top 85%" },
      });

      gsap.fromTo(
        `.${styles.portraitImg}`,
        { yPercent: -4 },
        {
          yPercent: 4,
          ease: "none",
          scrollTrigger: {
            trigger: `.${styles.portraitWrap}`,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  const [lead, ...rest] = profile.bio;

  return (
    <section ref={rootRef} id="about" className={`${styles.about} surface-sand`}>
      <div className="shell">
        <header className="section-head">
          <span className="eyebrow">About</span>
          <h2 className="section-title">
            Across the stack, <span className="grad-text">not in one lane</span>
          </h2>
        </header>

        <div className={styles.top}>
          <div className={styles.bio}>
            <p className={styles.bioLead}>{lead}</p>
            {rest.map((para, i) => (
              <p key={i} className={styles.bioBody}>
                {para}
              </p>
            ))}

            <div className={styles.facts}>
              {FACTS.map((f) => (
                <div key={f.label} className={styles.fact}>
                  <span className={styles.factValue}>{f.value}</span>
                  <span className={styles.factLabel}>{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.portraitWrap}>
            <div className={styles.portrait}>
              <Image
                src="/me.png"
                alt={`${profile.name}, ${profile.title}`}
                fill
                className={styles.portraitImg}
                sizes="(max-width: 860px) 260px, 340px"
              />
            </div>
          </div>
        </div>

        <div className={styles.skills}>
          {skillGroups.map((group) => {
            const Icon = getIcon(group.icon);
            return (
              <div key={group.label} className={styles.skillCard}>
                <span className={styles.skillIcon}>
                  <Icon size={30} strokeWidth={2} />
                </span>
                <h3 className={styles.skillLabel}>{group.label}</h3>
                <div className={styles.skillItems}>
                  {group.items.map((item) => (
                    <span key={item} className={styles.chip}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
