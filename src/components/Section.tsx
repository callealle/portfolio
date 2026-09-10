"use client";

import type { ReactNode } from "react";
import { ScrollReveal } from "./motion/ScrollReveal";

type Tone = "default" | "sunken" | "inverted" | "grid" | "dots";

/**
 * Surface tints are deliberately translucent: the site's ColorBends
 * background sits behind every section at z-index -10, and a fully opaque
 * tone would black it out for that whole section (which is exactly what
 * `grid` was doing to Experience). `inverted` is the one exception -- it is
 * a committed light surface, and letting an amber band bleed through it
 * would just look muddy.
 */
const TONE_BG: Record<Tone, string> = {
  default: "",
  sunken: "bg-bg-sunken/65",
  inverted: "bg-ink text-bg",
  grid: "bg-bg-sunken/65 bg-blueprint",
  dots: "bg-bg/40 bg-dots",
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
  background,
}: {
  id: string;
  index: string;
  label: string;
  title: string;
  children: ReactNode;
  className?: string;
  tone?: Tone;
  wide?: boolean;
  /** Optional full-bleed decorative layer, behind everything in the section. */
  background?: ReactNode;
}) {
  const inverted = tone === "inverted";

  return (
    <section
      id={id}
      className={`relative scroll-mt-24 py-24 sm:py-32 ${TONE_BG[tone]} ${className ?? ""}`}
    >
      {background && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          {background}
        </div>
      )}

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
