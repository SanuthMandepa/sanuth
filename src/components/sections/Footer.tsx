"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { Magnetic, SwapText } from "@/components/ui/Interactive";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { profile } from "@/data/content";
import styles from "./Footer.module.css";

const ParticleField = dynamic(() => import("@/components/3d/ParticleField"), {
  ssr: false,
});

const COLS = [
  {
    head: "Site",
    links: [
      { label: "Work", href: "#work" },
      { label: "About", href: "#about" },
      { label: "Record", href: "#record" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    head: "Elsewhere",
    links: [
      { label: "GitHub", href: profile.github, external: true },
      { label: "LinkedIn", href: profile.linkedin, external: true },
      { label: "Download CV", href: profile.cv },
    ],
  },
  {
    head: "Reach me",
    links: [
      { label: profile.email, href: `mailto:${profile.email}` },
      { label: profile.phoneDisplay, href: `tel:${profile.phoneHref}` },
    ],
  },
];

export default function Footer() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      gsap.from(`.${styles.wordmark}`, {
        yPercent: 22,
        opacity: 0,
        duration: 1.2,
        ease: "swiss",
        scrollTrigger: { trigger: `.${styles.wordmark}`, start: "top 95%" },
      });

      gsap.from(`.${styles.col}`, {
        y: 26,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "swiss",
        scrollTrigger: { trigger: `.${styles.cols}`, start: "top 88%" },
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  const toTop = (e: React.MouseEvent) => {
    e.preventDefault();
    gsap.to(window, {
      scrollTo: 0,
      duration: reduced ? 0 : 1.2,
      ease: "swissInOut",
    });
  };

  return (
    <footer ref={rootRef} className={`${styles.footer} surface-night`}>
      <ParticleField className={styles.field} />
      <div className={styles.glow} aria-hidden="true" />

      <div className={`${styles.inner} shell`}>
        <div className={styles.top}>
          <p className={styles.kicker}>
            Open to graduate software engineering roles, and always happy to
            talk about <span className="serif">machine learning</span>.
          </p>
          <Magnetic strength={0.24}>
            <a href={`mailto:${profile.email}`} className={styles.mailto}>
              <SwapText>Start a conversation</SwapText>
              <ArrowUpRight size={20} strokeWidth={2.5} />
            </a>
          </Magnetic>
        </div>

        <div className={styles.cols}>
          {COLS.map((col) => (
            <div key={col.head} className={styles.col}>
              <span className={styles.colHead}>{col.head}</span>
              {col.links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target={"external" in l && l.external ? "_blank" : undefined}
                  rel={"external" in l && l.external ? "noreferrer" : undefined}
                  className={`${styles.link} wipe-link`}
                >
                  {l.label}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className={styles.colophon}>
          <span>
            © {new Date().getFullYear()} {profile.name}. {profile.location}.
          </span>
          <a href="#index" onClick={toTop} className={styles.toTop}>
            Back to top
            <ArrowUp size={16} strokeWidth={2.5} />
          </a>
        </div>
      </div>

      {/* Last element, so it can bleed off the bottom edge without covering
          anything. Sits outside the shell to reach both gutters. */}
      <span className={styles.wordmark} aria-hidden="true">
        SANUTH
      </span>
    </footer>
  );
}
