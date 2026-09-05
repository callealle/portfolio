import Lenis from "lenis";
import type { MouseEvent } from "react";

let lenisInstance: Lenis | null = null;

export function setLenisInstance(instance: Lenis | null) {
  lenisInstance = instance;
}

export function getLenis() {
  return lenisInstance;
}

/**
 * Scrolls to a section, routed through Lenis when it's mounted (keeps
 * anchor jumps and inertia scrolling on the same clock), falling back to
 * native scrollIntoView if Lenis hasn't initialized yet (e.g. reduced
 * motion, or JS still hydrating).
 */
export function scrollToTarget(target: string, offset = -88) {
  const el =
    typeof target === "string" && target.startsWith("#")
      ? document.getElementById(target.slice(1))
      : null;
  if (!el) return;

  if (lenisInstance) {
    lenisInstance.scrollTo(el, { offset, duration: 1.2 });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

export function handleAnchorClick(
  e: MouseEvent,
  href: string,
  offset?: number,
) {
  if (!href.startsWith("#")) return;
  e.preventDefault();
  scrollToTarget(href, offset);
}
