import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Work — Vazgro",
  description: "Real projects, real results. Browse Vazgro's case studies across web design, brand identity, AI products, and mobile apps.",
};

const projects = [
  {
    slug: "progrize",
    tag: "[PRODUCT BUILD]",
    tagColor: "#D6E264",
    title: "PROGRIZE",
    subtitle: "Career platform — mobile app, web platform & edtech layer",
    description: "A mobile-first job discovery and career growth product built across three surfaces: a native-feeling mobile app, a sharper desktop web experience, and an education layer with AI-assisted interview prep.",
    images: ["/progrize-app.svg", "/websiteprogrize.svg", "/progrizelearn.svg"],
    outcomes: ["Delivered in 5 weeks", "3 distinct surfaces shipped", "AI interview prep integrated"],
    service: "BUILD",
    year: "2024",
    border: "#D6E264",
  },
  {
    slug: "track-taxi",
    tag: "[SERVICE PRODUCT]",
    tagColor: "#FF6B35",
    title: "TRACK YOUR TAXI",
    subtitle: "Real-time taxi tracking — mobile-first service concept",
    description: "A service product concept with real-time motion tracking, in-app payment context, and mobile-first system thinking. Designed to feel clear and fast on any screen size.",
    images: ["/taxi.svg"],
    outcomes: ["Mobile-first delivery", "Real-time tracking UI", "Payment flow integrated"],
    service: "BUILD",
    year: "2024",
    border: "#FF6B35",
  },
];

export default function WorkPage() {
  return (
    <main className="flex flex-col w-full bg-[#0A0A0A] pt-[60px]">
      {/* Header */}
      <section className="flex flex-col w-full py-16 px-6 md:py-[100px] md:px-[120px] border-b border-[#1D1D1D]">
        <span className="font-ibm-mono text-[14px] font-normal text-[#D6E264] tracking-[3px]">
          // REAL PROJECTS · REAL RESULTS
        </span>
        <div className="h-5" />
        <h1 className="font-grotesk text-[48px] md:text-[80px] font-normal text-[#F5F5F0] tracking-[-3px] leading-none">
          OUR WORK
        </h1>
        <div className="h-6" />
        <p className="font-ibm-mono text-[14px] text-[#BBBBBB] tracking-[1px] leading-[1.6] max-w-[560px]">
          FROM MVP BUILDS TO BRAND IDENTITIES — EVERY PROJECT DELIVERED ON TIME, TO BRIEF, WITH FULL IP TRANSFER.
        </p>
      </section>

      {/* Projects */}
      <section className="flex flex-col w-full px-6 md:px-[120px] py-16 md:py-[80px] gap-[2px]">
        {projects.map((p) => (
          <Link
            key={p.slug}
            href={`/work/${p.slug}`}
            className="group flex flex-col lg:flex-row gap-8 p-8 md:p-[48px] bg-[#0F0F0F] border border-[#2D2D2D] hover:border-[#444444] transition-all no-underline"
          >
            {/* Images */}
            <div className="flex gap-[2px] w-full lg:w-[420px] shrink-0">
              {p.images.slice(0, 3).map((img, i) => (
                <div
                  key={img}
                  className="relative bg-[#1A1A1A] overflow-hidden flex-1"
                  style={{ aspectRatio: "3/4", opacity: 1 - i * 0.15 }}
                >
                  <Image
                    src={img}
                    alt={p.title}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1023px) 33vw, 140px"
                  />
                </div>
              ))}
            </div>

            {/* Meta */}
            <div className="flex flex-col justify-between flex-1">
              <div>
                <div className="mb-5 flex flex-wrap items-center gap-3">
                  <span
                    className="font-ibm-mono text-[14px] font-normal tracking-[2px] border px-3 py-1"
                    style={{ color: p.tagColor, borderColor: p.tagColor }}
                  >
                    {p.tag}
                  </span>
                  <span className="font-ibm-mono text-[14px] text-[#999999] tracking-[2px]">{p.year}</span>
                </div>
                <h2 className="font-grotesk text-[36px] md:text-[48px] font-normal text-[#F5F5F0] tracking-[-2px] leading-none mb-3">
                  {p.title}
                </h2>
                <p className="font-ibm-mono text-[14px] text-[#FFFFFF] tracking-[1px] leading-[1.6] mb-6 max-w-[480px]">
                  {p.description}
                </p>
                <div className="flex flex-wrap gap-[2px]">
                  {p.outcomes.map((o) => (
                    <span key={o} className="font-ibm-mono text-[14px] text-[#AAAAAA] tracking-[1px] bg-[#1A1A1A] border border-[#2D2D2D] px-3 py-1.5">
                      + {o}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 border-t border-[#1D1D1D] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <span className="font-ibm-mono text-[14px] text-[#999999] tracking-[2px]">SERVICE // {p.service}</span>
                <span className="font-ibm-mono text-[14px] font-normal tracking-[2px] group-hover:underline" style={{ color: p.tagColor }}>
                  VIEW CASE STUDY →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* CTA */}
      <section className="flex flex-col items-center text-center w-full px-6 md:px-[120px] py-16 md:py-[80px] border-t border-[#1D1D1D]">
        <span className="font-ibm-mono text-[14px] font-normal text-[#D6E264] tracking-[3px] mb-4">// HAVE A PROJECT IN MIND?</span>
        <h2 className="font-grotesk text-[32px] md:text-[52px] font-normal text-[#F5F5F0] tracking-[-2px] leading-none mb-6">
          LET&apos;S BUILD IT.
        </h2>
        <a
          href="mailto:hello@vazgro.com"
          className="flex items-center justify-center h-[56px] px-10 bg-[#D6E264] hover:bg-[#c9d64f] transition-colors no-underline"
        >
          <span className="font-grotesk text-[14px] font-normal text-[#0A0A0A] tracking-[2px]">
            BOOK A FREE STRATEGY CALL
          </span>
        </a>
      </section>
    </main>
  );
}
