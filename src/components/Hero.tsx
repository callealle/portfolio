"use client";

import { motion } from "motion/react";
import { TextReveal } from "./motion/TextReveal";
import { ParallaxElement } from "./motion/ParallaxElement";
import { MagneticButton } from "./motion/MagneticButton";
import { TerminalPanel } from "./TerminalPanel";
import { GsapStat } from "./GsapStat";
import { HeroVisual } from "./three/HeroVisual";
import { profile } from "@/lib/content";
import { handleAnchorClick } from "@/lib/smoothScroll";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col overflow-hidden pt-28"
    >
      <ParallaxElement range={100} className="pointer-events-none absolute inset-0">
        <div
          className="h-full w-full"
          style={{
            maskImage:
              "radial-gradient(ellipse 85% 75% at 68% 30%, black 55%, transparent 92%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 85% 75% at 68% 30%, black 55%, transparent 92%)",
          }}
        >
          <HeroVisual className="h-full w-full" />
        </div>
      </ParallaxElement>

      <div
        aria-hidden="true"
        className="absolute right-[8%] top-[38vh] h-[28vh] w-px bg-ink/15 sm:right-[20%]"
      />

      <ParallaxElement
        range={-60}
        className="pointer-events-none absolute left-6 top-1/2 hidden -translate-y-1/2 [writing-mode:vertical-rl] sm:left-10 lg:block"
      >
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-ink-faint">
          Design — Build — Maintain
        </span>
      </ParallaxElement>

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

          <TextReveal
            as="h1"
            text={profile.person.name}
            amount={0.4}
            className="font-display text-[13vw] font-bold uppercase leading-[0.92] tracking-tight sm:text-[7.5vw] lg:text-[5.2vw]"
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-8 max-w-xl text-base leading-relaxed text-ink/80 sm:text-lg"
          >
            I build and maintain a live enterprise inventory &amp; financial
            platform — <span className="text-ink">ReactJS</span>,{" "}
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
                className="inline-block rounded-full bg-ink px-6 py-3 font-mono text-xs uppercase tracking-widest text-bg shadow-soft transition-shadow hover:shadow-lifted"
              >
                View Projects
              </a>
            </MagneticButton>
            <MagneticButton strength={0.25}>
              <a
                href="#resume"
                onClick={(e) => handleAnchorClick(e, "#resume")}
                className="inline-block rounded-full border border-ink/25 px-6 py-3 font-mono text-xs uppercase tracking-widest transition-colors hover:border-ink"
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
          initial={{ opacity: 0, y: 24, rotate: -1.5 }}
          animate={{ opacity: 1, y: 0, rotate: -1.5 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative hidden lg:block"
        >
          {/* Ambient bleed from the 3D object, so the terminal card reads
              as lit from the same cool light source rather than sitting
              flat beside it. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-12 -z-10 opacity-70 blur-3xl"
            style={{
              background:
                "radial-gradient(closest-side at 75% -10%, var(--accent-2) 0%, var(--accent) 40%, var(--accent-3) 68%, transparent 82%)",
            }}
          />
          <TerminalPanel />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8 sm:px-10"
      >
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
      </motion.div>
    </section>
  );
}
