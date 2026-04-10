import Link from "next/link";
import SectionHeader from "./SectionHeader";

const services = [
  {
    href: "/services/launch",
    iconColor: "#D6E264",
    title: "⚡ LAUNCH\nFIXED-FEE PACKAGES",
    description: "BUY EXACTLY WHAT YOU NEED — WEBSITES, BRANDING, AI TOOLS — AT A PRICE YOU KNOW UPFRONT. DELIVERED IN DAYS, NOT MONTHS. FROM £149.",
    tag: "FROM £149",
    tagColor: "#D6E264",
    bgColor: "#111111",
    borderColor: "#D6E264",
  },
  {
    href: "/services/grow",
    iconColor: "#FF6B35",
    title: "📈 GROW\nMONTHLY SUBSCRIPTIONS",
    description: "YOUR ALWAYS-ON DIGITAL TEAM. UNLIMITED DESIGN, DEVELOPMENT, AND MARKETING WITH FAST TURNAROUND AND NO AGENCY DRAG. FROM £349/MO.",
    tag: "FROM £349/MO",
    tagColor: "#FF6B35",
    bgColor: "#0F0F0F",
    borderColor: "#FF6B35",
  },
  {
    href: "/services/build",
    iconColor: "#F5F5F0",
    title: "🔧 BUILD\nCUSTOM APPS & AI",
    description: "SENIOR EXECUTION FOR PRODUCT BUILDS, INTERNAL SYSTEMS, AND AI-LED TOOLS. MVP TO PRODUCTION. CUSTOM SCOPING ON EVERY BUILD. FROM £3,999.",
    tag: "CUSTOM SCOPE",
    tagColor: "#B8B8B8",
    bgColor: "#111111",
    borderColor: "#6E6E6E",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="flex flex-col w-full bg-[#0A0A0A] py-16 px-6 md:py-[100px] md:px-[120px] gap-12 md:gap-[64px]"
    >
      <SectionHeader
        label="[01] // THREE WAYS TO WORK WITH US"
        title={"LAUNCH. GROW.\nBUILD."}
        subtitle="FIXED-PRICE PACKAGES, MONTHLY SUBSCRIPTIONS, AND CUSTOM DIGITAL BUILDS."
      />

      <div className="flex flex-col md:flex-row w-full gap-[2px]">
        {services.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group flex flex-col gap-5 p-8 md:p-[32px] border w-full md:flex-1 md:h-[360px] no-underline hover:opacity-90 transition-opacity"
            style={{ backgroundColor: s.bgColor, borderColor: s.borderColor }}
          >
            <div className="w-[40px] h-[40px] shrink-0" style={{ backgroundColor: s.iconColor }} />
            <h3 className="font-grotesk text-[18px] font-normal text-[#F5F5F0] tracking-[1px] leading-[1.2] whitespace-pre-line">
              {s.title}
            </h3>
            <p className="font-ibm-mono text-[13px] md:text-[14px] text-[#D0D0D0] tracking-[0.8px] leading-[1.7] flex-1">
              {s.description}
            </p>
            <div className="flex items-center justify-between">
              <div
                className="flex items-center justify-center h-[28px] px-[12px] bg-[#1A1A1A] border w-fit"
                style={{ borderColor: s.tagColor }}
              >
                <span className="font-ibm-mono text-[11px] tracking-[2px]" style={{ color: s.tagColor }}>
                  {s.tag}
                </span>
              </div>
              <span className="font-ibm-mono text-[10px] tracking-[2px] group-hover:underline" style={{ color: s.tagColor }}>
                VIEW SERVICE →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
