import type { Metadata } from "next";
import ComingSoonPage from "@/components/ComingSoonPage";

export const metadata: Metadata = {
  title: "About — Vazgro",
  description: "About Vazgro. This page is coming soon.",
};

export default function AboutPage() {
  return (
    <ComingSoonPage
      eyebrow="// COMPANY"
      title="ABOUT VAZGRO"
      description="We’re preparing a proper about page with our story, working model, and the way we build for clients. For now, this page is coming soon."
    />
  );
}
