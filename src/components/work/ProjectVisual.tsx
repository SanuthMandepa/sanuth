"use client";

import Image from "next/image";
import type { Project } from "@/data/content";
import styles from "./ProjectVisual.module.css";

/**
 * A generated diagram per project, standing in for a screenshot.
 *
 * These are not decoration: each one draws the actual thing the project does,
 * so the panel carries information instead of sitting empty. The moment a real
 * screenshot lands in `cover` it replaces the diagram with no layout change.
 */

const GRAD = (id: string) => (
  <defs>
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#e33d00" />
      <stop offset="55%" stopColor="#ff8a00" />
      <stop offset="100%" stopColor="#ffb020" />
    </linearGradient>
  </defs>
);

/* RxRay: the 7-node LangGraph state machine, with a token running the edges. */
function GraphViz() {
  const nodes = [
    { x: 40, y: 60 },
    { x: 130, y: 30 },
    { x: 130, y: 95 },
    { x: 225, y: 62 },
    { x: 320, y: 30 },
    { x: 320, y: 95 },
    { x: 412, y: 62 },
  ];
  const edges: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
    [3, 4],
    [3, 5],
    [4, 6],
    [5, 6],
  ];

  return (
    <svg className={styles.svg} viewBox="0 0 452 125" fill="none">
      {GRAD("g-rx")}
      {edges.map(([a, z], i) => (
        <line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[z].x}
          y2={nodes[z].y}
          stroke="url(#g-rx)"
          strokeWidth="1.5"
          opacity="0.5"
        />
      ))}
      <path
        d="M40 60 L130 30 L225 62 L320 95 L412 62"
        stroke="url(#g-rx)"
        strokeWidth="2.5"
        strokeLinecap="round"
        className={styles.pulse}
      />
      {nodes.map((n, i) => (
        <g key={i} className={styles.blink} style={{ animationDelay: `${i * 0.22}s` }}>
          <circle cx={n.x} cy={n.y} r="13" fill="var(--white)" />
          <circle
            cx={n.x}
            cy={n.y}
            r="13"
            stroke="url(#g-rx)"
            strokeWidth="2"
            fill="none"
          />
          <circle cx={n.x} cy={n.y} r="4" fill="url(#g-rx)" />
        </g>
      ))}
    </svg>
  );
}

/* ChagaSight: a 12-lead ECG trace drawing itself. */
function EcgViz() {
  // One PQRST complex, repeated across the width.
  const beat = (x: number) =>
    `M${x} 62 L${x + 12} 62 Q${x + 17} 52 ${x + 22} 62 L${x + 30} 62 ` +
    `L${x + 35} 66 L${x + 40} 18 L${x + 45} 96 L${x + 50} 58 ` +
    `L${x + 58} 62 Q${x + 68} 42 ${x + 78} 62 L${x + 90} 62`;
  const d = [0, 90, 180, 270, 360].map(beat).join(" ");

  return (
    <svg className={styles.svg} viewBox="0 0 452 125" fill="none">
      {GRAD("g-ecg")}
      {/* Chart paper behind the trace. */}
      {Array.from({ length: 12 }).map((_, i) => (
        <line
          key={`v${i}`}
          x1={i * 40}
          y1="0"
          x2={i * 40}
          y2="125"
          stroke="var(--o-400)"
          strokeWidth="0.5"
          opacity="0.14"
        />
      ))}
      {Array.from({ length: 5 }).map((_, i) => (
        <line
          key={`h${i}`}
          x1="0"
          y1={i * 31}
          x2="452"
          y2={i * 31}
          stroke="var(--o-400)"
          strokeWidth="0.5"
          opacity="0.14"
        />
      ))}
      <path
        d={d}
        stroke="url(#g-ecg)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={styles.draw}
        style={{ "--len": 1600 } as React.CSSProperties}
      />
    </svg>
  );
}

