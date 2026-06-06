"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./Preloader.module.css";

const words = [
  "HELLO",
  "DESIGN",
  "CODE",
  "THREE.JS",
  "ANIMATION",
  "GSAP",
  "CREATIVITY",
  "PORTFOLIO",
];

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    // 1. Percentage counter animation
    const counterObj = { value: 0 };
    const counterAnim = gsap.to(counterObj, {
      value: 100,
      duration: 2.2,
      ease: "power2.out",
      onUpdate: () => {
        setCount(Math.floor(counterObj.value));
      },
    });

    // 2. Word ticker animation
    const wordInterval = setInterval(() => {
      setWordIndex((prev) => (prev < words.length - 1 ? prev + 1 : prev));
    }, 280);

    // 3. Exit animation
    counterAnim.then(() => {
      clearInterval(wordInterval);
      setWordIndex(words.length - 1); // Stay on final word

      const tl = gsap.timeline({
        onComplete: () => {
          onComplete();
        },
      });

      // Fade out textual elements
      tl.to([counterRef.current, wordRef.current], {
        opacity: 0,
        y: -50,
        duration: 0.4,
        ease: "power2.inOut",
      });

      // Liquid morphing slide up
      tl.to(
        pathRef.current,
        {
          attr: { d: "M0 0 L100 0 L100 30 Q50 60 0 30 Z" },
          duration: 0.6,
          ease: "power2.in",
        },
        "-=0.2"
      ).to(pathRef.current, {
        attr: { d: "M0 0 L100 0 L100 0 Q50 0 0 0 Z" },
        duration: 0.6,
        ease: "power2.out",
      });

      tl.to(
        containerRef.current,
        {
          yPercent: -100,
          duration: 0.8,
          ease: "power2.inOut",
        },
        "-=0.9"
      );
    });

    return () => {
      clearInterval(wordInterval);
    };
  }, [onComplete]);

  return (
    <div ref={containerRef} className={styles.preloader}>
      {/* SVG Liquid Overlay */}
      <svg className={styles.svg} viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          ref={pathRef}
          d="M0 0 L100 0 L100 100 Q50 100 0 100 Z"
          fill="var(--bg-secondary)"
        />
      </svg>

      {/* Content */}
      <div className={styles.content}>
        <div ref={wordRef} className={styles.word}>
          <span className={styles.dot} />
          {words[wordIndex]}
        </div>
        <div ref={counterRef} className={styles.counter}>
          {count}%
        </div>
      </div>
    </div>
  );
}
