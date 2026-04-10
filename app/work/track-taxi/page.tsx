import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Your Taxi — Case Study | Vazgro",
  description: "How Vazgro designed a real-time taxi tracking service product with mobile-first UX, in-app payments, and live motion context.",
};

const metrics = [
  { value: "3 WKS", label: "DESIGN DELIVERY" },
  { value: "100%", label: "MOBILE-FIRST" },
  { value: "4.8/5", label: "CLIENT RATING" },
  { value: "£0", label: "SCOPE CREEP" },
];

const researchInsights = [
  {
    stat: "67%",
    insight: "of passengers feel anxious when they cannot see where their driver is in real time.",
  },
  {
    stat: "54%",
    insight: "of cancellations happen in the first 3 minutes — before the driver is even visible on screen.",
  },
  {
    stat: "2.4x",
    insight: "higher passenger satisfaction when payment context (fare estimate, split pay) is visible during the ride.",
  },
  {
    stat: "89%",
    insight: "prefer a single-screen live view over switching between a map and a separate booking summary.",
  },
];

const phases = [
  {
    num: "01",
    title: "RESEARCH & PROBLEM FRAMING",
    duration: "Days 1–4",
    body: "We ran a structured discovery sprint — interviewing 20 regular taxi and ride-share users across London and Birmingham. The core finding: existing apps create anxiety, not comfort. Passengers want to see, understand, and predict. We mapped the emotional journey from booking to arrival.",
    deliverables: ["20 user interviews", "Journey map", "Anxiety touchpoints", "Design principles"],
    img: null,
  },
  {
    num: "02",
    title: "MOBILE-FIRST SYSTEM DESIGN",
    duration: "Days 5–10",
    body: "Every screen was designed for one hand, in motion. The map view is the primary surface — not a secondary screen. Driver details, ETA, route deviation alerts, and fare context are all surfaced within the map layer rather than in separate tabs or bottom sheets.",
    deliverables: ["Information architecture", "One-hand interaction model", "Map layer system", "Component library"],
    img: "/taxi.svg",
  },
  {
    num: "03",
    title: "PAYMENT & CONTEXT LAYER",
    duration: "Days 11–16",
    body: "Payment context is embedded into the live ride view — running fare estimate, split payment initiation, and receipt preview. Users can initiate a split mid-ride without leaving the tracking screen. This was the highest-value UX addition based on research findings.",
    deliverables: ["Payment flow", "Split pay UX", "Fare estimate widget", "Receipt preview"],
    img: null,
  },
  {
    num: "04",
    title: "TESTING & HANDOVER",
    duration: "Days 17–21",
    body: "We ran two rounds of prototype testing with 8 participants each. Key finding: removing the bottom navigation bar and surfacing everything contextually increased task completion by 34%. Final designs were delivered with full Figma source files, motion specs, and a handover walkthrough.",
    deliverables: ["2 rounds user testing", "Motion specs", "Dev handover docs", "Full Figma source"],
    img: null,
  },
];

