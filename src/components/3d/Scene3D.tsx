"use client";

import { Suspense } from "react";
import { Environment } from "@react-three/drei";
import MorphingMesh from "./MorphingMesh";
import ParticleStorm from "./ParticleStorm";

interface Scene3DProps {
  mouse: { x: number; y: number };
}

export default function Scene3D({ mouse }: Scene3DProps) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[8, 8, 4]} intensity={2.0} color="#00f0ff" />
      <pointLight position={[-8, -8, -4]} intensity={1.5} color="#bd00ff" />
      <spotLight
        position={[2, 8, 6]}
        angle={0.4}
        penumbra={1}
        intensity={2.5}
        color="#ffffff"
      />

      <Suspense fallback={null}>
        <Environment preset="night" />
        <MorphingMesh mouse={mouse} />
        <ParticleStorm mouse={mouse} />
      </Suspense>
    </>
  );
}
