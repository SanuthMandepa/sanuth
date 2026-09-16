"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { getIcon, GithubMark } from "@/lib/icons";
import { SwapText } from "@/components/ui/Interactive";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { LucideIcon } from "lucide-react";
import type { Project } from "@/data/content";
import ProjectVisual from "./ProjectVisual";
import s from "./layouts.module.css";

const STATUS: Record<Project["status"], string> = {
  shipped: "Shipped",
  building: "In progress",
  research: "Research",
  archived: "Archived",
};

/* --------------------------------------------------------------- atoms -- */

function Metrics({ project }: { project: Project }) {
  if (!project.metrics.length) return null;
  return (
    <div className={s.metrics}>
      {project.metrics.map((m) => (
        <div key={m.label}>
          <span className={s.metricValue}>{m.value}</span>
          <span className={s.metricLabel}>{m.label}</span>
        </div>
      ))}
    </div>
  );
}

function Links({ project }: { project: Project }) {
  return (
    <div className={s.tagRow}>
      {project.links.live ? (
        <a
          href={project.links.live}
          target="_blank"
          rel="noreferrer"
          className={s.link}
        >
          <SwapText>Live site</SwapText>
          <ArrowUpRight size={15} strokeWidth={2.5} />
        </a>
      ) : (
        <span className={`${s.link} ${s.linkOff}`}>Link coming soon</span>
      )}
      {project.links.github && (
        <a
          href={project.links.github}
          target="_blank"
          rel="noreferrer"
          className={s.link}
        >
          <GithubMark size={15} />
          Source
        </a>
      )}
    </div>
  );
}

function Stack({ project }: { project: Project }) {
  return (
    <div className={s.tagRow}>
      {project.stack.map((t) => (
        <span key={t} className={`${s.tag} ${s.tagPlain}`}>
          {t}
        </span>
      ))}
    </div>
  );
}

/* The icon component is resolved by the caller and passed in: looking it up in
   this body reads to the compiler as creating a component during render. */
function Head({ project, Icon }: { project: Project; Icon: LucideIcon }) {
  return (
    <div className={s.stackHead}>
      <span className={s.iconTile}>
        <Icon size={28} strokeWidth={2} />
      </span>
      <span>
        <h3 className={s.title}>{project.title}</h3>
        <span className={s.subtitle}>{project.subtitle}</span>
      </span>
    </div>
  );
}

/* ------------------------------------------------- A. sticky card stack -- */

