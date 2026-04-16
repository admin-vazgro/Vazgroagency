import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Partner Programme — Vazgro",
  description: "Refer clients or close deals and earn commissions. Join the Vazgro partner programme.",
};

const tiers = [
  { tier: "Tier 1", range: "£0–£1,000 / month", closer: "10%", referrer: "5%" },
  { tier: "Tier 2", range: "£1,001–£3,000 / month", closer: "12%", referrer: "6%" },
  { tier: "Tier 3", range: "£3,001+ / month", closer: "15%", referrer: "7%" },
];

const pillars = [
  {
    name: "LAUNCH",
    description: "One-time website and digital projects.",
    examples: "Landing pages · Business sites · Brand kits · AI chatbots",
    range: "£149 – £999",
  },
  {
    name: "GROW",
    description: "Monthly retainers — ongoing service delivery.",
    examples: "Design · Development · Social media management",
    range: "From £349/mo",
  },
  {
    name: "BUILD",
    description: "Custom-scoped software and product builds.",
    examples: "MVPs · AI products · Custom platforms · Sprint retainers",
    range: "£3,999+",
  },
];

const faqs = [
  {
    q: "Who can join?",
    a: "Anyone who has a network of businesses that could benefit from Vazgro's services — agencies, freelancers, consultants, sales professionals.",
  },
  {
    q: "How does the tier system work?",
    a: "Tiers are calculated automatically each calendar month based on total closed revenue. Everyone starts at Tier 1 and upgrades as they close more business.",
  },
  {
    q: "Can I both refer a lead and close it myself?",
    a: "Yes. Every partner can submit referrals and also pick up and close leads from the shared pool. If someone else closes your referral, you still earn a referrer commission.",
  },
  {
    q: "When do I get paid?",
    a: "Commissions are approved after a 30-day claw-back window and paid via Stripe Connect directly to your bank account.",
  },
  {
    q: "What does KYC involve?",
    a: "A simple identity verification process via Stripe Connect to confirm your bank details for payouts. No complex paperwork.",
  },
];

