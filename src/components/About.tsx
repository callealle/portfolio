"use client";

import { Section } from "./Section";
import { StaggerReveal, StaggerItem } from "./motion/StaggerReveal";
import { AnimatedNumber } from "./motion/AnimatedNumber";
import { profile } from "@/lib/content";

const STATS = [
  { value: 2, suffix: "+", label: "Years in production" },
  { value: 200, suffix: "+", label: "Tickets resolved (150–200+)" },
  { value: 70, suffix: "%", label: "Faster report loads" },
];

export function About() {
  return (
    <Section id="about" index="01" label="About" title="Who I am" wide>
      <div className="grid gap-16 lg:grid-cols-[1.3fr_1fr]">
        <p className="max-w-2xl text-xl leading-relaxed text-ink/80 sm:text-2xl">
          {profile.summary}
        </p>

        <StaggerReveal className="grid grid-cols-3 gap-6 lg:grid-cols-1 lg:gap-10">
          {STATS.map((stat) => (
            <StaggerItem key={stat.label} className="border-t border-line pt-4">
              <div className="font-display text-3xl font-bold text-accent sm:text-4xl">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-widest text-ink-faint">
                {stat.label}
              </div>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>

      <div className="mt-16 flex flex-wrap items-center gap-3 border-t border-line pt-8 font-mono text-xs uppercase tracking-widest text-ink-faint">
        <span>{profile.education.degree}</span>
        <span aria-hidden="true" className="text-accent-2">
          ·
        </span>
        <span>{profile.education.school}</span>
        <span aria-hidden="true" className="text-accent-2">
          ·
        </span>
        <span>{profile.education.years}</span>
      </div>
    </Section>
  );
}
