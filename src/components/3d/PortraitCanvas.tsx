"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Image from "next/image";
import Portrait, { type PortraitMode } from "./Portrait";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useWebGLSupport } from "@/hooks/useWebGL";
import styles from "./PortraitCanvas.module.css";

export const MODES: { id: PortraitMode; label: string }[] = [
  { id: "particles", label: "Particles" },
  { id: "liquid", label: "Liquid" },
  { id: "halftone", label: "Halftone" },
];

/** Plain image, used for reduced motion and when WebGL is unavailable. */
function StaticPortrait() {
  return (
    <div className={styles.fallback}>
      <Image
        src="/me.png"
        alt="Sanuth Mandepa"
        fill
        priority
        sizes="(max-width: 900px) 90vw, 40vw"
        className={styles.fallbackImg}
      />
    </div>
  );
}

export default function PortraitCanvas({ mode }: { mode: PortraitMode }) {
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
        <Portrait mode={mode} />
      </Suspense>
    </Canvas>
  );
}
