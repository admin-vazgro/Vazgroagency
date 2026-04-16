import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build — Custom Apps, AI & Digital Products — Vazgro",
  description: "Senior engineers who think like founders. MVPs, AI systems, custom platforms, and mobile apps delivered from £3,999.",
};

const offers = [
  {
    ico: "🚀",
    category: "Product Builds",
    title: "MVP Development",
    desc: "Go from validated idea to working product in 4–8 weeks with senior product, design, and engineering support.",
    items: ["Full-stack Next.js or React Native builds", "Supabase or custom backend architecture", "Payments, auth, and analytics included", "Launch-ready deployment and handover"],
    accent: "#D6E264",
  },
  {
    ico: "🤖",
    category: "AI Systems",
    title: "AI Development",
    desc: "Custom AI solutions for chat, document workflows, knowledge retrieval, automation, and internal tooling.",
    items: ["OpenAI, Anthropic, and open-source models", "RAG pipelines and vector search", "Custom evaluation and guardrails", "GDPR-conscious system design"],
    accent: "#FF6B35",
  },
  {
    ico: "⚙️",
    category: "Platforms",
    title: "Custom Software",
    desc: "Bespoke internal tools, SaaS platforms, API integrations, and business-critical digital products.",
    items: ["Full-stack web application delivery", "Third-party API and workflow integrations", "Database design and migrations", "CI/CD and production setup"],
    accent: "#D6E264",
  },
  {
    ico: "📱",
    category: "Mobile",
    title: "Mobile Apps",
    desc: "Cross-platform mobile experiences built for iOS and Android from one production-grade codebase.",
    items: ["React Native or Expo delivery", "Push notifications and account systems", "App Store and Play Store support", "Backend APIs and admin tooling"],
    accent: "#D6E264",
  },
  {
    ico: "🔄",
    category: "Retainers",
    title: "Sprint Retainers",
    desc: "Ongoing development capacity for businesses with continuous product, platform, or AI delivery needs.",
    items: ["Dedicated delivery capacity", "Sprint-based prioritisation", "Weekly demos and planning", "Flexible scope evolution"],
    accent: "#D6E264",
  },
  {
    ico: "🤝",
    category: "Partnership",
    title: "Co-Founder Model",
    desc: "For the right opportunity, we work as a deeply involved technical partner rather than a standard vendor.",
    items: ["Sweat equity partnership model", "CTO-level product and technical direction", "Architecture, roadmap, and hiring support", "Investor-ready product thinking"],
    accent: "#D6E264",
  },
];

const pricing = [
  { title: "MVP FAST-TRACK", price: "£3,999–£8,000", time: "4–8 WEEKS", desc: "Working product with the core features needed to validate and sell." },
  { title: "AI PROJECT", price: "£5,000–£15,000", time: "3–8 WEEKS", desc: "Custom AI system, deployed with documentation and operational clarity." },
  { title: "CUSTOM PLATFORM", price: "£10,000–£25,000+", time: "8–16 WEEKS", desc: "Full SaaS or enterprise application with broader workflow complexity." },
  { title: "SPRINT RETAINER", price: "£2,500–£8,000/MO", time: "ONGOING", desc: "Dedicated build capacity for teams shipping continuously." },
];

const process = [
  { n: "01", title: "DISCOVERY", desc: "Free strategy call to understand goals, constraints, timelines, and commercial priorities." },
  { n: "02", title: "PROPOSAL", desc: "A scoped recommendation, timeline, and fixed-price or sprint-based delivery model." },
  { n: "03", title: "SPRINT 0", desc: "Product framing, design direction, architecture decisions, and execution setup." },
  { n: "04", title: "BUILD", desc: "Agile execution with demos, clear visibility, and continuous delivery discipline." },
  { n: "05", title: "LAUNCH", desc: "Production handover, documentation, and post-launch support so the product lands cleanly." },
];

