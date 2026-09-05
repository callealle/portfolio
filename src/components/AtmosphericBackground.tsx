"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

/**
 * Fixed, decorative gradient layer that drifts slowly with scroll for
 * depth. Continuous scroll-linked motion (not a viewport-triggered
 * reveal) — it never "finishes," it just tracks position.
 */
export function AtmosphericBackground() {
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 25]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <motion.div
        style={{
          y: prefersReduced ? 0 : y1,
          background:
            "radial-gradient(closest-side, var(--accent), transparent)",
        }}
        className="absolute -top-[20%] -left-[10%] h-[60vh] w-[60vw] rounded-full opacity-[0.16] blur-[110px]"
      />
      <motion.div
        style={{
          y: prefersReduced ? 0 : y2,
          rotate: prefersReduced ? 0 : rotate,
          background:
            "radial-gradient(closest-side, var(--accent-2), transparent)",
        }}
        className="absolute top-[40%] -right-[15%] h-[70vh] w-[50vw] rounded-full opacity-[0.14] blur-[130px]"
      />
      <div
        style={{
          background:
            "radial-gradient(closest-side, var(--accent-3), transparent)",
        }}
        className="absolute bottom-[-10%] left-[20%] h-[45vh] w-[45vw] rounded-full opacity-[0.1] blur-[100px]"
      />
    </div>
  );
}
