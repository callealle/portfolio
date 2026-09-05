"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

const OFFSET: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 36 },
  down: { x: 0, y: -36 },
  left: { x: 36, y: 0 },
  right: { x: -36, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * Replayable viewport-triggered reveal. Uses whileInView's default
 * bidirectional behavior (no `once`) so the animation reverses on exit
 * and plays again on re-entry, instead of firing a single time.
 */
export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  amount = 0.3,
  className,
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  amount?: number;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();
  const offset = prefersReduced ? { x: 0, y: 0 } : OFFSET[direction];

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      animate={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ amount, margin: "0px 0px -10% 0px" }}
      transition={{ duration: prefersReduced ? 0 : duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