export function StackLayout({ projects }: { projects: Project[] }) {
  return (
    <div className={s.stack}>
      {projects.map((project, i) => {
        const Icon = getIcon(project.icon);
        return (
        <div
          key={project.slug}
          className={s.sticky}
          style={{ "--i": i } as React.CSSProperties}
        >
          <article
            className={`${s.card} ${s.cardEdge} ${s.stackCard}`}
            data-spotlight
            data-anim
          >
            <div className={s.stackLeft}>
              <Head project={project} Icon={Icon} />
              <div className={s.tagRow}>
                <span className={s.tag}>{project.discipline}</span>
                <span className={`${s.tag} ${s.tagPlain}`}>
                  {STATUS[project.status]}
                </span>
                <span className={`${s.tag} ${s.tagPlain}`}>{project.period}</span>
              </div>
              <p className={s.summary}>{project.summary}</p>
              <Metrics project={project} />
              <Stack project={project} />
              <Links project={project} />
            </div>
            <ProjectVisual project={project} className={s.stackVisual} />
          </article>
        </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------ B. bento -- */

export function BentoLayout({ projects }: { projects: Project[] }) {
  const [a, b, ...rest] = projects;
  return (
    <div className={s.bento}>
      {[a, b].map((project) => {
        const Icon = getIcon(project.icon);
        return (
        <article
          key={project.slug}
          className={`${s.card} ${s.cardEdge} ${s.feature}`}
          data-spotlight
          data-anim
        >
          <Head project={project} Icon={Icon} />
          <div className={s.tagRow}>
            <span className={s.tag}>{project.discipline}</span>
            <span className={`${s.tag} ${s.tagPlain}`}>{project.period}</span>
          </div>
          <p className={s.summary}>{project.summary}</p>
          <Metrics project={project} />
          <Links project={project} />
          <ProjectVisual project={project} className={s.featureVisual} />
        </article>
        );
      })}

      {rest.map((project) => {
        const Icon = getIcon(project.icon);
        return (
          <article
            key={project.slug}
            className={`${s.card} ${s.compact}`}
            data-spotlight
            data-anim
          >
            <span className={s.iconTile}>
              <Icon size={24} strokeWidth={2} />
            </span>
            <span>
              <h3 className={s.compactTitle}>{project.title}</h3>
              <span className={s.subtitle}>{project.subtitle}</span>
            </span>
            <div className={s.tagRow}>
              <span className={s.tag}>{project.discipline}</span>
              <span className={`${s.tag} ${s.tagPlain}`}>
                {STATUS[project.status]}
              </span>
            </div>
            <Stack project={project} />
          </article>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------ C. index -- */

function IndexRow({
  project,
  open,
  onToggle,
}: {
  project: Project;
  open: boolean;
  onToggle: () => void;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    // Animate to the measured content height, then release to auto so the row
    // stays correct if the text rewraps on resize.
    gsap.to(el, {
      height: open ? el.scrollHeight : 0,
      duration: reduced ? 0 : 0.55,
      ease: "swiss",
      onComplete: () => {
        if (open) gsap.set(el, { height: "auto" });
      },
    });
  }, [open, reduced]);

  return (
    <div className={`${s.row} ${open ? s.rowOpen : ""}`}>
      <button
        className={s.rowHead}
        onClick={onToggle}
        aria-expanded={open}
        onMouseEnter={() => !open && onToggle()}
      >
        <span className={s.rowNum}>{project.index}</span>
        <span className={s.rowTitle}>{project.title}</span>
        <span className={s.rowMeta}>
          {project.discipline} · {project.period}
        </span>
      </button>

      <div ref={bodyRef} className={s.rowBody}>
        <div className={s.rowBodyInner}>
          <div className={s.rowCopy}>
            <p className={s.summary}>{project.summary}</p>
            <Metrics project={project} />
            <Stack project={project} />
            <Links project={project} />
          </div>
          <ProjectVisual project={project} className={s.rowVisual} />
        </div>
      </div>
    </div>
  );
}

export function IndexLayout({ projects }: { projects: Project[] }) {
  const [open, setOpen] = useState(projects[0]?.slug ?? "");
  return (
    <div className={s.index}>
      {projects.map((project) => (
        <IndexRow
          key={project.slug}
          project={project}
          open={open === project.slug}
          onToggle={() => setOpen(project.slug)}
        />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------- D. gallery -- */

export function GalleryLayout({ projects }: { projects: Project[] }) {
  return (
    <div className={s.gallery}>
      {projects.map((project) => {
        const Icon = getIcon(project.icon);
        return (
          <article key={project.slug} className={s.galleryItem} data-anim>
            <ProjectVisual project={project} className={s.galleryVisual} />
            <div className={s.galleryBar}>
              <span className={s.iconTile}>
                <Icon size={26} strokeWidth={2} />
              </span>
              <div className={s.galleryText}>
                <h3 className={s.title}>{project.title}</h3>
                <p className={s.summary}>{project.summary}</p>
                <Stack project={project} />
              </div>
              <div className={s.galleryAside}>
                <Metrics project={project} />
                <Links project={project} />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

/* --------------------------------------------------------------- shared -- */

export const LAYOUTS = {
  stack: { label: "Stacked cards", Comp: StackLayout },
  bento: { label: "Bento grid", Comp: BentoLayout },
  index: { label: "Index list", Comp: IndexLayout },
  gallery: { label: "Large images", Comp: GalleryLayout },
} as const;

export type LayoutId = keyof typeof LAYOUTS;

export const HEADINGS = {
  count: {
    label: "Count",
    eyebrow: "Selected work",
    render: () => (
      <>
        Five things I <span className="grad-text">built and shipped</span>
      </>
    ),
  },
  short: {
    label: "Short",
    eyebrow: "Selected work",
    render: () => (
      <>
        Things I have <span className="grad-text">shipped</span>
      </>
    ),
  },
  numbers: {
    label: "Numbers",
    eyebrow: "Selected work",
    render: () => (
      <>
        From 366,000 ECGs to a{" "}
        <span className="grad-text">22-check audit engine</span>
      </>
    ),
  },
} as const;

export type HeadingId = keyof typeof HEADINGS;
