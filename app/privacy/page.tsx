import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — Vazgro",
  description: "Vazgro privacy policy covering website data, enquiries, project communications, analytics, and your rights.",
};

const sections = [
  {
    title: "1. WHO WE ARE",
    body: [
      "Vazgro Ltd is a digital agency based in London, United Kingdom. This Privacy Policy explains how we collect, use, store, and protect personal data when you visit our website, contact us, or work with us as a client.",
      "If you have any privacy questions, you can contact us at hello@vazgro.com.",
    ],
  },
  {
    title: "2. DATA WE COLLECT",
    body: [
      "We may collect personal information you provide directly, including your name, email address, company name, phone number, project details, billing details, and any information included in enquiries or uploaded materials.",
      "We may also collect limited technical information such as device/browser data, IP address, referring pages, and website usage data through analytics or security tooling.",
    ],
  },
  {
    title: "3. HOW WE USE PERSONAL DATA",
    body: [
      "We use personal data to respond to enquiries, prepare proposals, deliver services, manage client relationships, process payments, improve our website, maintain security, and comply with legal obligations.",
      "We do not sell personal data to third parties.",
    ],
  },
  {
    title: "4. LEGAL BASES",
    body: [
      "Where UK GDPR or similar laws apply, we process personal data on one or more of the following bases: consent, performance of a contract, legitimate interests, compliance with legal obligations, or steps taken at your request before entering into a contract.",
    ],
  },
  {
    title: "5. COOKIES AND ANALYTICS",
    body: [
      "Our website may use cookies or similar technologies for performance, analytics, and security purposes. These tools help us understand how the website is used and improve the experience.",
      "If we add optional marketing or advertising cookies in the future, we will update this policy and any related consent flow accordingly.",
    ],
  },
  {
    title: "6. SHARING DATA",
    body: [
      "We may share data with trusted service providers who support our operations, such as hosting, analytics, payment, communication, scheduling, or collaboration platforms.",
      "We may also share data where required by law, to enforce our rights, or in connection with a business restructure or sale.",
    ],
  },
  {
    title: "7. DATA RETENTION",
    body: [
      "We keep personal data only for as long as reasonably necessary for the purpose it was collected, including ongoing project delivery, record keeping, legal compliance, dispute resolution, and business administration.",
      "Retention periods may vary depending on whether the data relates to enquiries, active client work, invoices, contracts, or legal obligations.",
    ],
  },
  {
    title: "8. SECURITY",
    body: [
      "We take reasonable technical and organisational measures to protect personal data against unauthorised access, loss, misuse, or disclosure.",
      "No system is guaranteed to be completely secure, so you should avoid sending highly sensitive information unless it is necessary and appropriate safeguards are in place.",
    ],
  },
  {
    title: "9. INTERNATIONAL TRANSFERS",
    body: [
      "Some of the service providers we use may process data outside the UK. Where that happens, we rely on appropriate safeguards such as contractual protections, adequacy decisions, or equivalent legal mechanisms where required.",
    ],
  },
  {
    title: "10. YOUR RIGHTS",
    body: [
      "Depending on your location and applicable law, you may have rights to access, correct, delete, restrict, object to, or request portability of your personal data.",
      "You may also have the right to withdraw consent where processing is based on consent and to complain to a relevant supervisory authority.",
    ],
  },
  {
    title: "11. POLICY UPDATES",
    body: [
      "We may update this Privacy Policy from time to time. When we do, we will publish the current version on this page and update the effective date.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      activePage="privacy"
      eyebrow="// LEGAL"
      title="PRIVACY POLICY"
      description="This policy explains what information Vazgro collects, why we collect it, how we use it, and the choices you may have regarding your personal data."
      effectiveDate="10 April 2026"
      sections={sections}
    />
  );
}
