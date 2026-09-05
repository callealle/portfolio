"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

type Line = { prompt: string; output: string };

const SCRIPT: Line[] = [
  { prompt: "whoami", output: "chlarence callelero — full-stack developer" },
  { prompt: "stack --primary", output: "java/spring-boot · react · mysql/mariadb" },
  { prompt: "uptime --production", output: "2 years, 0 unresolved GL discrepancies" },
  { prompt: "status", output: "shipping. mentoring. optimizing queries." },
];

export function TerminalPanel({ className }: { className?: string }) {
  const prefersReduced = useReducedMotion();
  const [lineIndex, setLineIndex] = useState(() =>
    prefersReduced ? SCRIPT.length : 0,
  );
  const [charIndex, setCharIndex] = useState(0);
  const [phase, setPhase] = useState<"prompt" | "output" | "done">(() =>
    prefersReduced ? "done" : "prompt",
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReduced || lineIndex >= SCRIPT.length) return;

    const current = SCRIPT[lineIndex];
    const target = phase === "prompt" ? current.prompt : current.output;

    if (charIndex < target.length) {
      const t = setTimeout(() => setCharIndex((c) => c + 1), phase === "prompt" ? 38 : 14);
      return () => clearTimeout(t);
    }

    const pause = setTimeout(() => {
      if (phase === "prompt") {
        setPhase("output");
        setCharIndex(0);
      } else if (lineIndex + 1 >= SCRIPT.length) {
        setPhase("done");
        setLineIndex(SCRIPT.length);
      } else {
        setLineIndex((i) => i + 1);
        setCharIndex(0);
        setPhase("prompt");
      }
    }, phase === "prompt" ? 200 : 500);
    return () => clearTimeout(pause);
  }, [charIndex, phase, lineIndex, prefersReduced]);

  const completedLines = SCRIPT.slice(0, lineIndex);
  const current = SCRIPT[lineIndex];

  return (
    <div
      ref={ref}
      className={`glass shadow-lifted overflow-hidden rounded-2xl ${className ?? ""}`}
    >
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent-2/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink-faint/40" />
        <span className="ml-3 font-mono text-[11px] text-ink-faint">
          chlarence@portfolio:~
        </span>
      </div>

      <div className="min-h-[180px] space-y-2.5 p-5 font-mono text-[13px] leading-relaxed sm:text-sm">
        {completedLines.map((l, i) => (
          <div key={i}>
            <p>
              <span className="text-accent-2">❯</span>{" "}
              <span className="text-ink/90">{l.prompt}</span>
            </p>
            <p className="pl-4 text-ink-muted">{l.output}</p>
          </div>
        ))}

        {phase !== "done" && current && (
          <div>
            <p>
              <span className="text-accent-2">❯</span>{" "}
              <span className="text-ink/90">
                {phase === "prompt" ? current.prompt.slice(0, charIndex) : current.prompt}
              </span>
              {phase === "prompt" && <BlinkCursor />}
            </p>
            {phase === "output" && (
              <p className="pl-4 text-ink-muted">
                {current.output.slice(0, charIndex)}
                <BlinkCursor />
              </p>
            )}
          </div>
        )}

        {phase === "done" && (
          <p>
            <span className="text-accent-2">❯</span> <BlinkCursor />
          </p>
        )}
      </div>
    </div>
  );
}

function BlinkCursor() {
  return (
    <motion.span
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="ml-0.5 inline-block h-[1em] w-[7px] translate-y-[2px] bg-accent align-middle"
    />
  );
}
