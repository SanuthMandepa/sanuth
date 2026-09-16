"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { planeVertex, halftoneFragment } from "./portraitShaders";
import { profile } from "@/data/content";

/* Matches the portrait (767 x 1024) so the face is never stretched. */
const PLANE_W = 3;
const PLANE_H = 4;
const ASPECT = PLANE_W / PLANE_H;

/* Roughly how many CSS pixels each halftone dot should occupy. Measured in CSS
   rather than device pixels on purpose: the dots then look the same size on
   every display, and a retina screen simply draws each one more crisply
   instead of halving the apparent screen ruling. */
const PX_PER_DOT = 3.6;
const GRID_MIN = 110;
const GRID_MAX = 420;

const DARK = new THREE.Color("#1c0f05");
const MID = new THREE.Color("#d8400d");
const LIGHT = new THREE.Color("#ffc04a");

export default function Portrait() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const point = useRef(new THREE.Vector2(99, 99));
  const target = useRef(new THREE.Vector2(99, 99));
  const size = useThree((s) => s.size);

  /* Configure in the load callback, not during render: useTexture hands back a
     cached, shared object, so mutating it while rendering is an impure write
     that can leak between components. */
  const texture = useTexture(profile.portrait, (loaded) => {
    const t = Array.isArray(loaded) ? loaded[0] : loaded;
    t.wrapS = THREE.ClampToEdgeWrapping;
    t.wrapT = THREE.ClampToEdgeWrapping;
    // No mipmaps: every sample is a deliberate point lookup at a cell centre,
    // and a mip chain would just blur the detail the dots are meant to carry.
    t.generateMipmaps = false;
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.anisotropy = 1;
    t.needsUpdate = true;
  });

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(99, 99) },
      uGrid: { value: 140 },
      uAspect: { value: ASPECT },
      uTexSize: { value: new THREE.Vector2(767, 1024) },
      uIntro: { value: 0 },
      uDark: { value: DARK },
      uMid: { value: MID },
      uLight: { value: LIGHT },
    }),
    [texture]
  );

  useFrame(({ pointer, camera, viewport }, delta) => {
    const u = matRef.current?.uniforms;
    if (!u) return;

    u.uTime.value += delta;
    u.uIntro.value = Math.min(1, u.uIntro.value + delta * 1.4);

    const v = viewport.getCurrentViewport(camera, [0, 0, 0]);

    // Pointer, smoothed, then converted to the plane's 0..1 uv space.
    target.current.set((pointer.x * v.width) / 2, (pointer.y * v.height) / 2);
    point.current.lerp(target.current, 1 - Math.pow(0.001, delta));
    u.uMouse.value.set(
      point.current.x / PLANE_W + 0.5,
      point.current.y / PLANE_H + 0.5
    );

    // Dot density follows the plane's real size on screen, so a small stage
    // and a large one get the same visual screen ruling instead of being
    // locked to one fixed grid.
    const planeCssPx = (PLANE_H / v.height) * size.height;
    u.uGrid.value = Math.min(
      GRID_MAX,
      Math.max(GRID_MIN, planeCssPx / PX_PER_DOT)
    );
  });

  return (
    <mesh>
      <planeGeometry args={[PLANE_W, PLANE_H, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={planeVertex}
        fragmentShader={halftoneFragment}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
