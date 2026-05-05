import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import AppChrome from "@/components/AppChrome";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
        className={`${manrope.variable} h-full bg-white overflow-x-hidden`}
      >
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
