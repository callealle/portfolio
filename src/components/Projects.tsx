"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Section } from "./Section";
import { HoverTilt } from "./motion/HoverTilt";
import { StaggerReveal, StaggerItem } from "./motion/StaggerReveal";
import { profile } from "@/lib/content";

export function Projects() {
  const projects = profile.projects;
  const [index, setIndex] = useState(0);
  const project = projects[index];

  return (
    <Section id="projects" index="04" label="Projects" title="Things I've shipped" wide>
      <div className="flex flex-wrap gap-2">
        {projects.map((p, i) => {
          const isSelected = i === index;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setIndex(i)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                isSelected
                  ? "border-accent bg-accent-soft text-ink"
                  : "border-line text-ink/85 hover:border-accent-2 hover:text-ink"
              }`}
            >
              {p.name.split(":")[0]}
            </button>
          );
        })}
      </div>

      <div className="mt-8" style={{ perspective: "1200px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <HoverTilt strength={3}>
              <div className="glass shadow-soft rounded-2xl p-6 sm:p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-accent-2">
                    {project.type}
                    {project.dateRange ? ` · ${project.dateRange}` : ""}
                  </span>
                  <span className="font-mono text-[11px] text-ink-faint">
                    {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
                  {project.name}
                </h3>

                <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/80">
                  {project.description}
                </p>

                {project.recognition && (
                  <p className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-accent-soft px-3 py-1.5 text-xs text-accent">
                    ✦ {project.recognition}
                  </p>
                )}

                <StaggerReveal className="mt-6 flex flex-wrap gap-2 border-t border-line pt-6">
                  {project.techStack.map((tech) => (
                    <StaggerItem key={tech}>
                      <span className="rounded-full bg-ink/[0.06] px-3 py-1 font-mono text-[11px] text-ink-muted">
                        {tech}
                      </span>
                    </StaggerItem>
                  ))}
                </StaggerReveal>
              </div>
            </HoverTilt>
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  );
}
