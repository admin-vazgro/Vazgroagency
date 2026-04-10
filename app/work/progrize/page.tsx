import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Progrize — Case Study | Vazgro",
  description: "How Vazgro designed and built Progrize — a multi-surface career platform with a mobile app, web platform, and AI-powered interview prep.",
};

const metrics = [
  { value: "5 WKS", label: "TOTAL DELIVERY" },
  { value: "3", label: "DISTINCT SURFACES" },
  { value: "4.9/5", label: "CLIENT RATING" },
  { value: "100%", label: "IP TRANSFERRED" },
];

const phases = [
  {
    num: "01",
    title: "DISCOVERY & SPRINT 0",
    duration: "Week 1",
    body: "We kicked off with a structured discovery session to map the user journey from job search to career progression. The founder's core insight: most career tools either overwhelm or under-deliver. We defined three surfaces — mobile app, web platform, and education layer — each with a distinct user mode.",
    deliverables: ["User journey mapping", "Information architecture", "Brand direction", "Sprint backlog"],
  },
  {
    num: "02",
    title: "PROGRIZE APP — MOBILE",
    duration: "Weeks 2–3",
    body: "The mobile app was designed mobile-first with a calm, clear UI. Job discovery flows are thumb-optimised with swipe-based shortlisting. Onboarding takes under 90 seconds. The visual language is intentionally quiet — no dark patterns, no notification spam, no algorithmic noise.",
    deliverables: ["48 screen designs", "Interaction prototypes", "Design system tokens", "Dev-ready specs"],
    img: "/progrize-app.svg",
  },
  {
    num: "03",
    title: "PROGRIZE WEB — DESKTOP",
    duration: "Week 3",
    body: "The desktop experience mirrors the app data but is built for longer sessions — research-mode browsing, AI-assisted job matching, and insight-led decision making. The layout breathes differently from the app, using more horizontal space for comparison and context.",
    deliverables: ["Desktop layout system", "Glassdoor-style review module", "AI match scoring UI", "Responsive breakpoints"],
    img: "/websiteprogrize.svg",
  },
  {
    num: "04",
    title: "PROGRIZE LEARN — EDTECH",
    duration: "Weeks 4–5",
    body: "The education layer is embedded inside the product so users never leave to 'study' separately. Interview question banks, AI-generated feedback on practice answers, and progress tracking keep users in flow. Content is contextually surfaced based on what the user is applying for.",
    deliverables: ["AI feedback integration", "Question bank UX", "Progress tracking", "Notification system"],
    img: "/progrizelearn.svg",
  },
];

const researchInsights = [
  {
    stat: "73%",
    insight: "of job seekers report feeling overwhelmed by the volume of job listings on mainstream platforms.",
  },
  {
    stat: "61%",
    insight: "abandon their job search within 2 weeks of starting — primarily due to poor UX and irrelevant matches.",
  },
  {
    stat: "4.1x",
    insight: "higher conversion from application to interview when candidates have AI-assisted prep before applying.",
  },
  {
    stat: "88%",
    insight: "of users prefer a calm, minimal UI for job searching vs. high-stimulation, feed-based platforms.",
  },
];

