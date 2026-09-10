"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { HeroName } from "./HeroName";
import { MagneticButton } from "./motion/MagneticButton";
import { TerminalPanel } from "./TerminalPanel";
import { GsapStat } from "./GsapStat";
import { profile } from "@/lib/content";
import { handleAnchorClick } from "@/lib/smoothScroll";

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  // The scroll-driven exit "scene": content fades and sinks slightly as
  // the hero scrolls past.
  const exitOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const exitY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative flex min-h-screen flex-col overflow-hidden pt-28"
    >
      {/* Readability scrim. Originally added to dim the 3D System Core
          behind the copy; that visual has since been removed, but the scrim
          still earns its place holding the sitewide ColorBends streaks back
          from the text. Two stacked gradients: a vertical band covers the
          paragraph zone on narrow screens where the text column runs full
          width, and a horizontal band protects the text column on lg+,
          where the terminal panel shares the row. Translucent rather than
          solid --bg, so the background stays visible behind the hero. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(10,10,12,0.72) 12%, rgba(10,10,12,0.72) 62%, transparent 86%), linear-gradient(100deg, rgba(10,10,12,0.55) 0%, rgba(10,10,12,0.42) 40%, transparent 66%)",
        }}
      />

      <motion.div style={{ opacity: exitOpacity, y: exitY }} className="contents">
        <div className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-center gap-12 px-6 sm:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8 lg:pl-24">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-ink-faint"
            >
              Full-Stack Developer · Cebu, Philippines
            </motion.p>

            <HeroName
              name={profile.person.name}
              className="text-[15vw] uppercase leading-[0.92] tracking-tight sm:text-[9vw] lg:text-[6.5vw]"
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-8 max-w-xl text-base font-light leading-relaxed text-ink/70 sm:text-lg"
            >
              I build and maintain a live enterprise inventory &amp; financial
              platform: <span className="text-ink">ReactJS</span>,{" "}
              <span className="text-ink">Java / Spring Boot</span>, and{" "}
              <span className="text-ink">MySQL/MariaDB</span> in production.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.85 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <MagneticButton>
                <a
                  href="#projects"
                  onClick={(e) => handleAnchorClick(e, "#projects")}
                  className="inline-block rounded-sm bg-accent px-6 py-3 font-mono text-xs uppercase tracking-widest text-bg shadow-lifted transition-opacity hover:opacity-90"
                >
                  View Projects
                </a>
              </MagneticButton>
              <MagneticButton strength={0.25}>
                <a
                  href="#resume"
                  onClick={(e) => handleAnchorClick(e, "#resume")}
                  className="inline-block rounded-sm border border-line px-6 py-3 font-mono text-xs uppercase tracking-widest transition-colors hover:border-ink-muted"
                >
                  Résumé
                </a>
              </MagneticButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6"
            >
              <GsapStat value={2} suffix="+" label="Years in prod" />
              <GsapStat value={150} suffix="+" label="Tickets closed" />
              <GsapStat value={70} suffix="%" label="Faster reports" />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:block"
          >
            {/* Ambient bleed from the 3D core -- one accent, sparingly. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-12 -z-10 opacity-40 blur-3xl"
              style={{
                background:
                  "radial-gradient(closest-side at 50% 0%, var(--accent) 0%, transparent 70%)",
              }}
            />
            <TerminalPanel />
          </motion.div>
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8 sm:px-10">
          <div className="flex gap-6 font-mono text-xs uppercase tracking-widest text-ink-faint">
            <a
              href={profile.person.linkedin}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-ink"
            >
              LinkedIn
            </a>
            <a
              href={`mailto:${profile.person.email}`}
              className="transition-colors hover:text-ink"
            >
              Email
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
          </div>

          <MagneticButton strength={0.4}>
            <a
              href="#about"
              onClick={(e) => handleAnchorClick(e, "#about")}
              className="hidden items-center gap-3 font-mono text-xs uppercase tracking-widest text-ink-faint transition-colors hover:text-ink sm:flex"
            >
              <span>Explore</span>
              <motion.span
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="block h-4 w-px bg-current"
              />
            </a>
          </MagneticButton>
        </div>
      </motion.div>
    </section>
  );
}
