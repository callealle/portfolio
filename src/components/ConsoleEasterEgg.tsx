"use client";

import { useEffect } from "react";

export function ConsoleEasterEgg() {
  useEffect(() => {
    console.log(
      "%cLooking under the hood?",
      "font-size: 16px; font-weight: bold; color: #ff4b1f;",
    );
    console.log(
      "%cPress ⌘K / Ctrl+K on this site for a command palette. Or just... hire me?",
      "font-size: 12px; color: #0d8c82;",
    );
  }, []);

  return null;
}
