"use client";

import ColorBends from "./react-bits/ColorBends";

/**
 * Fixed, decorative background layer sitting behind every section that does
 * not paint its own opaque surface.
 *
 * Previously three blurred radial-gradient blobs drifting on scroll; now a
 * ColorBends shader (React Bits) fed the site's own tokens rather than its
 * demo palette, so it stays inside the one-accent rule: amber plus two
 * deeper embers of the same hue, nothing else.
 *
 * Sections that need their copy to stay legible hold this back themselves
 * (the hero's scrim, Section.tsx's translucent tones) rather than the
 * layer being dimmed globally, so it reads clearly where there is room.
 *
 * Reduced motion and the hidden-tab pause are handled inside ColorBends.
 */

// Module-level so the reference is stable -- an inline array literal would
// be a new reference every render and re-run the component's uniform sync.
// All three entries stay in the amber/ember family. A light neutral here
// (the #8f8d8a token) pushed the band peaks to near-white once summed and
// multiplied by intensity, and white peaks read brighter than the page's
// own white text -- headings started losing to the background. Keeping the
// palette warm caps the peaks below text brightness.
const PALETTE = ["#ff5a24", "#b8431a", "#6b3a1f"];

export function AtmosphericBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-[0.95]"
    >
      <ColorBends
        colors={PALETTE}
        rotation={90}
        autoRotate={1}
        speed={0.16}
        scale={1}
        frequency={1.8}
        warpStrength={1}
        mouseInfluence={0.5}
        parallax={0.4}
        noise={0.45}
        iterations={1}
        intensity={1.45}
        bandWidth={6}
        dpr={1.25}
        transparent
      />
    </div>
  );
}
