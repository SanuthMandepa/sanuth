"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleStormProps {
  mouse: { x: number; y: number };
}

export default function ParticleStorm({ mouse }: ParticleStormProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 1800;

  // Pre-generate random point coordinates
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Cylindrical/spherical distribution
      const theta = Math.random() * Math.PI * 2;
      const radius = Math.random() * 8 + 2;
      arr[i * 3] = Math.cos(theta) * radius;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.getElapsedTime();
    
    // Slow rotational drift
    pointsRef.current.rotation.y = time * 0.02;
    pointsRef.current.rotation.x = time * 0.01;

    // Smooth scroll/mouse lag
    const targetX = (mouse.x / window.innerWidth - 0.5) * 0.8;
    const targetY = -(mouse.y / window.innerHeight - 0.5) * 0.8;

    pointsRef.current.position.x += (targetX - pointsRef.current.position.x) * 0.04;
    pointsRef.current.position.y += (targetY - pointsRef.current.position.y) * 0.04;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#00f0ff"
        transparent
        opacity={0.35}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