export default function BuildPage() {
  return (
    <main className="flex flex-col w-full bg-[#0A0A0A] pt-[60px]">
      {/* Header */}
      <section className="flex flex-col w-full py-16 px-6 md:py-[100px] md:px-[120px] border-b border-[#1D1D1D]">
        <span className="font-ibm-mono text-[14px] font-normal text-[#D6E264] tracking-[3px]">
          // CUSTOM APPS · AI · DIGITAL BUILDS
        </span>
        <div className="h-5" />
        <h1 className="font-grotesk text-[48px] md:text-[80px] font-normal text-[#F5F5F0] tracking-[-3px] leading-none">
          🔧 BUILD
        </h1>
        <div className="h-4" />
        <p className="font-ibm-mono text-[14px] text-[#BBBBBB] tracking-[1px] leading-[1.6] max-w-[560px]">
          SENIOR ENGINEERS WHO THINK LIKE FOUNDERS. DESIGN-LED, AI-ASSISTED, OUTCOME-OBSESSED DELIVERY FROM MVP THROUGH TO PRODUCTION-GRADE SYSTEMS.
        </p>
        <div className="h-10" />
        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[2px]">
          {[
            ["FROM £3,999", "TYPICAL STARTING POINT"],
            ["4–8 WEEKS", "MVP DELIVERY WINDOW"],
            ["SPRINT 0", "INCLUDED IN BIGGER BUILDS"],
            ["SENIOR TEAM", "PRODUCT + ENGINEERING"],
          ].map(([val, label]) => (
            <div key={label} className="flex flex-col gap-2 p-6 bg-[#111111] border border-[#2D2D2D]">
              <span className="font-grotesk text-[24px] md:text-[30px] font-normal text-[#D6E264] tracking-[-1px] leading-none">
                {val}
              </span>
              <span className="font-ibm-mono text-[14px] text-[#AAAAAA] tracking-[2px]">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Offer cards */}
      <section className="flex flex-col w-full px-6 md:px-[120px] py-16 md:py-[80px]">
        <span className="font-ibm-mono text-[14px] font-normal text-[#AAAAAA] tracking-[3px] mb-8">// WHAT WE BUILD</span>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[2px]">
          {offers.map((item, i) => (
            <div
              key={item.title}
              className="flex flex-col gap-5 p-8 bg-[#0F0F0F] border border-[#2D2D2D]"
            >
              <div className="text-[28px]">{item.ico}</div>
              <div>
                <span className="font-ibm-mono text-[14px] text-[#999999] tracking-[2px]">{item.category.toUpperCase()}</span>
                <h2 className="font-grotesk text-[26px] font-normal text-[#F5F5F0] tracking-[-1px] leading-none mt-1">
                  {item.title}
                </h2>
                <p className="font-ibm-mono text-[14px] text-[#BBBBBB] tracking-[1px] leading-[1.6] mt-2 max-w-[320px]">
                  {item.desc}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {item.items.map((feat) => (
                  <div key={feat} className="flex items-start gap-2">
                    <span className="font-ibm-mono text-[14px] text-[#D6E264] mt-0.5">→</span>
                    <span className="font-ibm-mono text-[14px] text-[#CCCCCC] tracking-[0.5px] leading-[1.5]">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing guide */}
      <section className="flex flex-col w-full px-6 md:px-[120px] py-16 md:py-[80px] border-t border-[#1D1D1D]">
        <span className="font-ibm-mono text-[14px] font-normal text-[#D6E264] tracking-[3px] mb-4">// TRANSPARENT PRICING</span>
        <h2 className="font-grotesk text-[32px] md:text-[48px] font-normal text-[#F5F5F0] tracking-[-2px] leading-none mb-3">
          BUILD PRICING GUIDE
        </h2>
        <p className="font-ibm-mono text-[14px] text-[#AAAAAA] tracking-[1px] leading-[1.6] mb-10 max-w-[500px]">
          EVERY PROJECT IS SCOPED INDIVIDUALLY. THESE RANGES HELP YOU BUDGET BEFORE WE SHAPE THE FINAL BRIEF.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[2px]">
          {pricing.map((item) => (
            <div key={item.title} className="flex flex-col gap-3 p-8 bg-[#0F0F0F] border border-[#2D2D2D] text-center">
              <h3 className="font-ibm-mono text-[14px] font-normal text-[#CCCCCC] tracking-[2px]">{item.title}</h3>
              <span className="font-grotesk text-[24px] font-normal text-[#F5F5F0] tracking-[-1px] leading-none">
                {item.price}
              </span>
              <span className="font-ibm-mono text-[14px] text-[#D6E264] tracking-[2px]">{item.time}</span>
              <p className="font-ibm-mono text-[14px] text-[#BBBBBB] tracking-[0.5px] leading-[1.6]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="flex flex-col w-full px-6 md:px-[120px] py-16 md:py-[80px] border-t border-[#1D1D1D]">
        <span className="font-ibm-mono text-[14px] font-normal text-[#D6E264] tracking-[3px] mb-4">// OUR PROCESS</span>
        <h2 className="font-grotesk text-[32px] md:text-[48px] font-normal text-[#F5F5F0] tracking-[-2px] leading-none mb-10">
          HOW WE BUILD.
        </h2>
        <div className="flex flex-col border-t border-[#1D1D1D]">
          {process.map((step) => (
            <div
              key={step.n}
              className="grid gap-4 py-8 border-b border-[#1D1D1D] md:grid-cols-[80px_minmax(0,1fr)] md:gap-10"
            >
              <span className="font-grotesk text-[32px] font-normal text-[#2D2D2D] tracking-[-2px] leading-none">
                {step.n}
              </span>
              <div>
                <h3 className="font-grotesk text-[22px] font-normal text-[#F5F5F0] tracking-[-1px] mb-2">{step.title}</h3>
                <p className="font-ibm-mono text-[14px] text-[#BBBBBB] tracking-[0.5px] leading-[1.7] max-w-[680px]">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="flex flex-col items-center text-center w-full px-6 md:px-[120px] py-16 md:py-[80px] border-t border-[#1D1D1D] bg-[#0F0F0F]">
        <span className="font-ibm-mono text-[14px] font-normal text-[#D6E264] tracking-[3px] mb-4">// GOT AN IDEA?</span>
        <h2 className="font-grotesk text-[32px] md:text-[52px] font-normal text-[#F5F5F0] tracking-[-2px] leading-none mb-3">
          LET&apos;S BUILD IT.
        </h2>
        <p className="font-ibm-mono text-[14px] text-[#AAAAAA] tracking-[1px] leading-[1.6] mb-8 max-w-[440px]">
          FREE 30-MINUTE STRATEGY CALL. DETAILED PROPOSAL WITHIN 48 HOURS.
        </p>
        <div className="flex flex-col sm:flex-row gap-[2px]">
          <a
            href="mailto:hello@vazgro.com"
            className="flex items-center justify-center h-[56px] px-10 bg-[#D6E264] hover:bg-[#c9d64f] transition-colors no-underline"
          >
            <span className="font-grotesk text-[14px] font-normal text-[#0A0A0A] tracking-[2px]">
              BOOK YOUR STRATEGY CALL
            </span>
          </a>
          <Link
            href="/work"
            className="flex items-center justify-center h-[56px] px-10 bg-[#111111] border border-[#2D2D2D] hover:border-[#444] transition-colors no-underline"
          >
            <span className="font-grotesk text-[14px] font-normal text-[#F5F5F0] tracking-[2px]">
              SEE OUR BUILD WORK →
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
