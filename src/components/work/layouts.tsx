"use client";

import { ArrowUpRight } from "lucide-react";
import { getIcon, GithubMark } from "@/lib/icons";
import { SwapText } from "@/components/ui/Interactive";
import type { Project } from "@/data/content";
import ProjectVisual from "./ProjectVisual";
import s from "./layouts.module.css";

const STATUS: Record<Project["status"], string> = {
  shipped: "Shipped",
  building: "In progress",
  research: "Research",
  archived: "Archived",
};

/**
 * Each project is one tall card: the shot fills it edge to edge, a graded dark
 * overlay sits on top, and the details are laid directly on the image across
 * the bottom. The set stacks on scroll, with a separate veil element doing the
 * dimming so nothing ever scales the card's text.
 */
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
            <article className={s.card} data-anim data-spotlight>
              <ProjectVisual project={project} className={s.cardBg} />
              <span className={s.overlay} aria-hidden="true" />
              <span className={s.dim} aria-hidden="true" />

              <div className={s.top}>
                <span className={s.iconTile}>
                  <Icon size={24} strokeWidth={2} />
                </span>
                <span className={s.index}>{project.index}</span>
                <span className={`${s.tag} ${s.tagAccent}`}>
                  {project.discipline}
                </span>
                <span className={s.tag}>{STATUS[project.status]}</span>
                <span className={s.tag}>{project.period}</span>
              </div>

              <div className={s.content}>
                <div className={s.lead}>
                  <h3 className={s.title}>{project.title}</h3>
                  <p className={s.subtitle}>{project.subtitle}</p>
                  <p className={s.summary}>{project.summary}</p>
                </div>

                <div className={s.aside}>
                  {project.metrics.length > 0 && (
                    <div className={s.metrics}>
                      {project.metrics.map((m) => (
                        <div key={m.label}>
                          <span className={s.metricValue}>{m.value}</span>
                          <span className={s.metricLabel}>{m.label}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className={s.tagRow}>
                    {project.stack.map((t) => (
                      <span key={t} className={s.tag}>
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className={s.tagRow}>
                    {project.links.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noreferrer"
                        className={`${s.link} ${s.linkPrimary}`}
                      >
                        <SwapText>Visit site</SwapText>
                        <ArrowUpRight size={15} strokeWidth={2.5} />
                      </a>
                    )}
                    {project.links.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noreferrer"
                        className={`${s.link} ${s.linkGhost}`}
                      >
                        <GithubMark size={15} />
                        Source
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          </div>
        );
      })}
    </div>
  );
}