export default function ProgrizeCase() {
  return (
    <main className="flex flex-col w-full bg-[#0A0A0A] pt-[60px]">

      {/* ── Hero ── */}
      <section className="flex flex-col w-full px-6 md:px-[120px] py-16 md:py-[100px] border-b border-[#1D1D1D]">
        <Link href="/work" className="font-ibm-mono text-[10px] text-[#AAAAAA] tracking-[2px] no-underline hover:text-[#D6E264] transition-colors mb-8 inline-flex items-center gap-2">
          ← BACK TO ALL WORK
        </Link>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
          <div className="flex-1">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="font-ibm-mono text-[10px] font-normal text-[#D6E264] border border-[#D6E264] px-3 py-1 tracking-[2px]">
                [PRODUCT BUILD]
              </span>
              <span className="font-ibm-mono text-[10px] text-[#999999] tracking-[2px]">2024</span>
              <span className="font-ibm-mono text-[10px] text-[#999999] tracking-[2px]">// BUILD SERVICE</span>
            </div>
            <h1 className="font-grotesk text-[56px] md:text-[96px] font-normal text-[#F5F5F0] tracking-[-4px] leading-none mb-6">
              PROGRIZE
            </h1>
            <p className="font-ibm-mono text-[13px] text-[#FFFFFF] tracking-[1px] leading-[1.7] max-w-[540px] mb-8">
              A multi-surface career platform combining mobile-first job discovery, desktop-optimised career research, and an embedded AI interview prep layer. Built from concept to delivery in 5 weeks.
            </p>
            <div className="flex flex-wrap gap-[2px]">
              {["UX DESIGN", "MOBILE APP", "WEB PLATFORM", "AI INTEGRATION", "DESIGN SYSTEM"].map((t) => (
                <span key={t} className="font-ibm-mono text-[9px] tracking-[1px] md:tracking-[1.5px] text-[#AAAAAA] bg-[#111] border border-[#2D2D2D] px-3 py-1.5">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-[2px] w-full lg:w-[360px] shrink-0">
            {metrics.map((m) => (
              <div key={m.label} className="flex flex-col gap-2 p-6 bg-[#111111] border border-[#2D2D2D]">
                <span className="font-grotesk text-[40px] font-normal text-[#D6E264] tracking-[-2px] leading-none">{m.value}</span>
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
            src="/progrize-app.svg"
            alt="Progrize mobile app"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/60 to-transparent" />
          <div className="absolute bottom-6 left-8">
            <span className="font-ibm-mono text-[10px] font-normal text-[#D6E264] tracking-[2px]">// PROGRIZE APP — MOBILE SURFACE</span>
          </div>
        </div>
      </section>

      {/* ── Challenge ── */}
      <section className="flex flex-col lg:flex-row gap-12 w-full px-6 md:px-[120px] py-16 md:py-[80px] border-t border-[#1D1D1D]">
        <div className="w-full lg:w-[200px] shrink-0">
          <span className="font-ibm-mono text-[10px] font-normal text-[#D6E264] tracking-[3px]">// THE CHALLENGE</span>
        </div>
        <div className="flex-1 max-w-[720px]">
          <h2 className="font-grotesk text-[32px] md:text-[48px] font-normal text-[#F5F5F0] tracking-[-2px] leading-[1.05] mb-6">
            JOB PLATFORMS ARE BROKEN.<br />WE NEEDED TO FIX THEM.
          </h2>
          <div className="space-y-4 font-ibm-mono text-[13px] text-[#FFFFFF] tracking-[0.5px] leading-[1.8]">
            <p>
              The founder of Progrize came to Vazgro with a clear problem statement: every existing job platform is either a spammy feed or an overwhelming database. Neither helps candidates actually grow their careers.
            </p>
            <p>
              The brief was ambitious — build three interconnected surfaces that share data but feel native to their context: a calm mobile app for discovery, a research-focused desktop platform, and an education layer woven into the product itself.
            </p>
            <p>
              The technical challenge was equally complex: surface-specific layouts, shared design system, AI integration, and a 5-week delivery window.
            </p>
          </div>
        </div>
      </section>

      {/* ── User Research ── */}
      <section className="flex flex-col w-full px-6 md:px-[120px] py-16 md:py-[80px] bg-[#0D0D0D] border-t border-b border-[#1D1D1D]">
        <span className="font-ibm-mono text-[10px] font-normal text-[#D6E264] tracking-[3px] mb-8">// USER RESEARCH FINDINGS</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[2px]">
          {researchInsights.map((r) => (
            <div key={r.stat} className="flex flex-col gap-4 p-8 bg-[#111111] border border-[#2D2D2D]">
              <span className="font-grotesk text-[56px] font-normal text-[#D6E264] tracking-[-3px] leading-none">{r.stat}</span>
              <p className="font-ibm-mono text-[12px] text-[#FFFFFF] tracking-[0.5px] leading-[1.7]">{r.insight}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 p-6 bg-[#111111] border border-[#2D2D2D]">
          <p className="font-ibm-mono text-[11px] text-[#AAAAAA] tracking-[1px]">
            RESEARCH METHOD // 40 interviews with job seekers aged 22–35 across the UK and India · Usability testing on 3 prototype iterations · Competitive audit of 8 platforms
          </p>
        </div>
      </section>

      {/* ── Design phases ── */}
      <section className="flex flex-col w-full px-6 md:px-[120px] py-16 md:py-[100px]">
        <span className="font-ibm-mono text-[10px] font-normal text-[#D6E264] tracking-[3px] mb-12">// DESIGN & BUILD PROCESS</span>
        <div className="flex flex-col gap-[2px]">
          {phases.map((phase) => (
            <div key={phase.num} className="flex flex-col lg:flex-row gap-8 p-8 md:p-[48px] bg-[#0F0F0F] border border-[#2D2D2D]">
              <div className="flex flex-col gap-2 w-full lg:w-[180px] shrink-0">
                <span className="font-grotesk text-[48px] font-normal text-[#D6E264] tracking-[-3px] leading-none">{phase.num}</span>
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

      {/* ── Web & Learn screenshots ── */}
      <section className="flex flex-col w-full px-6 md:px-[120px] pb-16 md:pb-[80px] gap-[2px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px]">
          <div className="relative overflow-hidden bg-[#111] border border-[#2D2D2D]" style={{ aspectRatio: "16/9" }}>
            <Image src="/websiteprogrize.svg" alt="Progrize Web" fill className="object-cover" sizes="50vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
            <div className="absolute bottom-4 left-4">
              <span className="font-ibm-mono text-[9px] font-normal text-[#D6E264] tracking-[2px]">// WEB PLATFORM</span>
            </div>
          </div>
          <div className="relative overflow-hidden bg-[#111] border border-[#2D2D2D]" style={{ aspectRatio: "16/9" }}>
            <Image src="/progrizelearn.svg" alt="Progrize Learn" fill className="object-cover" sizes="50vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
            <div className="absolute bottom-4 left-4">
              <span className="font-ibm-mono text-[9px] font-normal text-[#FF6B35] tracking-[2px]">// LEARN LAYER</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section className="flex flex-col w-full px-6 md:px-[120px] py-16 md:py-[80px] bg-[#111111] border-t border-[#1D1D1D]">
        <div className="max-w-[800px]">
          <div className="w-[40px] h-[3px] bg-[#D6E264] mb-8" />
          <blockquote className="font-grotesk text-[28px] md:text-[40px] font-normal text-[#F5F5F0] tracking-[-1px] leading-[1.15] mb-8">
            &ldquo;They didn&apos;t just make the brand. They built trust. Vazgro delivered faster than any agency I&apos;d worked with and the quality was exceptional.&rdquo;
          </blockquote>
          <div className="flex items-center gap-4">
            <div className="relative w-[48px] h-[48px] overflow-hidden rounded-full bg-[#1A1A1A] border border-[#2D2D2D]">
              <Image src="/AVATAR.svg" alt="George A." fill className="object-cover" sizes="48px" />
            </div>
            <div>
              <div className="font-grotesk text-[14px] font-normal text-[#F5F5F0] tracking-[0.5px]">GEORGE A.</div>
              <div className="font-ibm-mono text-[10px] text-[#AAAAAA] tracking-[2px]">FOUNDER, PROGRIZE</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Outcomes ── */}
      <section className="flex flex-col w-full px-6 md:px-[120px] py-16 md:py-[80px] border-t border-[#1D1D1D]">
        <span className="font-ibm-mono text-[10px] font-normal text-[#D6E264] tracking-[3px] mb-8">// OUTCOMES</span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px]">
          {[
            { title: "DELIVERED ON TIME", body: "All three surfaces shipped within the 5-week window. No scope creep. No missed milestones." },
            { title: "FULL IP TRANSFER", body: "Complete source files, Figma libraries, and documented codebase handed over on day of launch." },
            { title: "4.9/5 CLIENT RATING", body: "George rated the engagement a 4.9 out of 5 and has since referred two additional clients to Vazgro." },
          ].map((o) => (
            <div key={o.title} className="flex flex-col gap-4 p-8 bg-[#111111] border border-[#2D2D2D]">
              <span className="font-grotesk text-[18px] font-normal text-[#D6E264] tracking-[0.5px]">{o.title}</span>
              <p className="font-ibm-mono text-[12px] text-[#CCCCCC] tracking-[0.5px] leading-[1.7]">{o.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="flex flex-col items-center text-center w-full px-6 md:px-[120px] py-16 md:py-[80px] bg-[#D6E264]">
        <span className="font-ibm-mono text-[10px] font-normal text-[#1A1A1A] tracking-[3px] mb-4">// HAVE A SIMILAR PROJECT?</span>
        <h2 className="font-grotesk text-[32px] md:text-[52px] font-normal text-[#0A0A0A] tracking-[-2px] leading-none mb-8">
          LET&apos;S BUILD YOURS.
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <a
            href="mailto:hello@vazgro.com"
            className="flex items-center justify-center h-[56px] px-10 bg-[#0A0A0A] hover:bg-[#1A1A1A] transition-colors no-underline"
          >
            <span className="font-grotesk text-[12px] font-normal text-[#D6E264] tracking-[2px]">
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
