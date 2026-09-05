"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Continuous scroll-linked motion (not viewport-triggered) — the element
 * tracks its own progress through the viewport and moves proportionally,
 * for parallax/depth rather than a one-shot entrance.
 */
export function ParallaxElement({
  children,
  range = 80,
  className,
}: {
  children: ReactNode;
  range?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [range / 2, -range / 2]);

  return (
    <motion.div ref={ref} className={className} style={{ y: prefersReduced ? 0 : y }}>
      {children}
    </motion.div>
  );
}
