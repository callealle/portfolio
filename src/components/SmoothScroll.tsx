"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { scrollToTarget, setLenisInstance } from "@/lib/smoothScroll";

/**
 * Boots Lenis for inertia scrolling and syncs it to GSAP's ticker so
 * ScrollTrigger reads the same scroll position/timing Lenis animates —
 * the standard Lenis + ScrollTrigger integration recipe. No-ops under
 * prefers-reduced-motion (native scroll stays instant/OS-controlled).
 */
export function SmoothScroll() {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });
    setLenisInstance(lenis);

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Lenis takes over scroll position on mount, which fights the browser's
    // native hash-scroll-into-view on a fresh load/reload — redo it once
    // Lenis is ready so direct navigation to e.g. /#about still lands correctly.
    if (window.location.hash) {
      requestAnimationFrame(() => {
        scrollToTarget(window.location.hash);
      });
    }

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      setLenisInstance(null);
    };
  }, []);

  return null;
}
