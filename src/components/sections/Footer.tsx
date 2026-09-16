"use client";

import { useEffect, useRef, useState } from "react";
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

/**
 * The XXL wordmark, sized to fill its container exactly.
 *
 * Set as HTML text it could only ever be centred, so its glyphs landed wherever
 * the text happened to end and never met the gutters the rest of the footer
 * aligns to. As SVG, the viewBox is set to the glyph bounding box, so scaling
 * the svg to 100% width makes the letters span edge to edge by construction.
 */
function Wordmark() {
  const textRef = useRef<SVGTextElement>(null);
  const [viewBox, setViewBox] = useState("0 0 760 200");

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const fit = () => {
      const bb = el.getBBox();
      // Measuring needs a laid-out DOM, so this can only run after mount.
      if (bb.width > 0) {
        setViewBox(`${bb.x} ${bb.y} ${bb.width} ${bb.height}`);
      }
    };

    // Wait for the webfont: measuring earlier returns the fallback's metrics
    // and the wordmark ends up the wrong width.
    const ready = document.fonts?.ready;
    if (ready) ready.then(fit).catch(fit);
    else fit();
  }, []);

  return (
    <svg
      className={styles.wordmark}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMax meet"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="wordmarkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.92)" />
          <stop offset="55%" stopColor="rgba(255,138,0,0.9)" />
          <stop offset="100%" stopColor="rgba(255,81,0,0.18)" />
        </linearGradient>
      </defs>
      <text
        ref={textRef}
        x="0"
        y="200"
        fill="url(#wordmarkFill)"
        style={{
          fontFamily: "var(--font-outfit)",
          fontWeight: 700,
          fontSize: "200px",
          letterSpacing: "-0.05em",
        }}
      >
        SANUTH
      </text>
    </svg>
  );
}

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
          anything. Inside the shell, so it lines up with the columns above. */}
      <div className="shell">
        <Wordmark />
      </div>
    </footer>
  );
}
