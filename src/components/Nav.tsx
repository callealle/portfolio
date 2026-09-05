"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { handleAnchorClick } from "@/lib/smoothScroll";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#hobbies", label: "Hobbies" },
  { href: "#resume", label: "Résumé" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 40,
  });

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.href.slice(1))).filter(
      (el): el is HTMLElement => Boolean(el),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.div
        className="h-[2px] origin-left bg-accent"
        style={{ scaleX: progress }}
      />
      <div className="flex items-center justify-between px-6 py-5 sm:px-10">
        <a
          href="#hero"
          onClick={(e) => handleAnchorClick(e, "#hero")}
          className="font-display text-sm font-bold tracking-tight"
        >
          CC<span className="text-accent">.</span>
        </a>

        <nav className="glass hidden items-center gap-1 rounded-full px-2 py-1.5 shadow-soft md:flex">
          {LINKS.map((link) => {
            const isActive = active === link.href.slice(1);
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className={`relative rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-widest transition-colors ${
                  isActive ? "text-bg" : "text-ink-muted hover:text-ink"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-ink"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{link.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
            <kbd className="rounded border border-line px-1.5 py-0.5">
              ⌘K
            </kbd>
          </span>
          <a
            href="#contact"
            onClick={(e) => handleAnchorClick(e, "#contact")}
            className="font-mono text-[11px] uppercase tracking-widest text-ink-muted transition-colors hover:text-ink"
          >
            Let&apos;s talk →
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
          className="glass flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-full md:hidden"
        >
          <motion.span
            className="h-px w-4 bg-ink"
            animate={{ rotate: open ? 45 : 0, y: open ? 2.5 : 0 }}
          />
          <motion.span
            className="h-px w-4 bg-ink"
            animate={{ rotate: open ? -45 : 0, y: open ? -2.5 : 0 }}
          />
        </button>
      </div>

      <motion.nav
        initial={false}
        animate={open ? "open" : "closed"}
        variants={{
          open: { height: "auto", opacity: 1 },
          closed: { height: 0, opacity: 0 },
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="glass overflow-hidden md:hidden"
      >
        <div className="flex flex-col gap-1 px-6 pb-6">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                handleAnchorClick(e, link.href);
                setOpen(false);
              }}
              className="border-b border-line py-3 font-mono text-xs uppercase tracking-widest text-ink/80"
            >
              {link.label}
            </a>
          ))}
        </div>
      </motion.nav>
    </header>
  );
}
