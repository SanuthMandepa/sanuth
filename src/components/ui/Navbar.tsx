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
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const triggers = LINKS.map((s) => {
      const el = document.getElementById(s.id);
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start: "top 45%",
        end: "bottom 45%",
        onToggle: ({ isActive }) => isActive && setActive(s.id),
      });
    });

    return () => triggers.forEach((t) => t?.kill());
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
      scrollTo: { y: el, offsetY: 70, autoKill: true },
      duration: reduced ? 0 : 1,
      ease: "swissInOut",
    });
  };

  return (
    <>
      <nav className={styles.nav} aria-label="Sections">
        <a href="#index" onClick={go("index")} className={styles.mark}>
          <span className={styles.markBadge}>SM</span>
          Sanuth
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
