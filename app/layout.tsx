import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import AppChrome from "@/components/AppChrome";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Vazgro — More Customers, Stronger Brand, Faster Growth",
  description:
    "Vazgro: web design, marketing, and AI for growing businesses. Fixed-price launches, subscription-led growth, and custom digital builds.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} h-full bg-[#0A0A0A] overflow-x-hidden`}
      >
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
