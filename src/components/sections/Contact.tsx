"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { GithubMark, LinkedinMark } from "@/lib/icons";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { profile } from "@/data/content";
import styles from "./Contact.module.css";

const CHANNELS = [
  {
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
    Icon: Mail,
    external: false,
  },
  {
    label: "Phone",
    value: profile.phoneDisplay,
    href: `tel:${profile.phoneHref}`,
    Icon: Phone,
    external: false,
  },
  {
    label: "LinkedIn",
    value: "in/sanuthmandepa",
    href: profile.linkedin,
    Icon: LinkedinMark,
    external: true,
  },
  {
    label: "GitHub",
    value: "SanuthMandepa",
    href: profile.github,
    Icon: GithubMark,
    external: true,
  },
];

export default function Contact() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      gsap.from(`.${styles.title}`, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "swiss",
        scrollTrigger: { trigger: root, start: "top 75%" },
      });

      gsap.from(`.${styles.card}`, {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "swiss",
        scrollTrigger: { trigger: `.${styles.grid}`, start: "top 85%" },
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      id="contact"
      className={`${styles.contact} surface-night`}
    >
      <div className={styles.glow} aria-hidden="true" />

      <div className={`${styles.inner} shell`}>
        <span className="eyebrow">Contact</span>

        <h2 className={styles.title}>
          Let us build <span className="grad-text">something good</span>
        </h2>

        <div className={styles.grid}>
          {CHANNELS.map(({ label, value, href, Icon, external }) => (
            <a
              key={label}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
              className={styles.card}
            >
              <span className={styles.cardIcon}>
                <Icon size={28} />
              </span>
              <span className={styles.cardLabel}>{label}</span>
              <span className={styles.cardValue}>
                {value}
                <ArrowUpRight size={16} strokeWidth={2.5} />
              </span>
            </a>
          ))}
        </div>

        <footer className={styles.footer}>
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <div className={styles.footerLinks}>
            <a href="#work" className={styles.footerLink}>
              Work
            </a>
            <a href="#about" className={styles.footerLink}>
              About
            </a>
            <a href="#record" className={styles.footerLink}>
              Record
            </a>
            <a href={profile.cv} download className={styles.footerLink}>
              CV
            </a>
          </div>
        </footer>
      </div>
    </section>
  );
}
