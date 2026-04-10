import type { Metadata } from "next";
import ComingSoonPage from "@/components/ComingSoonPage";

export const metadata: Metadata = {
  title: "Partner Programme — Vazgro",
  description: "Vazgro partner programme. This page is coming soon.",
};

export default function PartnerProgrammePage() {
  return (
    <ComingSoonPage
      eyebrow="// RESOURCES"
      title="PARTNER PROGRAMME"
      description="We’re preparing details for referral and partner collaborations. This page is coming soon."
    />
  );
}
