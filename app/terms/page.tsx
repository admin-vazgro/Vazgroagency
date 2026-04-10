import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service — Vazgro",
  description: "Vazgro terms of service for website use, project delivery, payments, intellectual property, and service engagements.",
};

const sections = [
  {
    title: "1. ACCEPTANCE OF TERMS",
    body: [
      "By accessing vazgro.com, contacting Vazgro, or purchasing any service from us, you agree to these Terms of Service.",
      "These terms apply to website visitors, prospective clients, and paying clients of Vazgro Ltd in relation to our digital, marketing, design, AI, and software services.",
    ],
  },
  {
    title: "2. SERVICES",
    body: [
      "Vazgro provides services including web design, development, branding, social media support, AI systems, automation, and custom digital product delivery.",
      "The exact scope, deliverables, timeline, and commercial terms for each engagement are confirmed in writing through a proposal, package description, invoice, statement of work, or email confirmation before work starts.",
    ],
  },
  {
    title: "3. PAYMENT TERMS",
    body: [
      "Launch packages are typically paid upfront. Grow subscriptions are billed in advance on the agreed billing cycle. Build projects may require a deposit and staged payments as agreed in writing.",
      "All listed prices are in GBP unless otherwise stated. Fees do not include third-party software, hosting, ad spend, or platform fees unless explicitly included in your agreement.",
      "Late or failed payments may pause delivery, access, deployment, handover, or support until payment is received in full.",
    ],
  },
  {
    title: "4. DELIVERABLES & IP TRANSFER",
    body: [
      "Unless a different arrangement is agreed in writing, ownership of final approved deliverables transfers to the client after full payment has been received.",
      "Vazgro retains ownership of pre-existing tools, methods, code libraries, internal processes, and working files that are not expressly sold as part of the final deliverable.",
      "We may showcase completed work in our portfolio, case studies, and marketing unless confidentiality terms or a written restriction apply.",
    ],
  },
  {
    title: "5. REVISIONS",
    body: [
      "Each service includes only the revision rounds stated in the package, proposal, or engagement terms.",
      "Feedback should be provided clearly and in a consolidated format. Additional scope, repeated reversals, or extra revision rounds may be quoted separately.",
    ],
  },
  {
    title: "6. CLIENT RESPONSIBILITIES",
    body: [
      "Clients are responsible for supplying accurate content, approvals, credentials, assets, and feedback needed for delivery.",
      "Delays in client responses, approvals, or content may shift timelines.",
      "You confirm that any materials you provide can lawfully be used by Vazgro for the agreed work and do not infringe third-party rights.",
    ],
  },
  {
    title: "7. CANCELLATIONS & REFUNDS",
    body: [
      "If a project is cancelled before work begins, Vazgro may issue a full or partial refund at its discretion depending on what has already been scheduled or reserved.",
      "Once work has started, refunds are generally limited to unperformed work. Discovery, strategy, setup, and already delivered work are non-refundable.",
      "Subscription cancellation rules, notice periods, and minimum terms are governed by the specific plan or agreement in place.",
    ],
  },
  {
    title: "8. LIMITATION OF LIABILITY",
    body: [
      "To the maximum extent permitted by law, Vazgro is not liable for indirect, consequential, special, incidental, or lost-profit damages arising from use of our website or services.",
      "Our total liability in connection with a specific claim will not exceed the fees paid for the service giving rise to that claim.",
    ],
  },
  {
    title: "9. CONFIDENTIALITY",
    body: [
      "Both parties agree to keep confidential any non-public commercial, technical, or strategic information shared during an engagement.",
      "This obligation does not apply to information that is already public, lawfully obtained from another source, or required to be disclosed by law.",
    ],
  },
  {
    title: "10. GOVERNING LAW",
    body: [
      "These terms are governed by the laws of England and Wales.",
      "Any dispute arising out of these terms or our services will be subject to the jurisdiction of the courts of England and Wales unless otherwise required by law.",
    ],
  },
  {
    title: "11. CHANGES TO TERMS",
    body: [
      "Vazgro may update these terms from time to time. The current version will always be posted on this page with an updated effective date.",
      "If you continue using the website or our services after a change takes effect, that continued use will be treated as acceptance of the updated terms.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      activePage="terms"
      eyebrow="// LEGAL"
      title="TERMS OF SERVICE"
      description="These terms govern use of the Vazgro website and any project, package, subscription, or custom build engagement entered into with Vazgro Ltd."
      effectiveDate="10 April 2026"
      sections={sections}
    />
  );
}
