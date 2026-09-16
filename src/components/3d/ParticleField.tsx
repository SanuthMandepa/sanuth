"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useWebGLSupport } from "@/hooks/useWebGL";

const COUNT = 2600;

const vertexShader = /* glsl */ `
uniform float uTime;
uniform vec2  uMouse;
uniform float uPixelRatio;

attribute float aScale;
attribute float aSpeed;
attribute float aPhase;

varying float vFade;

void main() {
  vec3 pos = position;

  // Slow independent drift, so the field never looks like a static grid.
  pos.x += sin(uTime * aSpeed * 0.4 + aPhase) * 0.6;
  pos.y += cos(uTime * aSpeed * 0.32 + aPhase * 1.7) * 0.45;
  pos.z += sin(uTime * aSpeed * 0.25 + aPhase * 0.6) * 0.5;

  // The pointer drags nearby motes toward it.
  vec2 toM = uMouse - pos.xy;
  float d = length(toM);
  float pull = smoothstep(3.2, 0.0, d);
  pos.xy += toM * pull * 0.28;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aScale * uPixelRatio * (12.0 / -mv.z) * (1.0 + pull * 1.6);

  // Fade with depth so the field has air in it.
  vFade = smoothstep(-9.0, 1.0, mv.z) * (0.35 + pull * 0.65);
}
`;

const fragmentShader = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
varying float vFade;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;
  // Soft round falloff rather than a hard disc.
  float alpha = smoothstep(0.5, 0.0, d) * vFade;
  gl_FragColor = vec4(mix(uColorA, uColorB, vFade), alpha);
}
`;

function Field() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef(new THREE.Vector2(99, 99));
  const dpr = useThree((s) => s.viewport.dpr);

  const { positions, scales, speeds, phases } = useMemo(() => {
    // Seeded rather than Math.random: the layout is then a pure function of
    // the seed, so it is identical on every render and on every machine.
    let seed = 0x9e3779b9;
    const rand = () => {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    const positions = new Float32Array(COUNT * 3);
    const scales = new Float32Array(COUNT);
    const speeds = new Float32Array(COUNT);
    const phases = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (rand() - 0.5) * 22;
      positions[i * 3 + 1] = (rand() - 0.5) * 12;
      positions[i * 3 + 2] = (rand() - 0.5) * 9;
      scales[i] = rand() * 2.2 + 0.5;
      speeds[i] = rand() * 0.9 + 0.25;
      phases[i] = rand() * Math.PI * 2;
    }
    return { positions, scales, speeds, phases };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(99, 99) },
      uPixelRatio: { value: dpr },
      uColorA: { value: new THREE.Color("#ff5100") },
      uColorB: { value: new THREE.Color("#ffc46a") },
    }),
    [dpr]
  );

  useFrame(({ pointer, camera, viewport }, delta) => {
    const u = matRef.current?.uniforms;
    if (!u) return;
    u.uTime.value += delta;

    const v = viewport.getCurrentViewport(camera, [0, 0, 0]);
    mouse.current.lerp(
      new THREE.Vector2((pointer.x * v.width) / 2, (pointer.y * v.height) / 2),
      1 - Math.pow(0.002, delta)
    );
    u.uMouse.value.copy(mouse.current);
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * Ambient drifting motes that gather around the pointer. Additive, so it only
 * makes sense over a dark surface.
 */
export default function ParticleField({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const supported = useWebGLSupport();

  // Purely decorative, so anything other than a confirmed yes renders nothing.
  if (reduced || !supported) return null;

  return (
    <Canvas
      className={className}
      camera={{ position: [0, 0, 8], fov: 50 }}
      gl={{ antialias: false, alpha: true }}
      dpr={[1, 1.75]}
    >
      <Field />
    </Canvas>
  );
}