/* Emberloft: layered planes, the studio's stacked-surface mark. */
function StudioViz() {
  return (
    <svg className={styles.svg} viewBox="0 0 452 125" fill="none">
      {GRAD("g-st")}
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={110 + i * 34}
          y={22 + i * 6}
          width="150"
          height="80"
          rx="10"
          stroke="url(#g-st)"
          strokeWidth="1.6"
          fill="var(--white)"
          fillOpacity={0.5 - i * 0.12}
          opacity={1 - i * 0.2}
          className={styles.blink}
          style={{ animationDelay: `${i * 0.3}s` }}
        />
      ))}
    </svg>
  );
}

/* Pearmo: two phone frames with a match forming between them. */
function MobileViz() {
  return (
    <svg className={styles.svg} viewBox="0 0 452 125" fill="none">
      {GRAD("g-mo")}
      {[150, 250].map((x, i) => (
        <g key={x}>
          <rect
            x={x}
            y="14"
            width="52"
            height="97"
            rx="10"
            fill="var(--white)"
            stroke="url(#g-mo)"
            strokeWidth="1.8"
          />
          {[0, 1, 2].map((r) => (
            <rect
              key={r}
              x={x + 9}
              y={28 + r * 20}
              width={r === 2 ? 22 : 34}
              height="9"
              rx="4"
              fill="url(#g-mo)"
              opacity={0.75 - r * 0.18}
              className={styles.blink}
              style={{ animationDelay: `${(i * 3 + r) * 0.2}s` }}
            />
          ))}
        </g>
      ))}
      <path
        d="M206 62 L246 62"
        stroke="url(#g-mo)"
        strokeWidth="2.5"
        strokeLinecap="round"
        className={styles.pulse}
      />
    </svg>
  );
}

/* Internova: a speech waveform, the MFCC pipeline's input. */
function WaveViz() {
  /* Rounded on purpose. Node and the browser's V8 can differ by one unit in
     the last place on the same trig expression, which React sees as a
     hydration mismatch once the float is stringified into an attribute. */
  const round = (n: number) => Math.round(n * 100) / 100;
  const bars = Array.from({ length: 44 }, (_, i) => ({
    x: round(22 + i * 9.6),
    h: round(14 + Math.abs(Math.sin(i * 0.7) * Math.cos(i * 0.31)) * 74),
  }));

  return (
    <svg className={styles.svg} viewBox="0 0 452 125" fill="none">
      {GRAD("g-wv")}
      {bars.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={round(62 - b.h / 2)}
          width="4.5"
          height={b.h}
          rx="2.25"
          fill="url(#g-wv)"
          opacity="0.85"
          className={styles.rise}
          style={{ animationDelay: `${(i % 11) * 0.11}s` }}
        />
      ))}
    </svg>
  );
}

const VIZ: Record<string, { Comp: () => React.ReactElement; caption: string }> = {
  rxray: { Comp: GraphViz, caption: "7-node state machine" },
  chagasight: { Comp: EcgViz, caption: "12-lead ECG" },
  emberloft: { Comp: StudioViz, caption: "Studio surfaces" },
  pearmo: { Comp: MobileViz, caption: "Curated matching" },
  internova: { Comp: WaveViz, caption: "Speech analysis" },
};

export default function ProjectVisual({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  if (project.cover) {
    return (
      <div className={`${styles.visual} ${className ?? ""}`}>
        <Image
          src={project.cover}
          alt={`${project.title}, ${project.subtitle}`}
          fill
          className={styles.cover}
          sizes="(max-width: 900px) 100vw, 45vw"
        />
      </div>
    );
  }

  const entry = VIZ[project.slug];
  if (!entry) return <div className={`${styles.visual} ${className ?? ""}`} />;

  const { Comp, caption } = entry;
  return (
    <div className={`${styles.visual} ${className ?? ""}`}>
      <Comp />
      <span className={styles.caption}>{caption}</span>
    </div>
  );
}
