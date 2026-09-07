"use client";

import { motion } from "motion/react";
import { Section } from "./Section";
import { TextReveal } from "./motion/TextReveal";

export function Hobbies() {
  return (
    <Section
      id="hobbies"
      index="05"
      label="Outside work"
      title="Beyond the code"
      tone="inverted"
    >
      <div className="flex flex-col items-start gap-6 py-6">
        <TextReveal
          text="The personal side of the story is still being written."
          className="font-display max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl"
        />
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ amount: 0.6 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="max-w-md font-mono text-sm text-bg/60"
        >
          check back soon - this section updates once it ships.
        </motion.p>
      </div>
    </Section>
  );
}
