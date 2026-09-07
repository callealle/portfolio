"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Section } from "./Section";
import { StaggerReveal, StaggerItem } from "./motion/StaggerReveal";
import { NetworkField } from "./NetworkField";
import { profile } from "@/lib/content";

const CATEGORY_LABELS: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  database: "Database",
  toolsAndDevOps: "Tools & DevOps",
};

function findUsage(skill: string) {
  const needle = skill.toLowerCase();
  const matches = (s: string) =>
    s.toLowerCase().includes(needle) || needle.includes(s.toLowerCase());

  const places: string[] = [];
  profile.experience.forEach((exp) => {
    if (exp.techStack.some(matches)) places.push(exp.company);
  });
  profile.projects.forEach((proj) => {
    if (proj.techStack.some(matches)) places.push(proj.name);
  });
  return places;
}

export function Skills() {
  const categories = Object.entries(profile.skills);
  const [selected, setSelected] = useState<string | null>(null);
  const usage = useMemo(() => (selected ? findUsage(selected) : []), [selected]);

  return (
    <Section
      id="skills"
      index="02"
      label="Skills"
      title="What I work with"
      background={<NetworkField className="opacity-40" />}
    >
      <div className="grid gap-10 sm:grid-cols-2">
        {categories.map(([key, items]) => (
          <div key={key}>
            <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-ink-faint">
              {CATEGORY_LABELS[key] ?? key}
            </h3>
            <StaggerReveal className="flex flex-wrap gap-2">
              {items.map((skill) => {
                const isSelected = selected === skill;
                return (
                  <StaggerItem key={skill}>
                    <motion.button
                      onClick={() => setSelected(isSelected ? null : skill)}
                      whileHover={{ y: -2 }}
                      className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                        isSelected
                          ? "border-accent bg-accent-soft text-ink"
                          : "border-line text-ink/85 hover:border-accent-2 hover:text-ink"
                      }`}
                    >
                      {skill}
                    </motion.button>
                  </StaggerItem>
                );
              })}
            </StaggerReveal>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key={selected}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 overflow-hidden"
          >
            <div className="glass rounded-xl px-5 py-4">
              <span className="font-mono text-[11px] uppercase tracking-widest text-accent-2">
                {selected}
              </span>
              <p className="mt-1 text-sm text-ink-muted">
                {usage.length > 0
                  ? `Used in: ${usage.join(", ")}`
                  : "Core skill - not yet tied to a listed project or role."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
