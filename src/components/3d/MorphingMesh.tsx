"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface MorphingMeshProps {
  mouse: { x: number; y: number };
}

export default function MorphingMesh({ mouse }: MorphingMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const originalPositions = useRef<Float32Array | null>(null);

  // Create icosahedron geometry with enough subdivisions for smooth morphing
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.5, 5);
    originalPositions.current = new Float32Array(geo.attributes.position.array);
    return geo;
  }, []);

  useFrame((state) => {
    if (!meshRef.current || !originalPositions.current) return;

    const time = state.clock.getElapsedTime();

    // Rotate slowly
    meshRef.current.rotation.x = time * 0.15;
    meshRef.current.rotation.y = time * 0.1;

    // Smooth inertia tracking of cursor
    const targetX = (mouse.x / window.innerWidth - 0.5) * 1.5;
    const targetY = -(mouse.y / window.innerHeight - 0.5) * 1.5;
    meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.06;
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.06;

    // Vertex displacement (organic morphing effect)
    const positions = meshRef.current.geometry.attributes.position;
    const orig = originalPositions.current;

    for (let i = 0; i < positions.count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      const ox = orig[ix];
      const oy = orig[iy];
      const oz = orig[iz];

      // Create noise-like displacement using sin/cos combinations
      const distort =
        Math.sin(ox * 2.0 + time * 1.2) * 0.12 +
        Math.cos(oy * 2.5 + time * 0.8) * 0.1 +
        Math.sin(oz * 3.0 + time * 1.5) * 0.08;

      const len = Math.sqrt(ox * ox + oy * oy + oz * oz);
      const nx = ox / len;
      const ny = oy / len;
      const nz = oz / len;

      positions.setXYZ(
        i,
        ox + nx * distort,
        oy + ny * distort,
        oz + nz * distort
      );
    }

    positions.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshPhysicalMaterial
        color="#bd00ff"
        roughness={0.1}
        metalness={0.6}
        clearcoat={1}
        clearcoatRoughness={0.1}
        envMapIntensity={1.5}
      />
    </mesh>
  );
}
