import type { Metadata } from "next";
import ComingSoonPage from "@/components/ComingSoonPage";

export const metadata: Metadata = {
  title: "Blog — Vazgro",
  description: "Vazgro blog. This page is coming soon.",
};

export default function BlogPage() {
  return (
    <ComingSoonPage
      eyebrow="// INSIGHTS"
      title="BLOG"
      description="We’re working on a blog for insights on websites, marketing, AI systems, and product delivery. This page is coming soon."
    />
  );
}
