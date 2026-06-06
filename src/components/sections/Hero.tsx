"use client";

import HeroCanvas from "../3d/HeroCanvas";
import Magnetic from "../ui/Magnetic";
import { Download } from "lucide-react";
import styles from "./Hero.module.css";

export default function Hero() {
  const scrollInto = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className={styles.hero}>
      {/* 3D WebGL Canvas */}
      <HeroCanvas />

      {/* Typography Overlay */}
      <div className={styles.container}>
        <div className={styles.tagline} data-hover>
          <span>Software Engineer</span>
          <span className={styles.divider}>•</span>
          <span>Full-Stack Developer</span>
        </div>

        <h1 className={styles.title}>
          <span className={styles.outline}>SANUTH</span> <br />
          <span className="gradient-text">MANDEPA</span>
        </h1>

        <p className={styles.description}>
          Final-year Software Engineering undergraduate specialising in full-stack
          development, AI/ML integration, and interactive web experiences. Turning
          complex problems into seamless, reliable user experiences.
        </p>

        <div className={styles.ctaGroup}>
          <Magnetic>
            <button onClick={() => scrollInto("projects")} className={`${styles.ctaBtn} ${styles.primary}`}>
              View Projects
            </button>
          </Magnetic>
          <Magnetic>
            <a href="/cv.pdf" download className={`${styles.ctaBtn} ${styles.secondary}`}>
              <Download size={16} />
              Download CV
            </a>
          </Magnetic>
          <Magnetic>
            <button onClick={() => scrollInto("contact")} className={`${styles.ctaBtn} ${styles.tertiary}`}>
              Contact Me
            </button>
          </Magnetic>
        </div>
      </div>

      {/* Interactive Scroll Down Indicator */}
      <div className={styles.scrollDown} onClick={() => scrollInto("about")} data-hover>
        <div className={styles.mouseIcon}>
          <span className={styles.mouseWheel} />
        </div>
        <span className={styles.scrollText}>Scroll Down</span>
      </div>
    </section>
  );
}
