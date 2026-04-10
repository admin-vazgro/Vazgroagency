import type { Metadata } from "next";
import ComingSoonPage from "@/components/ComingSoonPage";

export const metadata: Metadata = {
  title: "Client Portal — Vazgro",
  description: "Vazgro client portal. This page is coming soon.",
};

export default function ClientPortalPage() {
  return (
    <ComingSoonPage
      eyebrow="// RESOURCES"
      title="CLIENT PORTAL"
      description="We’re setting up a dedicated client portal experience for active engagements. This page is coming soon."
    />
  );
}
