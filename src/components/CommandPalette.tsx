"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { profile } from "@/lib/content";
import { scrollToTarget } from "@/lib/smoothScroll";

type Command = {
  id: string;
  label: string;
  hint?: string;
  run: () => void;
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (isCmdK) {
        e.preventDefault();
        setOpen((v) => !v);
        setMessage(null);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const commands: Command[] = useMemo(
    () => [
      ...[
        ["about", "Go to About"],
        ["skills", "Go to Skills"],
        ["experience", "Go to Experience"],
        ["projects", "Go to Projects"],
        ["hobbies", "Go to Hobbies"],
        ["resume", "Go to Résumé"],
        ["contact", "Go to Contact"],
      ].map(([id, label]) => ({
        id,
        label,
        hint: "navigate",
        run: () => {
          scrollToTarget(`#${id}`);
          setOpen(false);
        },
      })),
      {
        id: "resume-pdf",
        label: "Open résumé PDF",
        hint: "file",
        run: () => window.open("/resume.pdf", "_blank"),
      },
      {
        id: "linkedin",
        label: "Open LinkedIn profile",
        hint: "link",
        run: () => window.open(profile.person.linkedin, "_blank"),
      },
      {
        id: "email",
        label: `Copy email (${profile.person.email})`,
        hint: "clipboard",
        run: async () => {
          await navigator.clipboard.writeText(profile.person.email);
          setMessage("Email copied to clipboard.");
        },
      },
      {
        id: "whoami",
        label: "whoami",
        hint: "fun",
        run: () =>
          setMessage(
            `${profile.person.name} - full-stack developer, coffee-optional, bug-report-tolerant.`,
          ),
      },
      {
        id: "sandwich",
        label: "sudo make me a sandwich",
        hint: "fun",
        run: () => setMessage("Permission denied: you are not root. Nice try though."),
      },
    ],
    [],
  );

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-start justify-center bg-bg-sunken/60 pt-[15vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="glass w-full max-w-lg overflow-hidden rounded-2xl shadow-lifted"
          >
            <div className="flex items-center gap-3 border-b border-line px-5 py-4">
              <span className="font-mono text-xs text-accent">$</span>
              <input
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setMessage(null);
                }}
                placeholder="Type a command…"
                className="w-full bg-transparent font-mono text-sm text-ink outline-none placeholder:text-ink-faint"
              />
              <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-ink-faint">
                esc
              </kbd>
            </div>

            {message ? (
              <p className="px-5 py-6 font-mono text-sm text-ink-muted">
                {message}
              </p>
            ) : (
              <ul className="max-h-80 overflow-y-auto p-2">
                {filtered.length === 0 && (
                  <li className="px-3 py-4 text-sm text-ink-faint">
                    No matches.
                  </li>
                )}
                {filtered.map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={c.run}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-ink/85 transition-colors hover:bg-accent-soft hover:text-ink"
                    >
                      <span>{c.label}</span>
                      {c.hint && (
                        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                          {c.hint}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
