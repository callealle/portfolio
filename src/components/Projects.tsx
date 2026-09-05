"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Section } from "./Section";
import { ScrollReveal } from "./motion/ScrollReveal";
import { HoverTilt } from "./motion/HoverTilt";
import { profile, type ProjectEntry } from "@/lib/content";

function ProjectVisual({ index }: { index: number }) {
  const isEven = index % 2 === 0;
  return (
    <HoverTilt strength={6} className="h-full">
      <div
        className={`relative flex h-64 items-center justify-center overflow-hidden rounded-2xl border border-line sm:h-full ${
          isEven ? "bg-gradient-to-br from-accent-soft to-transparent" : "bg-gradient-to-br from-accent-2-soft to-transparent"
        }`}
      >
        <span
          className={`font-display select-none text-[9rem] font-bold leading-none opacity-20 ${
            isEven ? "text-accent" : "text-accent-2"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="bg-blueprint absolute inset-0 opacity-30" />
      </div>
    </HoverTilt>
  );
}

function ProjectCase({ project, index }: { project: ProjectEntry; index: number }) {
  const [open, setOpen] = useState(false);
  const isEven = index % 2 === 0;

  return (
    <ScrollReveal direction={isEven ? "left" : "right"} amount={0.2}>
      <article className="grid gap-8 py-14 first:pt-0 sm:grid-cols-2 sm:gap-12">
        <div className={isEven ? "sm:order-1" : "sm:order-2"}>
          <ProjectVisual index={index} />
        </div>

        <div className={`flex flex-col justify-center ${isEven ? "sm:order-2" : "sm:order-1"}`}>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">
              {project.type}
            </span>
            {project.dateRange && (
              <>
                <span className="text-ink-faint">·</span>
                <span className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">
                  {project.dateRange}
                </span>
              </>
            )}
          </div>

          <h3 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {project.name}
          </h3>

          <p className="mt-4 text-base leading-relaxed text-ink/75 sm:text-lg">
            {project.description}
          </p>

          {project.recognition && (
            <p className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-accent-soft px-3 py-1.5 text-xs font-medium text-accent">
              🏆 {project.recognition}
            </p>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="mt-6 inline-flex w-fit items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink-muted transition-colors hover:text-ink"
          >
            {open ? "Hide details" : "Explore case study"}
            <motion.span animate={{ rotate: open ? 45 : 0 }}>+</motion.span>
          </button>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-5 grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
                  <div>
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                      Role
                    </h4>
                    <p className="mt-1.5 text-sm text-ink-muted">
                      Full-stack developer
                    </p>
                  </div>
                  <div>
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                      Stack
                    </h4>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full bg-ink/[0.06] px-2.5 py-1 font-mono text-[10px] text-ink-muted"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </article>
    </ScrollReveal>
  );
}

export function Projects() {
  return (
    <Section
      id="projects"
      index="04"
      label="Projects"
      title="Things I've shipped"
      wide
    >
      <div className="divide-y divide-line">
        {profile.projects.map((project, i) => (
          <ProjectCase key={project.id} project={project} index={i} />
        ))}
      </div>
    </Section>
  );
}
