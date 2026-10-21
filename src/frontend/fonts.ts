import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";

// Shared by both root layouts (the site and the admin panel).
// latin-ext covers Karakalpak letters (á, ǵ, ı, ń, ó, ú); cyrillic covers Russian.
const sans = Geist({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-geist",
});
const mono = Geist_Mono({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-geist-mono",
});
// The italic display voice, used only for the largest headlines.
const display = Playfair_Display({
  subsets: ["latin", "latin-ext", "cyrillic"],
  style: ["italic"],
  weight: ["400"],
  variable: "--font-playfair",
});

/** Class names that define the font CSS variables; put them on <html>. */
export const fontVariables = `${sans.variable} ${mono.variable} ${display.variable}`;
