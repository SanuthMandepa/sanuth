"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Image from "next/image";
import Portrait from "./Portrait";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useWebGLSupport } from "@/hooks/useWebGL";
import { profile } from "@/data/content";
import styles from "./PortraitCanvas.module.css";

/** Plain image, used for reduced motion and when WebGL is unavailable. */
function StaticPortrait() {
  return (
    <div className={styles.fallback}>
      <Image
        src={profile.portrait}
        alt={profile.name}
        fill
        priority
        sizes="(max-width: 900px) 90vw, 40vw"
        className={styles.fallbackImg}
      />
    </div>
  );
}

export default function PortraitCanvas() {
  const reduced = useReducedMotion();
  const supported = useWebGLSupport();

  if (reduced || supported === false) return <StaticPortrait />;
  if (supported === null) return <div className={styles.fallback} />;

  return (
    <Canvas
      className={styles.canvas}
      camera={{ position: [0, 0, 5.4], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <Portrait />
      </Suspense>
    </Canvas>
  );
}
