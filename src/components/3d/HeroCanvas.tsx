"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Scene3D from "./Scene3D";
import { useMouse } from "@/hooks/useMouse";

export default function HeroCanvas() {
  const mouse = useMouse();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene3D mouse={mouse} />
      </Canvas>
    </div>
  );
}
