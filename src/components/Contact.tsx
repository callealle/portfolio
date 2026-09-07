"use client";

import dynamic from "next/dynamic";
import { TextReveal } from "./motion/TextReveal";
import { MagneticButton } from "./motion/MagneticButton";
import { ScrollReveal } from "./motion/ScrollReveal";
import { profile } from "@/lib/content";

// Loaded client-only, decorative-only: a large, low-opacity glass-warp echo
// of the closing line, sitting behind the real (always-visible, accessible)
// TextReveal heading below -- not a replacement for it. This is the site's
// last full-content beat before the ask, and the critique that flagged it
// as under-invested suggested exactly this kind of extra "signature moment"
// near the close, without touching the reliable heading itself.
const WarpText = dynamic(() => import("./react-bits/WarpText"), { ssr: false });

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

      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-6 -inset-y-10 -z-10 opacity-[0.12] sm:-inset-x-10"
        >
          <WarpText
            decorative
            text="Let's talk"
            color="#f5f4f1"
            fontSize="clamp(3rem, 11vw, 8rem)"
            fontWeight={600}
            warpStrength={0.06}
            pointerStrength={0.28}
            pointerInfluence={0.5}
            speed={0.4}
            refraction={0.012}
            // See HeroName.tsx's note: WarpText's own CSS floors its root at
            // min-height:220px, which beats a smaller height:100% -- override
            // inline so this stays within its intended decorative bounds.
            style={{ height: "100%", minHeight: 0 }}
          />
        </div>

        <TextReveal
          as="h2"
          text="Let's build something."
          className="heading-section font-display max-w-3xl"
        />
      </div>

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
