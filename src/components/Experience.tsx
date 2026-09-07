"use client";

import { Section } from "./Section";
import { ScrollReveal } from "./motion/ScrollReveal";
import { StaggerReveal, StaggerItem } from "./motion/StaggerReveal";
import { ExperienceSpotlight } from "./ExperienceSpotlight";
import { profile } from "@/lib/content";

export function Experience() {
  const [primary, ...rest] = profile.experience;
  const perfAchievement = primary.achievements.find((a) => a.caseStudy)!;
  const otherAchievements = primary.achievements.filter(
    (a) => !a.caseStudy && !a.metric,
  );

  return (
    <Section
      id="experience"
      index="03"
      label="Experience"
      title="Where I've built"
      tone="grid"
      wide
    >
      <div className="mb-12">
        <ExperienceSpotlight perfAchievement={perfAchievement} />
      </div>

      <div className="relative border-l border-line pl-8 sm:pl-10">
        <ScrollReveal direction="left">
          <div className="relative pb-14">
            <span className="absolute -left-[calc(2.5rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-accent-soft sm:-left-[calc(2.75rem+5px)]" />
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-baseline">
              <h3 className="font-display text-2xl font-bold sm:text-3xl">
                {primary.company}
              </h3>
              <span className="font-mono text-xs uppercase tracking-widest text-ink-faint">
                {primary.durationDisplay}
              </span>
            </div>
            <p className="mt-1 text-ink/70">
              {primary.title} - {primary.location}
            </p>
            {primary.product && (
              <p className="mt-1 text-sm text-ink-faint">{primary.product}</p>
            )}

            <StaggerReveal className="mt-6 grid gap-4 sm:grid-cols-2">
              {otherAchievements.map((a) => (
                <StaggerItem
                  key={a.id}
                  className="rounded-xl border border-line bg-bg-elevated/40 p-5 text-sm leading-relaxed text-ink/80"
                >
                  {a.text}
                </StaggerItem>
              ))}
            </StaggerReveal>

            <div className="mt-6 flex flex-wrap gap-2">
              {primary.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-ink/[0.06] px-3 py-1 font-mono text-[11px] text-ink-muted"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {rest.map((exp) => (
          <ScrollReveal key={exp.company} direction="left" delay={0.1}>
            <div className="relative pb-2">
              <span className="absolute -left-[calc(2.5rem+4px)] top-1.5 h-2 w-2 rounded-full bg-ink-faint sm:-left-[calc(2.75rem+4px)]" />
              <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                <div>
                  <span className="font-medium text-ink/90">{exp.title}</span>
                  <span className="text-ink-muted"> - {exp.company}</span>
                </div>
                <span className="font-mono text-xs uppercase tracking-widest text-ink-faint">
                  {exp.durationDisplay}
                </span>
              </div>
              {exp.achievements[0] && (
                <p className="mt-1 max-w-xl text-sm text-ink-muted">
                  {exp.achievements[0].text}
                </p>
              )}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </Section>
  );
}
