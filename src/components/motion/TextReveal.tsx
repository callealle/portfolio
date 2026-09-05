"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0 } },
};

const word: Variants = {
  hidden: { opacity: 0, y: "100%" },
  visible: {
    opacity: 1,
    y: "0%",
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * Word-by-word reveal, replayable on scroll (reverses on exit, replays on
 * re-entry). Screen readers get the full string via aria-label; the
 * per-word spans are hidden from the accessibility tree.
 */
export function TextReveal({
  text,
  as: Tag = "span",
  className,
  delay = 0,
  amount = 0.6,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  amount?: number;
}) {
  const prefersReduced = useReducedMotion();
  const words = text.split(" ");

  if (prefersReduced) {
    return (
      <Tag className={className}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag className={className} aria-label={text}>
      <motion.span
        className="inline"
        variants={container}
        initial="hidden"
        animate="hidden"
        whileInView="visible"
        viewport={{ amount, margin: "0px 0px -10% 0px" }}
        transition={{ delayChildren: delay }}
        aria-hidden="true"
      >
        {words.map((w, i) => (
          <span
            key={i}
            className="inline-block overflow-hidden pb-[0.08em] align-bottom"
          >
            <motion.span className="inline-block" variants={word}>
              {w}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
