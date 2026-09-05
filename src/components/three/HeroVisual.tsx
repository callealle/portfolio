"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => <FallbackVisual />,
});

function FallbackVisual() {
  return (
    <div
      className="h-full w-full"
      style={{
        background:
          "radial-gradient(circle at 35% 30%, var(--accent) 0%, var(--accent-2) 55%, var(--accent-3) 100%)",
      }}
    />
  );
}

function canRender3D() {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (prefersReduced) return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")),
    );
  } catch {
    return false;
  }
}

/**
 * Renders the 3D hero scene once mounted on the client, after confirming
 * WebGL support and that the visitor hasn't asked for reduced motion.
 * Server/first paint always shows the static gradient fallback so there's
 * no hydration mismatch — this is a one-time environment check, not
 * state we're mirroring from props, so the effect->setState here is the
 * correct escape hatch rather than something to lift into render.
 */
export function HeroVisual({ className }: { className?: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client capability check to avoid SSR/hydration mismatch
    setReady(canRender3D());
  }, []);

  return <div className={className}>{ready ? <HeroScene /> : <FallbackVisual />}</div>;
}
