"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  animate,
} from "motion/react";

/**
 * Counts from 0 up to `value` whenever it scrolls into view, and resets
 * so it can count up again on re-entry (rather than a one-shot counter).
 */
export function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  duration = 1.4,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { amount: 0.6, once: false });
  const prefersReduced = useReducedMotion();
  const motionValue = useMotionValue(0);
  const display = useTransform(
    motionValue,
    (v) => `${prefix}${Math.round(v)}${suffix}`,
  );

  useEffect(() => {
    if (prefersReduced) {
      motionValue.set(value);
      return;
    }
    if (inView) {
      const controls = animate(motionValue, value, {
        duration,
        ease: [0.16, 1, 0.3, 1],
      });
      return () => controls.stop();
    }
    motionValue.set(0);
  }, [inView, value, duration, prefersReduced, motionValue]);

  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  );
}
