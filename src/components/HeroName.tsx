"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";

/**
 * Renders the hero's name, first name in a script face and last name in a
 * Helvetica-equivalent bold -- a per-line font split, not a site-wide type
 * change. The script line is sized up relative to the shared base: at equal
 * nominal font-size, a script face's actual glyph size/weight reads far
 * smaller than a bold sans (this is what made the first pass look
 * "weird" -- a tiny, thin first line next to a big, heavy second one), so
 * matching apparent size takes a real size correction, not just a font swap.
 *
 * SplitText handles its own accessible name (aria-label on each split line,
 * aria-hidden on the per-char spans it creates) -- see gsap-plugins skill.
 * Reduced-motion: skip the char stagger, leave the (already-visible, real)
 * text alone.
 */
export function HeroName({ name, className }: { name: string; className: string }) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const [firstRaw, ...restRaw] = name.split(" ");
  const lastRaw = restRaw.join(" ");

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      const lines = containerRef.current?.querySelectorAll<HTMLElement>("[data-split-line]");
      if (!lines?.length) return;

      SplitText.create(lines, {
        type: "chars",
        autoSplit: true,
        onSplit(self) {
          return gsap.timeline().from(self.chars, {
            opacity: 0,
            y: 28,
            rotate: 4,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.025,
          });
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <h1 ref={containerRef} className={className}>
      <span
        data-split-line
        className="font-script normal-case block text-[1.55em] leading-[0.85] tracking-normal"
      >
        {firstRaw}
      </span>
      <span
        data-split-line
        className="font-helvetica-now uppercase block whitespace-nowrap text-[0.82em] font-bold tracking-tighter"
      >
        {lastRaw}
      </span>
    </h1>
  );
}
