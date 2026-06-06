"use client";

import { useEffect, useRef } from "react";
import styles from "./Experience.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const timelineEvents = [
  {
    year: "Aug 2025 – Present",
    role: "Final Year Project – ChagaSight",
    company: "University of Westminster / IIT Sri Lanka",
    type: "education",
    desc: "Designing a 173M-parameter dual-pathway Vision Transformer ensemble for Chagas disease detection from 12-lead ECG recordings. Achieving AUROC of 0.8707 with self-supervised pretraining across 366K+ unlabelled ECG records.",
  },
  {
    year: "Aug 2024 – Aug 2025",
    role: "Intern Web Designer",
    company: "Weblook International PVT Ltd, Colombo 07",
    type: "work",
    desc: "Designed and implemented responsive production websites using Figma, WordPress (Elementor, Divi, WooCommerce). Performed QA testing, created interactive animations with GSAP, and contributed video editing with After Effects and Photoshop.",
  },
  {
    year: "Sep 2023 – Jun 2024",
    role: "Team Lead – Internova Platform",
    company: "Software Development Group Project",
    type: "project",
    desc: "Led a team building a full-stack AI-powered interview preparation platform. Implemented speech emotion analysis, RAG-based feedback, and containerised deployment using Docker on Google Cloud Run.",
  },
  {
    year: "2022 – Present",
    role: "BEng (Hons) Software Engineering",
    company: "University of Westminster, delivered by IIT Sri Lanka",
    type: "education",
    desc: "Studying software engineering with focus on full-stack development, AI/ML, cloud computing, and agile methodologies.",
  },
  {
    year: "2012 – 2021",
    role: "G.C.E. Advanced Levels – Biological Science",
    company: "Ananda College, Sri Lanka",
    type: "education",
    desc: "Completed Advanced Level examinations in the Biological Science stream.",
  },
];

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    const container = containerRef.current;
    if (!path || !container) return;

    const pathLength = path.getTotalLength();
    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    const ctx = gsap.context(() => {
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top 60%",
          end: "bottom 60%",
          scrub: 0.5,
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "work":
        return { label: "WORK", color: "var(--accent-cyan)" };
      case "education":
        return { label: "EDUCATION", color: "var(--accent-purple)" };
      case "project":
        return { label: "PROJECT", color: "#ff8c00" };
      default:
        return { label: "OTHER", color: "var(--text-muted)" };
    }
  };

  return (
    <section id="experience" ref={containerRef} className={styles.experience}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.tag}>Timeline</span>
          <h2 className={styles.title}>
            EXPERIENCE &amp; <span className="gradient-text">EDUCATION</span>
          </h2>
        </div>

        <div className={styles.timeline}>
          <div className={styles.lineWrapper}>
            <svg viewBox="0 0 10 100" preserveAspectRatio="none" className={styles.lineSvg}>
              <path
                ref={pathRef}
                d="M 5 0 L 5 100"
                fill="none"
                stroke="var(--accent-cyan)"
                strokeWidth="2.5"
              />
            </svg>
          </div>

          <div className={styles.events}>
            {timelineEvents.map((evt, i) => {
              const badge = getTypeBadge(evt.type);
              return (
                <div key={i} className={styles.eventRow}>
                  <div className={styles.node} style={{ borderColor: badge.color, boxShadow: `0 0 10px ${badge.color}` }} />
                  <div className={`${styles.card} glass`} data-hover>
                    <div className={styles.cardTop}>
                      <span className={styles.year}>{evt.year}</span>
                      <span className={styles.typeBadge} style={{ color: badge.color, borderColor: badge.color }}>
                        {badge.label}
                      </span>
                    </div>
                    <h3 className={styles.role}>{evt.role}</h3>
                    <h4 className={styles.company}>{evt.company}</h4>
                    <p className={styles.desc}>{evt.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
