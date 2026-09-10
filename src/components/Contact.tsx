"use client";

import { TextReveal } from "./motion/TextReveal";
import { MagneticButton } from "./motion/MagneticButton";
import { ScrollReveal } from "./motion/ScrollReveal";
import { profile } from "@/lib/content";

export function Contact() {
  return (
    <section
      id="contact"
      className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-24 sm:px-10 sm:py-32"
    >
      <div className="mb-12 flex items-baseline gap-4 sm:mb-16">
        <span className="font-mono text-xs text-ink-faint">07</span>
        <span className="h-px flex-1 bg-line" />
        <span className="font-mono text-xs uppercase tracking-widest text-ink-faint">
          Contact
        </span>
      </div>

      <TextReveal
        as="h2"
        text="Let's build something."
        className="heading-section font-display max-w-3xl"
      />

      <MagneticButton strength={0.15} className="mt-10 inline-block">
        <a
          href={`mailto:${profile.person.email}`}
          className="font-display inline-block text-2xl font-bold text-accent underline decoration-accent/40 underline-offset-8 transition-colors hover:decoration-accent sm:text-3xl"
        >
          {profile.person.email}
        </a>
      </MagneticButton>

      <ScrollReveal delay={0.1}>
        <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-8">
          <div className="flex flex-wrap gap-6 font-mono text-xs uppercase tracking-widest text-ink-faint">
            <a
              href={profile.person.linkedin}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-ink"
            >
              LinkedIn
            </a>
            {profile.person.github && (
              <a
                href={profile.person.github}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-ink"
              >
                GitHub
              </a>
            )}
            <span>{profile.person.phone}</span>
            <span>{profile.person.location}</span>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">
            © {new Date().getFullYear()} {profile.person.name}
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
