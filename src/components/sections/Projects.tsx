"use client";

import { useEffect, useRef } from "react";
import styles from "./Projects.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExternalLink } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* Inline SVG for GitHub icon */
const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const projects = [
  {
    title: "ChagaSight",
    subtitle: "Dual-Pathway Vision Transformer for Chagas Disease Detection",
    category: "Deep Learning / Medical AI",
    tags: ["Python", "PyTorch", "Flask", "React.js", "Docker", "HuggingFace"],
    bgGradient: "linear-gradient(135deg, #0d001a 0%, #1e003b 100%)",
    glowColor: "rgba(189, 0, 255, 0.4)",
    github: "https://github.com/SanuthMandepa",
    live: "#",
    highlights: [
      "173M-parameter hybrid 1D + 2D ViT ensemble",
      "AUROC 0.8707 on 5-fold cross-validation",
      "Deployed to HuggingFace Spaces + Vercel",
    ],
  },
  {
    title: "Internova",
    subtitle: "AI-Powered Interview Preparation Platform",
    category: "Full-Stack / AI",
    tags: ["Flask", "React.js", "LangChain", "OpenAI", "Docker", "GCP"],
    bgGradient: "linear-gradient(135deg, #001a1a 0%, #003636 100%)",
    glowColor: "rgba(0, 240, 255, 0.4)",
    github: "https://github.com/SanuthMandepa",
    live: "#",
    highlights: [
      "Speech emotion analysis with MFCC extraction",
      "RAG-powered contextual feedback",
      "Containerised & deployed on Google Cloud Run",
    ],
  },
  {
    title: "Online Shopping System",
    subtitle: "Desktop GUI Application",
    category: "Object-Oriented Design",
    tags: ["Java", "Java Swing", "OOP"],
    bgGradient: "linear-gradient(135deg, #1f0a00 0%, #3d1400 100%)",
    glowColor: "rgba(255, 140, 0, 0.4)",
    github: "https://github.com/SanuthMandepa",
    live: "#",
    highlights: [
      "Product tracking & user management",
      "MVC architecture with Swing UI",
      "Complete shopping lifecycle",
    ],
  },
  {
    title: "University Progression Predictor",
    subtitle: "Academic Outcome Prediction Tool",
    category: "Python / Data Processing",
    tags: ["Python", "CLI", "Data Analysis"],
    bgGradient: "linear-gradient(135deg, #000c1a 0%, #001b38 100%)",
    glowColor: "rgba(0, 100, 255, 0.4)",
    github: "https://github.com/SanuthMandepa",
    live: "#",
    highlights: [
      "Predicts student progression outcomes",
      "Credit-based academic input system",
      "Statistical analysis & reporting",
    ],
  },
];

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    const container = containerRef.current;
    if (!row || !container) return;

    const scrollWidth = row.scrollWidth - window.innerWidth;
    if (scrollWidth <= 0) return;

    const ctx = gsap.context(() => {
      gsap.to(row, {
        x: -scrollWidth,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 0.8,
          start: "top top",
          end: () => `+=${row.scrollWidth}`,
          invalidateOnRefresh: true,
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="projects" className={styles.projectsContainer}>
      <div className={styles.header}>
        <span className={styles.tag}>Selected Work</span>
        <h2 className={styles.title}>
          FEATURED <span className="gradient-text">PROJECTS</span>
        </h2>
      </div>

      <div ref={rowRef} className={styles.row}>
        {projects.map((project, i) => (
          <div
            key={i}
            className={`${styles.card} glass`}
            style={{ "--card-glow": project.glowColor } as React.CSSProperties}
            data-hover
          >
            <div className={styles.cardHeader}>
              <span className={styles.category}>{project.category}</span>
              <div className={styles.links}>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.iconLink}
                >
                  <GithubIcon />
                </a>
                {project.live !== "#" && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.iconLink}
                  >
                    <ExternalLink size={18} />
                  </a>
                )}
              </div>
            </div>

            <div
              className={styles.thumbnail}
              style={{ background: project.bgGradient }}
            >
              <div className={styles.thumbnailGlow} />
              <div className={styles.thumbnailContent}>
                <h4 className={styles.thumbnailTitle}>{project.subtitle}</h4>
                <ul className={styles.highlightList}>
                  {project.highlights.map((h, idx) => (
                    <li key={idx} className={styles.highlightItem}>
                      <span className={styles.highlightDot} />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={styles.cardFooter}>
              <h3 className={styles.projectTitle}>{project.title}</h3>
              <div className={styles.tags}>
                {project.tags.map((t) => (
                  <span key={t} className={styles.tagPill}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
