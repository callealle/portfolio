"use client";

import { Section } from "./Section";
import { HoverTilt } from "./motion/HoverTilt";
import { MagneticButton } from "./motion/MagneticButton";

export function Resume() {
  return (
    <Section id="resume" index="06" label="Résumé" title="The paper trail">
      <HoverTilt strength={2}>
        <div className="glass shadow-soft flex flex-col items-start justify-between gap-8 rounded-2xl p-8 sm:flex-row sm:items-center sm:p-12">
          <p className="max-w-md text-ink/75">
            Everything on this page, in one PDF: experience, tech stack, and
            education, ready to forward to a hiring team.
          </p>
          <div className="flex shrink-0 gap-3">
            <MagneticButton>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full bg-ink px-6 py-3 font-mono text-xs uppercase tracking-widest text-bg"
              >
                View Résumé
              </a>
            </MagneticButton>
            <MagneticButton strength={0.25}>
              <a
                href="/resume.pdf"
                download
                className="inline-block rounded-full border border-ink/25 px-6 py-3 font-mono text-xs uppercase tracking-widest transition-colors hover:border-ink"
              >
                Download
              </a>
            </MagneticButton>
          </div>
        </div>
      </HoverTilt>
    </Section>
  );
}
