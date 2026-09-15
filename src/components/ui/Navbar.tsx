"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { sections } from "@/data/content";
import styles from "./Navbar.module.css";

const NAV_SECTIONS = sections.filter((s) => s.id !== "index");

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // The inline head script resolves the theme before hydration, so the real
    // value only exists on the client — reading it during render would not
    // match what the server produced.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(
      (document.documentElement.getAttribute("data-theme") as
        | "light"
        | "dark") ?? "light"
    );
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* Private mode — the choice just won't persist. */
    }
    setTheme(next);
  };

  /* Reveal the bar once the hero is behind us, and track the current section. */
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const ctx = gsap.context(() => {
      const hero = document.getElementById("index");

      if (hero) {
        ScrollTrigger.create({
          trigger: hero,
          start: "bottom 85%",
          onEnter: () =>
            gsap.to(nav, { opacity: 1, y: 0, duration: 0.6, ease: "swiss" }),
          onLeaveBack: () =>
            gsap.to(nav, {
              opacity: 0,
              yPercent: -100,
              duration: 0.4,
              ease: "swissIn",
            }),
        });
      }

      NAV_SECTIONS.forEach((s) => {
        const el = document.getElementById(s.id);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top 45%",
          end: "bottom 45%",
          onToggle: ({ isActive }) => isActive && setActive(s.id),
        });
      });
    }, nav);

    return () => ctx.revert();
  }, []);

  /* The mobile overlay wipes down, then its rows rise in. */
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const rows = overlay.querySelectorAll(`.${styles.overlayLink}`);
    const instant = prefersReducedMotion();

    if (open) {
      gsap
        .timeline()
        .to(overlay, {
          clipPath: "inset(0 0 0% 0)",
          duration: instant ? 0 : 0.7,
          ease: "swissInOut",
        })
        .from(
          rows,
          {
            yPercent: 110,
            opacity: 0,
            duration: instant ? 0 : 0.6,
            stagger: 0.05,
          },
          "-=0.35"
        );
    } else {
      gsap.to(overlay, {
        clipPath: "inset(0 0 100% 0)",
        duration: instant ? 0 : 0.5,
        ease: "swissIn",
      });
    }
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    // offsetY matches the bar's height — ScrollToPlugin ignores scroll-margin.
    gsap.to(window, {
      scrollTo: { y: el, offsetY: id === "index" ? 0 : 72, autoKill: true },
      duration: prefersReducedMotion() ? 0 : 1.1,
      ease: "swissInOut",
    });
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`${styles.nav} ${styles.navVisible}`}
        aria-label="Sections"
      >
        <a
          href="#index"
          onClick={go("index")}
          className={styles.mark}
          data-hover
          data-cursor="Top"
        >
          SM<span className={styles.markDot}>°</span>
        </a>

        <ul className={styles.list}>
          {NAV_SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={go(s.id)}
                className={`${styles.link} ${
                  active === s.id ? styles.linkActive : ""
                }`}
                data-hover
              >
                <span className={styles.linkNum}>{s.n}</span>
                {s.label}
              </a>
            </li>
          ))}
          <li>
            <button
              onClick={toggleTheme}
              className={styles.toggle}
              aria-label={`Switch to ${
                theme === "dark" ? "light" : "dark"
              } theme`}
              data-hover
            >
              <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true">
                {theme === "dark" ? (
                  <g
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <circle cx="12" cy="12" r="4.5" />
                    <path d="M12 1.5v2M12 20.5v2M22.5 12h-2M3.5 12h-2M19.4 4.6l-1.4 1.4M6 18l-1.4 1.4M19.4 19.4L18 18M6 6L4.6 4.6" />
                  </g>
                ) : (
                  <path
                    fill="currentColor"
                    d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
                  />
                )}
              </svg>
            </button>
          </li>
        </ul>

        <button
          className={styles.menuBtn}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? "Close" : "Menu"}
          <span className={styles.burger} aria-hidden="true">
            <span
              style={{ transform: open ? "translateY(2.5px) rotate(45deg)" : "" }}
            />
            <span
              style={{
                transform: open ? "translateY(-2.5px) rotate(-45deg)" : "",
              }}
            />
          </span>
        </button>
      </nav>

      <div ref={overlayRef} id="mobile-menu" className={styles.overlay}>
        {NAV_SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={go(s.id)}
            className={styles.overlayLink}
          >
            <span className={styles.overlayNum}>{s.n}</span>
            {s.label}
          </a>
        ))}
        <button
          onClick={toggleTheme}
          className={styles.overlayLink}
          style={{ textAlign: "left" }}
        >
          <span className={styles.overlayNum}>—</span>
          {theme === "dark" ? "Light" : "Dark"}
        </button>
      </div>
    </>
  );
}
