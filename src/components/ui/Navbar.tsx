"use client";

import Magnetic from "./Magnetic";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const scrollInto = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className={`${styles.navbar} glass`}>
      <div className={styles.logoContainer}>
        <Magnetic>
          <a href="#" className={styles.logo}>
            SM<span className={styles.logoDot}>.</span>
          </a>
        </Magnetic>
      </div>

      <div className={styles.navLinks}>
        <Magnetic>
          <button onClick={() => scrollInto("about")} className={styles.navLink}>
            About
          </button>
        </Magnetic>
        <Magnetic>
          <button onClick={() => scrollInto("projects")} className={styles.navLink}>
            Work
          </button>
        </Magnetic>
        <Magnetic>
          <button onClick={() => scrollInto("experience")} className={styles.navLink}>
            Timeline
          </button>
        </Magnetic>
        <Magnetic>
          <button onClick={() => scrollInto("contact")} className={styles.navLink}>
            Contact
          </button>
        </Magnetic>
      </div>

      <div className={styles.badgeContainer}>
        <span className={styles.badgeDot} />
        <span className={styles.badgeText}>Available for Hire</span>
      </div>
    </nav>
  );
}
