"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText, prefersReducedMotion } from "@/lib/gsap";
import { profile } from "@/data/content";
import styles from "./Contact.module.css";

const CHANNELS = [
  { n: "01", label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  {
    n: "02",
    label: "Phone",
    value: profile.phoneDisplay,
    href: `tel:${profile.phoneHref}`,
  },
  { n: "03", label: "LinkedIn", value: "in/sanuthmandepa", href: profile.linkedin },
  { n: "04", label: "GitHub", value: "SanuthMandepa", href: profile.github },
];

export default function Contact() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const splits: SplitText[] = [];

      const statement = root.querySelector<HTMLElement>(`.${styles.statement}`);
      if (statement) {
        const split = new SplitText(statement, {
          type: "lines",
          linesClass: "contactLine",
          mask: "lines",
        });
        splits.push(split);

        gsap.from(split.lines, {
          yPercent: 115,
          duration: 1.15,
          ease: "swiss",
          stagger: 0.09,
          scrollTrigger: { trigger: statement, start: "top 85%" },
        });
      }

      gsap.from(`.${styles.channel}`, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.07,
        scrollTrigger: { trigger: `.${styles.channels}`, start: "top 82%" },
      });

      gsap.from(`.${styles.footWord}`, {
        yPercent: 40,
        opacity: 0,
        duration: 1.1,
        scrollTrigger: { trigger: `.${styles.footer}`, start: "top 88%" },
      });

      return () => splits.forEach((s) => s.revert());
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="contact" className={`${styles.contact} shell`}>
      <header className={styles.header}>
        <h2 className="meta">04 — Contact</h2>
        <span className="meta">
          {profile.available ? "Open to graduate roles" : "Not currently available"}
        </span>
      </header>

      <p className={styles.statement}>
        Let&apos;s build <em>something</em> good.
      </p>

      <div className={styles.channels}>
        {CHANNELS.map((c) => (
          <a
            key={c.n}
            href={c.href}
            target={c.href.startsWith("http") ? "_blank" : undefined}
            rel={c.href.startsWith("http") ? "noreferrer" : undefined}
            className={styles.channel}
            data-hover
            data-cursor={c.label}
          >
            <span className="meta">{c.n}</span>
            <span className={styles.channelValue}>{c.value}</span>
            <span className={styles.channelArrow} aria-hidden="true">
              ↗
            </span>
          </a>
        ))}
      </div>

      <footer className={styles.footer}>
        <div className={styles.footMark}>
          <span className={styles.footWord}>Sanuth</span>
          <span className="meta">{profile.title}</span>
        </div>

        <div className={styles.footCols}>
          <div className={styles.footCol}>
            <span className="meta">Site</span>
            <a href="#index" className={styles.footLink}>
              Index
            </a>
            <a href="#work" className={styles.footLink}>
              Work
            </a>
            <a href="#about" className={styles.footLink}>
              About
            </a>
            <a href="#record" className={styles.footLink}>
              Record
            </a>
          </div>

          <div className={styles.footCol}>
            <span className="meta">Elsewhere</span>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className={styles.footLink}
            >
              GitHub
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className={styles.footLink}
            >
              LinkedIn
            </a>
            <a href={profile.cv} download className={styles.footLink}>
              Curriculum vitae
            </a>
          </div>

          <div className={styles.footCol}>
            <span className="meta">Located</span>
            <span className={styles.footLink}>{profile.location}</span>
            <span className={styles.footLink}>UTC +05:30</span>
          </div>
        </div>

        <div className={styles.colophon}>
          <span className="meta">
            © {new Date().getFullYear()} {profile.name}
          </span>
          <span className="meta">Set in Archivo &amp; JetBrains Mono</span>
          <span className="meta">Built with Next.js, GSAP &amp; Lenis</span>
        </div>
      </footer>
    </section>
  );
}
