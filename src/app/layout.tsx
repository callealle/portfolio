import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { profile } from "@/lib/content";
import { AtmosphericBackground } from "@/components/AtmosphericBackground";
import { CustomCursor } from "@/components/CustomCursor";
import { CommandPalette } from "@/components/CommandPalette";
import { ConsoleEasterEgg } from "@/components/ConsoleEasterEgg";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: `${profile.person.name} — Full-Stack Developer`,
  description: profile.summary,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="grain relative min-h-full antialiased">
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
