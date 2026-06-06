"use client";

import { useRef } from "react";
import Image from "next/image";
import styles from "./About.module.css";
import gsap from "gsap";

const skills = [
  "Python",
  "JavaScript",
  "TypeScript",
  "Java",
  "React.js",
  "Next.js",
  "Node.js",
  "Flask",
  "PyTorch",
  "Docker",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Git / GitHub",
  "Google Cloud Run",
  "OpenAI API",
  "LangChain",
  "Figma",
  "GSAP",
  "Tailwind CSS",
  "WordPress",
  "Postman",
];

export default function About() {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const { left, top, width, height } = card.getBoundingClientRect();
    const x = e.clientX - left - width / 2;
    const y = e.clientY - top - height / 2;

    const rotateX = -(y / (height / 2)) * 12;
    const rotateY = (x / (width / 2)) * 12;

    gsap.to(card, {
      rotateX,
      rotateY,
      transformPerspective: 1000,
      ease: "power2.out",
      duration: 0.4,
    });
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      ease: "power2.out",
      duration: 0.5,
    });
  };

  return (
    <section id="about" className={styles.about}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Interactive 3D Card */}
          <div
            className={styles.imageWrapper}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div ref={cardRef} className={`${styles.imageCard} glass`}>
              <div className={styles.imageContainer}>
                <Image
                  src="/me.png"
                  alt="Sanuth Mandepa"
                  fill
                  className={styles.image}
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Description Text */}
          <div className={styles.textCard}>
            <span className={styles.tag}>About Me</span>
            <h2 className={styles.title}>
              SOFTWARE <span className="gradient-text">ENGINEER</span>
            </h2>
            <p className={styles.bio}>
              I&apos;m a final-year Software Engineering undergraduate at the University of
              Westminster (delivered by IIT, Sri Lanka), passionate about turning complex
              problems into seamless, reliable user experiences.
            </p>
            <p className={styles.bio}>
              With a year of industry experience at Weblook International as a Web Designer
              and hands-on work building full-stack projects — from AI-powered interview platforms
              to deep learning medical diagnostics — I&apos;ve developed a versatile foundation spanning
              UI/UX design, backend logic, ML integration, and containerised deployment.
            </p>
            <p className={styles.bio}>
              I thrive in collaborative agile environments. My greatest assets are
              adaptability and a relentless drive to learn.
            </p>

            <div className={styles.skillsSection}>
              <h3 className={styles.skillsTitle}>Tech Stack</h3>
              <div className={styles.skillsGrid}>
                {skills.map((skill) => (
                  <span key={skill} className={`${styles.skillPill} glass`} data-hover>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