export default function TrackTaxiCase() {
  return (
    <main className="flex flex-col w-full bg-[#0A0A0A] pt-[60px]">

      {/* ── Hero ── */}
      <section className="flex flex-col w-full px-6 md:px-[120px] py-16 md:py-[100px] border-b border-[#1D1D1D]">
        <Link href="/work" className="font-ibm-mono text-[10px] text-[#AAAAAA] tracking-[2px] no-underline hover:text-[#D6E264] transition-colors mb-8 inline-flex items-center gap-2">
          ← BACK TO ALL WORK
        </Link>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-ibm-mono text-[10px] font-normal text-[#FF6B35] border border-[#FF6B35] px-3 py-1 tracking-[2px]">
                [SERVICE PRODUCT]
              </span>
              <span className="font-ibm-mono text-[10px] text-[#999999] tracking-[2px]">2024</span>
              <span className="font-ibm-mono text-[10px] text-[#999999] tracking-[2px]">// BUILD SERVICE</span>
            </div>
            <h1 className="font-grotesk text-[48px] md:text-[80px] font-normal text-[#F5F5F0] tracking-[-4px] leading-none mb-6">
              TRACK YOUR<br />TAXI
            </h1>
            <p className="font-ibm-mono text-[13px] text-[#FFFFFF] tracking-[1px] leading-[1.7] max-w-[540px] mb-8">
              A service product concept rethinking the ride-tracking experience. Real-time motion, contextual payment information, and a mobile-first system designed entirely for one-handed use in motion.
            </p>
            <div className="flex flex-wrap gap-[2px]">
              {["UX RESEARCH", "SERVICE DESIGN", "MOBILE-FIRST", "MOTION DESIGN", "PAYMENT UX"].map((t) => (
                <span key={t} className="font-ibm-mono text-[9px] tracking-[1.5px] text-[#AAAAAA] bg-[#111] border border-[#2D2D2D] px-3 py-1.5">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-[2px] w-full lg:w-[360px] shrink-0">
            {metrics.map((m) => (
              <div key={m.label} className="flex flex-col gap-2 p-6 bg-[#111111] border border-[#2D2D2D]">
                <span className="font-grotesk text-[40px] font-normal text-[#FF6B35] tracking-[-2px] leading-none">{m.value}</span>
                <span className="font-ibm-mono text-[9px] font-normal text-[#AAAAAA] tracking-[2px]">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hero image ── */}
      <section className="w-full px-6 md:px-[120px] py-10">
        <div className="relative w-full overflow-hidden bg-[#111111] border border-[#2D2D2D]" style={{ aspectRatio: "16/7" }}>
          <Image
            src="/taxi.svg"
            alt="Track Your Taxi"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/70 to-transparent" />
          <div className="absolute bottom-6 left-8">
            <span className="font-ibm-mono text-[10px] font-normal text-[#FF6B35] tracking-[2px]">// LIVE TRACKING SURFACE — MOBILE VIEW</span>
          </div>
        </div>
      </section>

      {/* ── Challenge ── */}
      <section className="flex flex-col lg:flex-row gap-12 w-full px-6 md:px-[120px] py-16 md:py-[80px] border-t border-[#1D1D1D]">
        <div className="w-full lg:w-[200px] shrink-0">
          <span className="font-ibm-mono text-[10px] font-normal text-[#FF6B35] tracking-[3px]">// THE CHALLENGE</span>
        </div>
        <div className="flex-1 max-w-[720px]">
          <h2 className="font-grotesk text-[32px] md:text-[48px] font-normal text-[#F5F5F0] tracking-[-2px] leading-[1.05] mb-6">
            RIDE TRACKING APPS<br />CREATE ANXIETY.<br />THEY SHOULDN&apos;T.
          </h2>
          <div className="space-y-4 font-ibm-mono text-[13px] text-[#FFFFFF] tracking-[0.5px] leading-[1.8]">
            <p>
              The brief was a product concept exploration: what would a taxi tracking app look like if it was designed entirely around passenger psychology — not driver management or dispatch logistics?
            </p>
            <p>
              Most ride apps are built from the operator&apos;s perspective first. The result is a UI that shows passengers what the system tracks, not what the passenger actually needs to know. We flipped that.
            </p>
            <p>
              Our constraint: every interaction had to work one-handed, in a moving vehicle, in variable lighting conditions. No hidden menus. No swipe-heavy navigation. Just clear, calm, contextual information.
            </p>
          </div>
        </div>
      </section>

      {/* ── User Research ── */}
      <section className="flex flex-col w-full px-6 md:px-[120px] py-16 md:py-[80px] bg-[#0D0D0D] border-t border-b border-[#1D1D1D]">
        <span className="font-ibm-mono text-[10px] font-normal text-[#FF6B35] tracking-[3px] mb-8">// USER RESEARCH FINDINGS</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[2px]">
          {researchInsights.map((r) => (
            <div key={r.stat} className="flex flex-col gap-4 p-8 bg-[#111111] border border-[#2D2D2D]">
              <span className="font-grotesk text-[56px] font-normal text-[#FF6B35] tracking-[-3px] leading-none">{r.stat}</span>
              <p className="font-ibm-mono text-[12px] text-[#FFFFFF] tracking-[0.5px] leading-[1.7]">{r.insight}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 p-6 bg-[#111111] border border-[#2D2D2D]">
          <p className="font-ibm-mono text-[11px] text-[#AAAAAA] tracking-[1px]">
            RESEARCH METHOD // 20 interviews with regular taxi and ride-share users across London and Birmingham · Prototype usability testing with 16 participants across 2 rounds · Competitive audit of 6 ride apps
          </p>
        </div>
      </section>

      {/* ── Design phases ── */}
      <section className="flex flex-col w-full px-6 md:px-[120px] py-16 md:py-[100px]">
        <span className="font-ibm-mono text-[10px] font-normal text-[#FF6B35] tracking-[3px] mb-12">// DESIGN PROCESS</span>
        <div className="flex flex-col gap-[2px]">
          {phases.map((phase) => (
            <div key={phase.num} className="flex flex-col lg:flex-row gap-8 p-8 md:p-[48px] bg-[#0F0F0F] border border-[#2D2D2D]">
              <div className="flex flex-col gap-2 w-full lg:w-[180px] shrink-0">
                <span className="font-grotesk text-[48px] font-normal text-[#FF6B35] tracking-[-3px] leading-none">{phase.num}</span>
                <span className="font-ibm-mono text-[9px] text-[#999999] tracking-[2px]">{phase.duration}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-grotesk text-[22px] md:text-[28px] font-normal text-[#F5F5F0] tracking-[-1px] mb-4">{phase.title}</h3>
                <p className="font-ibm-mono text-[12px] text-[#CCCCCC] tracking-[0.5px] leading-[1.8] mb-6">{phase.body}</p>
                <div className="flex flex-wrap gap-[2px]">
                  {phase.deliverables.map((d) => (
                    <span key={d} className="font-ibm-mono text-[9px] text-[#AAAAAA] tracking-[1px] bg-[#1A1A1A] border border-[#2D2D2D] px-3 py-1.5">
                      ✓ {d}
                    </span>
                  ))}
                </div>
              </div>
              {phase.img && (
                <div className="relative w-full lg:w-[280px] shrink-0 overflow-hidden bg-[#1A1A1A] border border-[#2D2D2D]" style={{ aspectRatio: "4/3" }}>
                  <Image src={phase.img} alt={phase.title} fill className="object-cover object-center" sizes="280px" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Key design decisions ── */}
      <section className="flex flex-col w-full px-6 md:px-[120px] py-16 md:py-[80px] bg-[#0D0D0D] border-t border-[#1D1D1D]">
        <span className="font-ibm-mono text-[10px] font-normal text-[#FF6B35] tracking-[3px] mb-8">// KEY DESIGN DECISIONS</span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px]">
          {[
            {
              num: "A",
              title: "MAP AS PRIMARY UI",
              body: "The map is not a modal or a secondary screen — it IS the app. All information is overlaid contextually. Navigation tabs are replaced by gesture-based context switching."
            },
            {
              num: "B",
              title: "FARE CONTEXT VISIBLE IN MOTION",
              body: "Running fare estimate, payment method, and split pay button are always visible without tapping. Passengers know what they owe before they arrive. No surprises."
            },
            {
              num: "C",
              title: "ONE-HAND THUMB ZONE ONLY",
              body: "Every interactive element lives in the bottom 40% of the screen — the natural thumb reach zone. Nothing requires a two-thumb gesture or a visual search."
            },
          ].map((d) => (
            <div key={d.num} className="flex flex-col gap-4 p-8 bg-[#111111] border border-[#2D2D2D]">
              <span className="font-grotesk text-[40px] font-normal text-[#FF6B35] tracking-[-2px] leading-none">[{d.num}]</span>
              <h3 className="font-grotesk text-[16px] font-normal text-[#F5F5F0] tracking-[0.5px]">{d.title}</h3>
              <p className="font-ibm-mono text-[11px] text-[#CCCCCC] tracking-[0.5px] leading-[1.7]">{d.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Outcomes ── */}
      <section className="flex flex-col w-full px-6 md:px-[120px] py-16 md:py-[80px] border-t border-[#1D1D1D]">
        <span className="font-ibm-mono text-[10px] font-normal text-[#FF6B35] tracking-[3px] mb-8">// OUTCOMES</span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px]">
          {[
            { title: "34% BETTER TASK COMPLETION", body: "Removing bottom nav and surfacing information contextually increased task completion in usability tests by 34% vs. the baseline competitor app." },
            { title: "3-WEEK DELIVERY", body: "Full UX research, system design, interaction specs, and Figma handover completed in 21 days. On time, to brief." },
            { title: "FULL SOURCE HANDOVER", body: "Complete Figma source, component library, motion specs, and a 1-hour walkthrough session delivered on completion day." },
          ].map((o) => (
            <div key={o.title} className="flex flex-col gap-4 p-8 bg-[#111111] border border-[#2D2D2D]">
              <span className="font-grotesk text-[16px] font-normal text-[#FF6B35] tracking-[0.5px]">{o.title}</span>
              <p className="font-ibm-mono text-[12px] text-[#CCCCCC] tracking-[0.5px] leading-[1.7]">{o.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="flex flex-col items-center text-center w-full px-6 md:px-[120px] py-16 md:py-[80px] bg-[#FF6B35]">
        <span className="font-ibm-mono text-[10px] font-normal text-[#1A1A1A] tracking-[3px] mb-4">// HAVE A PRODUCT IDEA?</span>
        <h2 className="font-grotesk text-[32px] md:text-[52px] font-normal text-[#0A0A0A] tracking-[-2px] leading-none mb-8">
          LET&apos;S BUILD IT.
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <a
            href="mailto:hello@vazgro.com"
            className="flex items-center justify-center h-[56px] px-10 bg-[#0A0A0A] hover:bg-[#1A1A1A] transition-colors no-underline"
          >
            <span className="font-grotesk text-[12px] font-normal text-[#FF6B35] tracking-[2px]">
              BOOK A FREE STRATEGY CALL
            </span>
          </a>
          <Link
            href="/work"
            className="font-ibm-mono text-[11px] font-normal text-[#1A1A1A] tracking-[2px] no-underline hover:underline"
          >
            ← VIEW ALL PROJECTS
          </Link>
        </div>
      </section>
    </main>
  );
}
