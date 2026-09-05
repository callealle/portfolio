"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

/**
 * GSAP + ScrollTrigger stat counter. Counts up when it scrolls into view
 * and counts back down on exit (toggleActions "play reverse play reverse"),
 * so — like the Motion-based reveals elsewhere — it replays rather than
 * firing once and freezing.
 */
export function GsapStat({
  value,
  prefix = "",
  suffix = "",
  label,
  duration = 1.4,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  duration?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (!numberRef.current || !containerRef.current) return;
      const counter = { val: 0 };

      gsap.to(counter, {
        val: value,
        duration,
        ease: "power2.out",
        onUpdate: () => {
          if (numberRef.current) {
            numberRef.current.textContent = `${prefix}${Math.round(counter.val)}${suffix}`;
          }
        },
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 90%",
          toggleActions: "play reverse play reverse",
        },
      });
    },
    { scope: containerRef, dependencies: [value, prefix, suffix, duration] },
  );

  return (
    <div ref={containerRef}>
      <p
        ref={numberRef}
        className="font-display text-2xl font-bold text-accent sm:text-3xl"
      >
        {prefix}0{suffix}
      </p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
        {label}
      </p>
    </div>
  );
}
