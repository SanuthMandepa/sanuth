"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { sections } from "@/data/content";
import { Magnetic, SwapText } from "@/components/ui/Interactive";
import styles from "./Navbar.module.css";

const LINKS = sections.filter((s) => s.id !== "index");

export default function Navbar() {
  const sheetRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState("");
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  /* Contract the bar once the hero is behind us, and track the section. */
  useEffect(() => {
    const triggers: ScrollTrigger[] = [];

    triggers.push(
      ScrollTrigger.create({
        start: 140,
        end: "max",
        onEnter: () => setCompact(true),
        onLeaveBack: () => setCompact(false),
      })
    );

    // Page progress, written as a CSS variable so no React render is involved.
    triggers.push(
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: ({ progress }) => {
          progressRef.current?.style.setProperty("--p", String(progress));
        },
      })
    );

    LINKS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (!el) return;
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top 45%",
          end: "bottom 45%",
          onToggle: ({ isActive }) => isActive && setActive(s.id),
        })
      );
    });

    return () => triggers.forEach((t) => t.kill());
  }, []);

  useEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    gsap.to(sheet, {
      clipPath: open ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
      duration: reduced ? 0 : 0.5,
      ease: "swissInOut",
    });
  }, [open, reduced]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    gsap.to(window, {
      scrollTo: { y: el, offsetY: 80, autoKill: true },
      duration: reduced ? 0 : 1,
      ease: "swissInOut",
    });
  };

  return (
    <>
      <nav
        className={`${styles.nav} ${compact ? styles.navCompact : ""}`}
        aria-label="Sections"
      >
        <div className={styles.inner}>
          <a href="#index" onClick={go("index")} className={styles.mark}>
            <span className={styles.markBadge}>SM</span>
            <span className={styles.markText}>Sanuth</span>
          </a>

          <ul className={styles.list}>
            {LINKS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={go(s.id)}
                  className={`${styles.link} ${
                    active === s.id ? styles.linkActive : ""
                  }`}
                >
                  <SwapText>{s.label}</SwapText>
                </a>
              </li>
            ))}
          </ul>

          <Magnetic strength={0.2}>
            <a href="#contact" onClick={go("contact")} className={styles.cta}>
              <SwapText>Get in touch</SwapText>
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </a>
          </Magnetic>

          <button
            className={styles.burger}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-sheet"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className={styles.progress} aria-hidden="true">
            <div ref={progressRef} className={styles.progressBar} />
          </div>
        </div>
      </nav>

      <div ref={sheetRef} id="menu-sheet" className={styles.sheet}>
        {LINKS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={go(s.id)}
            className={styles.sheetLink}
          >
            {s.label}
            <span className={styles.sheetNum}>{s.n}</span>
          </a>
        ))}
      </div>
    </>
  );
}
