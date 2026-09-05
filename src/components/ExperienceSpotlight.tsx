"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HoverTilt } from "./motion/HoverTilt";
import { AnimatedNumber } from "./motion/AnimatedNumber";
import type { Achievement } from "@/lib/content";

const TICKET_CATEGORIES = [
  "Financial logic (GL)",
  "AP/AR reconciliation",
  "Serial-number tracking",
  "Concurrency race conditions",
  "XLSX/PDF exports",
];

function SpotlightShell({
  children,
  eyebrow,
  onToggle,
  open,
  metric,
}: {
  children: React.ReactNode;
  eyebrow: string;
  onToggle: () => void;
  open: boolean;
  metric: React.ReactNode;
}) {
  return (
    <HoverTilt strength={4} className="h-full">
      <div className="glass shadow-soft flex h-full flex-col rounded-2xl p-6 sm:p-8">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="flex w-full flex-1 flex-col items-start text-left"
        >
          <span className="font-mono text-[11px] uppercase tracking-widest text-accent-2">
            {eyebrow}
          </span>
          <div className="my-4 font-display text-4xl font-bold text-accent sm:text-5xl">
            {metric}
          </div>
          <span className="mt-auto inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-faint">
            {open ? "Hide detail" : "Show detail"}
            <motion.span animate={{ rotate: open ? 45 : 0 }}>+</motion.span>
          </span>
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
              <div className="mt-6 border-t border-line pt-6">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </HoverTilt>
  );
}

export function ExperienceSpotlight({
  perfAchievement,
}: {
  perfAchievement: Achievement;
}) {
  const [openPerf, setOpenPerf] = useState(false);
  const [openTickets, setOpenTickets] = useState(false);
  const cs = perfAchievement.caseStudy!;

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <SpotlightShell
        eyebrow="Engineering case study"
        open={openPerf}
        onToggle={() => setOpenPerf((v) => !v)}
        metric={
          <>
            <AnimatedNumber value={60} />–<AnimatedNumber value={70} />%
          </>
        }
      >
        <p className="mb-4 text-sm font-medium text-ink/90">
          Optimizing high-volume financial report performance
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
              Problem
            </h4>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
              {cs.problem}
            </p>
          </div>
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
              Solution
            </h4>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
              {cs.solution}
            </p>
          </div>
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
              Result
            </h4>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
              {cs.result}
            </p>
          </div>
        </div>
      </SpotlightShell>

      <SpotlightShell
        eyebrow="Production support"
        open={openTickets}
        onToggle={() => setOpenTickets((v) => !v)}
        metric={<AnimatedNumber value={200} prefix="150–" suffix="+" duration={1.6} />}
      >
        <p className="mb-4 text-sm font-medium text-ink/90">
          Tickets resolved across every module of a live financial platform
        </p>
        <div className="flex flex-wrap gap-2">
          {TICKET_CATEGORIES.map((cat) => (
            <span
              key={cat}
              className="rounded-full bg-accent-2-soft px-3 py-1.5 font-mono text-[11px] text-ink/85"
            >
              {cat}
            </span>
          ))}
        </div>
      </SpotlightShell>
    </div>
  );
}
