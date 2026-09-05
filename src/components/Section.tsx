"use client";

import type { ReactNode } from "react";
import { ScrollReveal } from "./motion/ScrollReveal";

type Tone = "default" | "sunken" | "inverted" | "grid" | "dots";

const TONE_BG: Record<Tone, string> = {
  default: "",
  sunken: "bg-bg-sunken",
  inverted: "bg-ink text-bg",
  grid: "bg-bg-sunken bg-blueprint",
  dots: "bg-bg bg-dots",
};

export function Section({
  id,
  index,
  label,
  title,
  children,
  className,
  tone = "default",
  wide = false,
}: {
  id: string;
  index: string;
  label: string;
  title: string;
  children: ReactNode;
  className?: string;
  tone?: Tone;
  wide?: boolean;
}) {
  const inverted = tone === "inverted";

  return (
    <section
      id={id}
      className={`relative scroll-mt-24 py-24 sm:py-32 ${TONE_BG[tone]} ${className ?? ""}`}
    >
      <div
        className={`relative mx-auto px-6 sm:px-10 ${wide ? "max-w-7xl" : "max-w-6xl"}`}
      >
        <div className="mb-12 flex items-baseline gap-4 sm:mb-16">
          <span
            className={`font-mono text-xs ${inverted ? "text-bg/50" : "text-ink-faint"}`}
          >
            {index}
          </span>
          <span
            className={`h-px flex-1 ${inverted ? "bg-bg/15" : "bg-line"}`}
          />
          <span
            className={`font-mono text-xs uppercase tracking-widest ${inverted ? "text-bg/50" : "text-ink-faint"}`}
          >
            {label}
          </span>
        </div>

        <ScrollReveal>
          <h2 className="heading-section font-display mb-10">
            {title}
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>{children}</ScrollReveal>
      </div>
    </section>
  );
}
