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
 * Each project is one card: the generated diagram fills the card as a
 * background, and the details sit in a panel laid over it. The set stacks on
 * scroll, with a separate veil element doing the dimming so nothing ever
 * scales the card's text.
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
              <span className={s.dim} aria-hidden="true" />

              <div className={s.panel}>
                <div className={s.head}>
                  <span className={s.iconTile}>
                    <Icon size={26} strokeWidth={2} />
                  </span>
                  <span>
                    <h3 className={s.title}>{project.title}</h3>
                    <span className={s.subtitle}>{project.subtitle}</span>
                  </span>
                  <span className={s.index}>{project.index}</span>
                </div>

                <div className={s.tagRow}>
                  <span className={s.tag}>{project.discipline}</span>
                  <span className={`${s.tag} ${s.tagPlain}`}>
                    {STATUS[project.status]}
                  </span>
                  <span className={`${s.tag} ${s.tagPlain}`}>
                    {project.period}
                  </span>
                </div>

                <p className={s.summary}>{project.summary}</p>

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
                    <span key={t} className={`${s.tag} ${s.tagPlain}`}>
                      {t}
                    </span>
                  ))}
                </div>

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
                    <span className={`${s.link} ${s.linkOff}`}>
                      Link coming soon
                    </span>
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
              </div>
            </article>
          </div>
        );
      })}
    </div>
  );
}