export default function PartnerProgrammePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="border-b border-gray-200 px-8 py-20 lg:px-20">
        <div className="mx-auto max-w-[800px]">
          <span className="font-ibm-mono text-[12px] tracking-[3px] text-gray-500">// PARTNER PROGRAMME</span>
          <h1 className="mt-4 font-grotesk text-[52px] font-normal tracking-[-2px] text-gray-900 leading-[1.05]">
            Earn commissions<br />bringing clients to Vazgro.
          </h1>
          <p className="mt-6 font-ibm-mono text-[15px] leading-[1.9] text-gray-700 max-w-[560px]">
            Refer clients or actively close deals — earn up to 15% commission on every project you bring in.
            Tiers upgrade automatically as your monthly revenue grows.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/apply"
              className="bg-gray-900 px-8 py-4 font-ibm-mono text-[12px] tracking-[3px] text-white hover:bg-gray-700 transition-colors"
            >
              APPLY NOW →
            </Link>
            <Link
              href="/login"
              className="border border-gray-400 px-8 py-4 font-ibm-mono text-[12px] tracking-[3px] text-gray-700 hover:text-gray-900 hover:border-gray-700 transition-colors"
            >
              PARTNER LOGIN
            </Link>
          </div>
        </div>
      </section>

      {/* Commission tiers */}
      <section className="border-b border-gray-200 px-8 py-16 lg:px-20">
        <div className="mx-auto max-w-[900px]">
          <span className="font-ibm-mono text-[12px] tracking-[3px] text-gray-500">// COMMISSION TIERS</span>
          <h2 className="mt-3 font-grotesk text-[32px] font-normal tracking-[-0.5px] text-gray-900">
            Automatic tier upgrades based on monthly revenue.
          </h2>
          <p className="mt-4 font-ibm-mono text-[14px] leading-[1.9] text-gray-700 max-w-[620px]">
            Everyone starts at Tier 1. As you close more business in a calendar month, your tier — and commission rate — upgrades automatically.
            No applications or manual review required.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {tiers.map((t) => (
              <div key={t.tier} className="border border-gray-200 p-6">
                <p className="font-ibm-mono text-[12px] tracking-[2px] text-gray-900 font-medium">{t.tier.toUpperCase()}</p>
                <p className="mt-1 font-ibm-mono text-[13px] text-gray-600">{t.range}</p>
                <div className="mt-5 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="font-ibm-mono text-[12px] text-gray-600">Closer rate</span>
                    <span className="font-grotesk text-[28px] text-gray-900">{t.closer}</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-ibm-mono text-[12px] text-gray-600">Referrer rate</span>
                    <span className="font-grotesk text-[20px] text-gray-700">{t.referrer}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you can sell */}
      <section className="border-b border-gray-200 px-8 py-16 lg:px-20">
        <div className="mx-auto max-w-[900px]">
          <span className="font-ibm-mono text-[12px] tracking-[3px] text-gray-500">// SERVICES YOU PITCH</span>
          <h2 className="mt-3 font-grotesk text-[32px] font-normal tracking-[-0.5px] text-gray-900">
            Three pillars. Fixed and custom pricing.
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {pillars.map((p) => (
              <div key={p.name} className="border border-gray-200 p-6">
                <p className="font-ibm-mono text-[12px] tracking-[3px] text-gray-900 font-medium">{p.name}</p>
                <p className="mt-2 font-grotesk text-[24px] text-gray-900">{p.range}</p>
                <p className="mt-3 font-ibm-mono text-[13px] leading-[1.8] text-gray-700">{p.description}</p>
                <p className="mt-3 font-ibm-mono text-[12px] text-gray-500 leading-[1.7]">{p.examples}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-gray-200 px-8 py-16 lg:px-20">
        <div className="mx-auto max-w-[800px]">
          <span className="font-ibm-mono text-[12px] tracking-[3px] text-gray-500">// HOW IT WORKS</span>
          <h2 className="mt-3 font-grotesk text-[32px] font-normal tracking-[-0.5px] text-gray-900">Simple. You bring the client, we deliver.</h2>
          <div className="mt-8 space-y-8">
            {[
              { step: "01", title: "Apply", desc: "Submit your application. We review and respond within 1–2 business days." },
              { step: "02", title: "Get access", desc: "Receive your partner portal login. Submit leads, view the shared pool, and track your pipeline." },
              { step: "03", title: "Submit or claim a lead", desc: "Refer a client directly, or claim a warm lead from the shared pool and work it to close." },
              { step: "04", title: "Earn commission", desc: "When the deal closes, your commission is calculated automatically at your current tier rate and paid after the 30-day window." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-6">
                <span className="font-ibm-mono text-[15px] text-gray-400 shrink-0 w-8 mt-0.5">{step}</span>
                <div>
                  <p className="font-ibm-mono text-[14px] font-medium text-gray-900">{title}</p>
                  <p className="mt-2 font-ibm-mono text-[13px] leading-[1.8] text-gray-600">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-gray-200 px-8 py-16 lg:px-20">
        <div className="mx-auto max-w-[700px]">
          <span className="font-ibm-mono text-[12px] tracking-[3px] text-gray-500">// FAQ</span>
          <div className="mt-6 space-y-0">
            {faqs.map(({ q, a }) => (
              <div key={q} className="border-b border-gray-200 py-6">
                <p className="font-ibm-mono text-[14px] font-medium text-gray-900 mb-3">{q}</p>
                <p className="font-ibm-mono text-[13px] leading-[1.9] text-gray-600">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-20 lg:px-20 text-center">
        <h2 className="font-grotesk text-[40px] font-normal tracking-[-1px] text-gray-900">Ready to start earning?</h2>
        <p className="mt-4 font-ibm-mono text-[14px] text-gray-600">It takes 2 minutes to apply. We'll review and be in touch within 1–2 days.</p>
        <Link
          href="/apply"
          className="mt-8 inline-block bg-gray-900 px-10 py-4 font-ibm-mono text-[12px] tracking-[3px] text-white hover:bg-gray-700 transition-colors"
        >
          APPLY TO JOIN →
        </Link>
      </section>

    </div>
  );
}
