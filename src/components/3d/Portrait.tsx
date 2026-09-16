"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import {
  particlesVertex,
  particlesFragment,
  planeVertex,
  liquidFragment,
  halftoneFragment,
} from "./portraitShaders";

export type PortraitMode = "particles" | "liquid" | "halftone";

/* Matches me.png (767 x 1024) so the face is never stretched. */
const PLANE_W = 3;
const PLANE_H = 4;

/* The orange ramp, shared by all three treatments. */
const DARK = new THREE.Color("#2a1206");
const MID = new THREE.Color("#ff5100");
const LIGHT = new THREE.Color("#ffb020");

/** Pointer in the plane's own coordinates, smoothed so nothing snaps. */
function usePlanePointer() {
  const target = useRef(new THREE.Vector2());
  const smooth = useRef(new THREE.Vector2());
  const hover = useRef(0);

  useFrame(({ pointer, camera, viewport }, delta) => {
    // pointer is normalised device coords; scale to world units at z = 0.
    const h = viewport.getCurrentViewport(camera, [0, 0, 0]).height;
    const w = viewport.getCurrentViewport(camera, [0, 0, 0]).width;
    target.current.set((pointer.x * w) / 2, (pointer.y * h) / 2);

    const k = 1 - Math.pow(0.001, delta);
    smooth.current.lerp(target.current, k);

    const inside =
      Math.abs(smooth.current.x) < PLANE_W && Math.abs(smooth.current.y) < PLANE_H;
    hover.current += ((inside ? 1 : 0) - hover.current) * k;
  });

  return { point: smooth, hover };
}

/** Shared uniform block, so the three modes stay visually consistent. */
function useBaseUniforms(texture: THREE.Texture) {
  return useMemo(
    () => ({
      uTexture: { value: texture },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(99, 99) },
      uIntro: { value: 0 },
      uDark: { value: DARK },
      uMid: { value: MID },
      uLight: { value: LIGHT },
    }),
    [texture]
  );
}

/* ------------------------------------------------------------- particles -- */

function Particles({ texture }: { texture: THREE.Texture }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { point } = usePlanePointer();
  const dpr = useThree((s) => s.viewport.dpr);

  const uniforms = useMemo(
    () => ({
      uSize: { value: 26 },
      uPixelRatio: { value: dpr },
      // How far to push the photo toward the orange ramp. Below 1 the real
      // skin tones survive, which keeps the face readable.
      uTint: { value: 0.72 },
    }),
    [dpr]
  );

  const base = useBaseUniforms(texture);
  const all = useMemo(() => ({ ...base, ...uniforms }), [base, uniforms]);

  useFrame((_, delta) => {
    const u = matRef.current?.uniforms;
    if (!u) return;
    u.uTime.value += delta;
    u.uMouse.value.copy(point.current);
    u.uIntro.value = Math.min(1, u.uIntro.value + delta * 0.8);
  });

  return (
    <points>
      {/* 181 x 241 vertices, so roughly 44,000 points. */}
      <planeGeometry args={[PLANE_W, PLANE_H, 180, 240]} />
      <shaderMaterial
        ref={matRef}
        uniforms={all}
        vertexShader={particlesVertex}
        fragmentShader={particlesFragment}
        transparent
        depthWrite={false}
      />
    </points>
  );
}

/* ---------------------------------------------------------------- liquid -- */

function Liquid({ texture }: { texture: THREE.Texture }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { point, hover } = usePlanePointer();

  const base = useBaseUniforms(texture);
  const all = useMemo(
    () => ({ ...base, uHover: { value: 0 } }),
    [base]
  );

  useFrame((_, delta) => {
    const u = matRef.current?.uniforms;
    if (!u) return;
    u.uTime.value += delta;
    // Convert plane coords to 0..1 uv space for the fragment shader.
    u.uMouse.value.set(
      point.current.x / PLANE_W + 0.5,
      point.current.y / PLANE_H + 0.5
    );
    u.uHover.value = hover.current;
    u.uIntro.value = Math.min(1, u.uIntro.value + delta * 1.2);
  });

  return (
    <mesh>
      <planeGeometry args={[PLANE_W, PLANE_H, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        uniforms={all}
        vertexShader={planeVertex}
        fragmentShader={liquidFragment}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

/* -------------------------------------------------------------- halftone -- */

function Halftone({ texture }: { texture: THREE.Texture }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { point } = usePlanePointer();

  const base = useBaseUniforms(texture);
  const all = useMemo(() => ({ ...base, uGrid: { value: 68 } }), [base]);

  useFrame((_, delta) => {
    const u = matRef.current?.uniforms;
    if (!u) return;
    u.uTime.value += delta;
    u.uMouse.value.set(
      point.current.x / PLANE_W + 0.5,
      point.current.y / PLANE_H + 0.5
    );
    u.uIntro.value = Math.min(1, u.uIntro.value + delta * 1.2);
  });

  return (
    <mesh>
      <planeGeometry args={[PLANE_W, PLANE_H, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        uniforms={all}
        vertexShader={planeVertex}
        fragmentShader={halftoneFragment}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ root -- */

export default function Portrait({ mode }: { mode: PortraitMode }) {
  /* Configure in the load callback, not during render. useTexture hands back a
     cached, shared object, so mutating it while rendering is an impure write
     that can leak between components. */
  const texture = useTexture("/me.png", (loaded) => {
    const t = Array.isArray(loaded) ? loaded[0] : loaded;
    // Clamp so the flow and ripple distortions never wrap pixels round the edge.
    t.wrapS = THREE.ClampToEdgeWrapping;
    t.wrapT = THREE.ClampToEdgeWrapping;
    t.minFilter = THREE.LinearFilter;
    t.needsUpdate = true;
  });

  // Keyed so switching modes tears down the old material cleanly.
  if (mode === "liquid") return <Liquid key="liquid" texture={texture} />;
  if (mode === "halftone") return <Halftone key="halftone" texture={texture} />;
  return <Particles key="particles" texture={texture} />;
}
