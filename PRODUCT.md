# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: recruiters and hiring managers evaluating Chlarence Callelero for
mid-level full-stack or backend developer roles, on-site in Cebu, Philippines
or fully remote. They arrive with limited time and a stack of other
candidates; the site's job is to make the case for an interview quickly,
not to replace a resume review entirely.

## Product Purpose

An interactive developer portfolio that introduces Chlarence as a candidate
worth interviewing. It's explicitly not a static resume page — the resume
content is real and verified, but the presentation (scroll-driven scenes,
3D hero centerpiece, replayable motion) is deliberately more memorable and
demonstrative of front-end craft than a PDF or a plain listing page could be.

## Positioning

Quantified, production-scale impact on a live system, not coursework or toy
projects: ~2 years shipping features on one live, multi-business-unit
enterprise inventory & financial platform (Java/Spring Boot + ReactJS +
MySQL/MariaDB), with real, verifiable numbers — a 60–70% report-load-time
reduction from stored-procedure optimization, and 150–200+ production
tickets resolved across GL/AP/AR, inventory, and sales modules. A portfolio
built entirely from personal/academic projects could not truthfully make
this claim.

## Operating Context

- Content is sourced entirely from `content/profile.json`, which is treated
  as the sole source of truth for professional facts (experience, projects,
  education, skills). No invented employers, metrics, or achievements —
  ever. Gaps (e.g. GitHub URL, hobbies content, downloadable resume file)
  are tracked as explicit TODOs in that file rather than filled in.
- Deployed to Vercel from a GitHub repo; git history and PRs follow a
  feature-branch workflow.
- The site is read in a single sitting, scrolling top to bottom through
  named sections: Hero, About, Skills, Experience, Projects, Hobbies,
  Résumé, Contact.

## Capabilities and Constraints

- Stack: Next.js (App Router, Turbopack) + TypeScript + Tailwind CSS v4 +
  Motion (`motion/react`) + GSAP (`@gsap/react`, ScrollTrigger) + Lenis
  (inertia scrolling) + React Three Fiber/drei/three (3D hero).
- The Hero's 3D centerpiece ("System Core") is an original, procedurally
  built hub-and-spoke node graph literally tied to the real platform's
  modules (Purchasing, Inventory, Sales, Financial) — not generic/abstract
  decoration, and not a copy of any third-party reference site's actual
  assets or source.
- Hobbies section content is a known, acknowledged gap (`profile.json`
  hobbies array is empty) — the section currently states plainly that it's
  unfilled rather than inventing content.
- No downloadable resume PDF is wired up yet; this is an open decision, not
  a silent omission.

## Brand Commitments

- Name/wordmark: "Chlarence Callelero", short-form mark "CC."
- Single accent color: amber/ember `#ff5a24`, used sparingly against a
  near-black (`#0a0a0c`) base — deliberately not a multi-hue system.
- Typography: Onest (display + body, weight-differentiated) and JetBrains
  Mono (labels/mono accents).
- Visual mood: dark, cinematic, minimal — inspired by (but not copying any
  source/assets/code from) Meng To's "Kage" — layered parallax, volumetric
  glow, generous negative space, slow scroll-driven reveals. This is a
  committed single visual identity, not a light/dark toggle.
- Contact/identity: calle121201@gmail.com, LinkedIn
  (linkedin.com/in/ccallelero), Cebu, Philippines. GitHub profile URL not
  yet provided (tracked as a TODO in `profile.json`).

## Evidence on Hand

- `content/profile.json` — verified resume-grounded content: one real
  employer (Alliance Software Incorporated, Technical Specialist I,
  July 2024–July 2026) plus one internship (AboitizPower Corporation), two
  real side projects (OJT Management System with ML; SPringBoard — AppCon
  finalist), real education (BS Computer Science, Cebu Institute of
  Technology–University, Aug 2020–June 2024), and a real skills breakdown.
- No testimonials, press, case-study write-ups beyond what's in
  `profile.json`, or downloadable resume file exist yet — future work must
  not fabricate any of these.
- Hobbies content explicitly does not exist yet; the user will supply it
  separately.

## Product Principles

1. Truth over polish: every fact traces to `content/profile.json`; no
   invented metrics, employers, or achievements, no matter how much a
   section would benefit from one.
2. One coherent visual world at a time: the whole site shares one design
   language end to end — no page left in an earlier, discarded style.
3. Demonstrate craft, don't just describe it: motion, 3D, and interaction
   choices exist to show front-end skill directly to a technical evaluator,
   not as decoration for its own sake.
4. Replayable, not one-shot: scroll-triggered reveals and animations should
   hold up to a recruiter scrolling up and down, not just a single linear
   pass.
5. Original work only: visual/creative references (Kage, sketchbook sites,
   etc.) inform mood and language; their actual source, assets, or branded
   content are never fetched or copied.

## Accessibility & Inclusion

No formal accessibility standard has been established. Baseline courtesy
only: `prefers-reduced-motion` is honored globally (animations/transitions
collapse to near-instant) as an existing, non-negotiable floor — not a
commitment to a specific WCAG level.
