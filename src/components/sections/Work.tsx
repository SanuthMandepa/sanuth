"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion } from "@/lib/gsap";
import { projects, type Project } from "@/data/content";
import styles from "./Work.module.css";

const STATUS_LABEL: Record<Project["status"], string> = {
  shipped: "Shipped",
  building: "In progress",
  research: "Research",
  archived: "Archived",
};

/** Lets a metric like "30/30" or "0.8707" carry the accent on its key part. */
function MetricValue({ value }: { value: string }) {
  const slash = value.indexOf("/");
  if (slash === -1) return <>{value}</>;
  return (
    <>
      <em>{value.slice(0, slash)}</em>
      {value.slice(slash)}
    </>
  );
}

function Visual({ project }: { project: Project }) {
  if (project.cover) {
    return (
      <div className={styles.frame}>
        <div className={styles.frameInner} data-parallax>
          <Image
            src={project.cover}
            alt={`${project.title} — ${project.subtitle}`}
            fill
            className={styles.frameImg}
            sizes="(max-width: 860px) 100vw, 50vw"
          />
        </div>
      </div>
    );
  }

  // Designed stand-in: reads as an intentional panel, and swaps for a real
  // screenshot with no layout change the moment `cover` is filled in.
  return (
    <div className={styles.frame}>
      <div className={styles.placeholder} data-parallax>
        <span className={styles.phWatermark} aria-hidden="true">
          {project.index}
        </span>
        <span className={styles.phTitle}>{project.title}</span>
        <span className={styles.phFoot}>
          <span className={styles.phStack}>
            {project.stack.slice(0, 5).join(" · ")}
          </span>
          <span className="meta">{project.discipline}</span>
        </span>
      </div>
    </div>
  );
}

export default function Work() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
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

      gsap.set(root.querySelectorAll("[data-reveal]"), { visibility: "visible" });

      // Case titles break into characters and rise as each case arrives.
      gsap.utils.toArray<HTMLElement>(`.${styles.title}`).forEach((title) => {
        // Split to words as well as chars: with chars alone the line can break
        // between any two letters, which turned "Emberloft" into "EMBERLO /
        // FT STUDIO". Wrapping words keeps them whole.
        const split = new SplitText(title, {
          type: "words,chars",
          charsClass: "workChar",
        });
        splits.push(split);

        gsap.from(split.chars, {
          yPercent: 115,
          duration: 1,
          ease: "swiss",
          stagger: 0.02,
          scrollTrigger: { trigger: title, start: "top 88%" },
        });
      });

      // Supporting copy fades up a beat behind its title.
      gsap.utils.toArray<HTMLElement>(`.${styles.case}`).forEach((el) => {
        gsap.from(el.querySelectorAll("[data-stagger]"), {
          y: 28,
          opacity: 0,
          duration: 0.9,
          stagger: 0.07,
          ease: "swiss",
          scrollTrigger: { trigger: el, start: "top 72%" },
        });
      });

      // Metric numbers count up when they land — the figures are the point.
      gsap.utils.toArray<HTMLElement>(`.${styles.metricValue}`).forEach((el) => {
        const raw = el.dataset.value ?? "";
        const numeric = Number(raw);
        if (!raw || Number.isNaN(numeric)) return;

        const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
        const obj = { v: 0 };

        gsap.to(obj, {
          v: numeric,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
          onUpdate: () => {
            el.textContent = obj.v.toFixed(decimals);
          },
        });
      });

      // Parallax: each visual panel drifts against its text column.
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      ScrollTrigger.refresh();

      return () => splits.forEach((s) => s.revert());
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="work" className={`${styles.work} shell`}>
      <header className={styles.header} data-reveal data-stagger>
        <h2 className={styles.headerTitle}>Selected Work</h2>
        <span className="meta">
          {projects.length} projects — 2023 / 2026
        </span>
      </header>

      {projects.map((project, i) => (
        <article
          key={project.slug}
          className={`${styles.case} ${i % 2 === 1 ? styles.flip : ""}`}
        >
          <div className={styles.caseMeta} data-stagger>
            <span className={styles.caseIndex}>{project.index}</span>
            <span className="meta">{project.discipline}</span>
            <span className="meta">{project.period}</span>
            <span className={`${styles.status} meta`}>
              <span
                className={`${styles.statusDot} ${
                  project.status === "shipped"
                    ? styles.statusShipped
                    : project.status === "building"
                      ? styles.statusBuilding
                      : ""
                }`}
              />
              {STATUS_LABEL[project.status]}
            </span>
          </div>

          <div className={styles.body}>
            <div className={styles.text}>
              <h3 className={styles.title} data-reveal>
                {project.title}
              </h3>
              <p className={styles.subtitle} data-stagger>
                {project.subtitle}
              </p>
              <p className={styles.summary} data-stagger>
                {project.summary}
              </p>

              {(project.role || project.context) && (
                <div className={styles.role} data-stagger>
                  {project.role && (
                    <span className="meta">Role — {project.role}</span>
                  )}
                  {project.context && (
                    <span className="meta">{project.context}</span>
                  )}
                </div>
              )}

              <ul className={styles.stack} data-stagger>
                {project.stack.map((s) => (
                  <li key={s} className={styles.chip}>
                    {s}
                  </li>
                ))}
              </ul>

              <div className={styles.links} data-stagger>
                {project.links.live ? (
                  <a
                    href={project.links.live}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.link}
                    data-hover
                    data-cursor="Open"
                  >
                    Live <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <span className={`${styles.link} ${styles.linkPending}`}>
                    Live — link pending
                  </span>
                )}

                {project.links.github ? (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.link}
                    data-hover
                    data-cursor="Code"
                  >
                    Source <span aria-hidden="true">↗</span>
                  </a>
                ) : null}
              </div>
            </div>

            <div className={styles.visual} data-stagger>
              <Visual project={project} />
            </div>

            {project.metrics.length > 0 && (
              <div className={styles.metrics}>
                {project.metrics.map((m) => {
                  const numeric = Number(m.value);
                  const countable = !Number.isNaN(numeric) && m.value !== "";
                  return (
                    <div key={m.label} className={styles.metric}>
                      <span
                        className={styles.metricValue}
                        data-value={countable ? m.value : undefined}
                      >
                        {countable ? m.value : <MetricValue value={m.value} />}
                      </span>
                      <span className="meta">{m.label}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {project.highlights.length > 0 && (
              <ul className={styles.highlights}>
                {project.highlights.map((h, idx) => (
                  <li key={idx} className={styles.highlight} data-stagger>
                    <span className={styles.highlightMark}>
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </article>
      ))}
    </section>
  );
}
