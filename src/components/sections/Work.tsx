"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, ImageIcon } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { getIcon, GithubMark } from "@/lib/icons";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { projects, type Project } from "@/data/content";
import styles from "./Work.module.css";

const STATUS: Record<Project["status"], string> = {
  shipped: "Shipped",
  building: "In progress",
  research: "Research",
  archived: "Archived",
};

export default function Work() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(`.${styles.card}`);

      cards.forEach((card, i) => {
        // Entry: each card rises as it comes into view.
        gsap.from(card, {
          y: 60,
          opacity: 0,
          duration: 0.8,
          ease: "swiss",
          scrollTrigger: { trigger: card, start: "top 88%" },
        });

        // Stacking: every card except the last shrinks and dims as the next
        // one slides over it, so the pile reads as depth rather than clutter.
        if (i === cards.length - 1) return;

        gsap.to(card, {
          scale: 0.94,
          opacity: 0.55,
          ease: "none",
          scrollTrigger: {
            trigger: cards[i + 1],
            start: "top bottom",
            end: "top top+=120",
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
        <header className="section-head">
          <span className="eyebrow">Selected work</span>
          <h2 className="section-title">
            Five things I <span className="grad-text">built and shipped</span>
          </h2>
        </header>

        <div className={styles.stack}>
          {projects.map((project, i) => {
            const Icon = getIcon(project.icon);
            return (
              <div
                key={project.slug}
                className={styles.sticky}
                style={{ "--i": i } as React.CSSProperties}
              >
                <article className={styles.card}>
                  <div className={styles.left}>
                    <div className={styles.head}>
                      <span className={styles.iconTile}>
                        <Icon size={34} strokeWidth={2} />
                      </span>
                      <span className={styles.headText}>
                        <h3 className={styles.title}>{project.title}</h3>
                        <span className={styles.subtitle}>
                          {project.subtitle}
                        </span>
                      </span>
                    </div>

                    <div className={styles.meta}>
                      <span className={styles.tag}>{project.discipline}</span>
                      <span className={`${styles.tag} ${styles.tagPlain}`}>
                        {STATUS[project.status]}
                      </span>
                      <span className={`${styles.tag} ${styles.tagPlain}`}>
                        {project.period}
                      </span>
                    </div>

                    <p className={styles.summary}>{project.summary}</p>

                    <ul className={styles.points}>
                      {project.highlights.map((h) => (
                        <li key={h} className={styles.point}>
                          <span className={styles.pointDot} aria-hidden="true">
                            ◆
                          </span>
                          {h}
                        </li>
                      ))}
                    </ul>

                    <div className={styles.meta}>
                      {project.stack.map((s) => (
                        <span
                          key={s}
                          className={`${styles.tag} ${styles.tagPlain}`}
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    {project.metrics.length > 0 && (
                      <div className={styles.metrics}>
                        {project.metrics.map((m) => (
                          <div key={m.label} className={styles.metric}>
                            <span className={styles.metricValue}>
                              {m.value}
                            </span>
                            <span className={styles.metricLabel}>
                              {m.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className={styles.links}>
                      {project.links.live ? (
                        <a
                          href={project.links.live}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.link}
                        >
                          Live site
                          <ArrowUpRight size={16} strokeWidth={2.5} />
                        </a>
                      ) : (
                        <span className={`${styles.link} ${styles.linkOff}`}>
                          Link coming soon
                        </span>
                      )}
                      {project.links.github && (
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.link}
                        >
                          <GithubMark size={16} />
                          Source
                        </a>
                      )}
                    </div>
                  </div>

                  <div className={styles.visual}>
                    {project.cover ? (
                      <Image
                        src={project.cover}
                        alt={`${project.title}, ${project.subtitle}`}
                        fill
                        className={styles.visualImg}
                        sizes="(max-width: 900px) 100vw, 40vw"
                      />
                    ) : (
                      <div className={styles.ph}>
                        <span className={styles.phIcon}>
                          <ImageIcon size={40} strokeWidth={1.75} />
                        </span>
                        <span className={styles.phText}>Screenshot soon</span>
                      </div>
                    )}
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
