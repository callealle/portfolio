import type { Metadata } from "next";
import { Onest, Italianno, Arimo, JetBrains_Mono } from "next/font/google";
import { profile } from "@/lib/content";
import { AtmosphericBackground } from "@/components/AtmosphericBackground";
import { CustomCursor } from "@/components/CustomCursor";
import { CommandPalette } from "@/components/CommandPalette";
import { ConsoleEasterEgg } from "@/components/ConsoleEasterEgg";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

// Closest free stand-ins for the requested (commercially licensed) pair,
// used only for the Hero name split -- "Chlarence" in the script, "Callelero"
// in the Helvetica-equivalent -- not the site-wide type system, which stays
// Onest. Citadel Script -> Italianno (Google Fonts, elegant formal cursive,
// single weight 400 -- font-bold/font-medium has no visible effect on it,
// expected for a script family). Helvetica Now -> Arimo (built explicitly as
// a metric-compatible Helvetica/Arial substitute).
const italianno = Italianno({
  variable: "--font-italianno",
  subsets: ["latin"],
  weight: "400",
});

const arimo = Arimo({
  variable: "--font-arimo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: `${profile.person.name} - Full-Stack Developer`,
  description: profile.summary,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${onest.variable} ${italianno.variable} ${arimo.variable} ${jetbrainsMono.variable}`}
    >
      <body className="grain relative min-h-full antialiased">
        {/* Scroll reveals (ScrollReveal/StaggerReveal/TextReveal) set their
            resting `animate` state to fully hidden by design, so whileInView
            can replay them on re-entry -- but that hidden state is inline
            style, baked into the SSR'd HTML itself, and only ever corrected
            by client JS running an IntersectionObserver. If JS fails to load
            or execute for any reason, the page would stay permanently blank
            with no error. This is the standard progressive-enhancement
            fallback: only applies when scripting is off, so it can safely be
            broad -- nothing else needs opacity/transform effects in that case. */}
        <noscript>
          <style>{`*{opacity:1 !important;transform:none !important;}`}</style>
        </noscript>
        <SmoothScroll />
        <AtmosphericBackground />
        <CustomCursor />
        <CommandPalette />
        <ConsoleEasterEgg />
        {children}
      </body>
    </html>
  );
}
