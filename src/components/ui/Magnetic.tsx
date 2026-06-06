"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface MagneticProps {
  children: React.ReactElement<any>;
}

export default function Magnetic({ children }: MagneticProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = container.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const distanceX = clientX - centerX;
      const distanceY = clientY - centerY;

      // Pull child relative to cursor distance
      gsap.to(container, {
        x: distanceX * 0.35,
        y: distanceY * 0.35,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const onMouseLeave = () => {
      // Elastic return to original position
      gsap.to(container, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.3)",
      });
    };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    return () => {
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return React.cloneElement(children, {
    ref: containerRef,
    "data-magnetic": "true",
  });
}
