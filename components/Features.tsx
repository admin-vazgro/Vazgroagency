import Link from "next/link";
import SectionHeader from "./SectionHeader";
import { IconLightning, IconTrendingUp, IconWrench } from "./Icons";

const services = [
  {
    href: "/services/launch",
    Icon: IconLightning,
    iconColor: "#6B7800",
    title: "LAUNCH\nFIXED-FEE PACKAGES",
    description: "BUY EXACTLY WHAT YOU NEED — WEBSITES, BRANDING, AI TOOLS — AT A PRICE YOU KNOW UPFRONT. DELIVERED IN DAYS, NOT MONTHS. FROM £149.",
    tag: "FROM £149",
    tagColor: "#6B7800",
    tagBorderColor: "#D6E264",
    bgColor: "#FAFDF0",
    borderColor: "#D6E264",
  },
  {
    href: "/services/grow",
    Icon: IconTrendingUp,
    iconColor: "#FF6B35",
    title: "GROW\nMONTHLY SUBSCRIPTIONS",
    description: "YOUR ALWAYS-ON DIGITAL TEAM. UNLIMITED DESIGN, DEVELOPMENT, AND MARKETING WITH FAST TURNAROUND AND NO AGENCY DRAG. FROM £349/MO.",
    tag: "FROM £349/MO",
    tagColor: "#FF6B35",
    tagBorderColor: "#FF6B35",
    bgColor: "#F5F5F5",
    borderColor: "#FF6B35",
  },
  {
    href: "/services/build",
    Icon: IconWrench,
    iconColor: "#444444",
    title: "BUILD\nCUSTOM APPS & AI",
    description: "SENIOR EXECUTION FOR PRODUCT BUILDS, INTERNAL SYSTEMS, AND AI-LED TOOLS. MVP TO PRODUCTION. CUSTOM SCOPING ON EVERY BUILD. FROM £3,999.",
    tag: "CUSTOM SCOPE",
    tagColor: "#777777",
    tagBorderColor: "#A0A0A0",
    bgColor: "#F2F2F2",
    borderColor: "#A0A0A0",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="flex flex-col w-full bg-white py-20 px-6 md:py-[120px] md:px-8 lg:px-[120px] gap-14 md:gap-[80px]"
    >
      <SectionHeader
        label="[01] // THREE WAYS TO WORK WITH US"
        title={"LAUNCH. GROW.\nBUILD."}
        subtitle="FIXED-PRICE PACKAGES, MONTHLY SUBSCRIPTIONS, AND CUSTOM DIGITAL BUILDS."
      />

      <div className="flex flex-col lg:flex-row w-full gap-[2px]">
        {services.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group flex flex-col gap-5 p-8 lg:p-[40px] border w-full lg:flex-1 lg:min-h-[340px] no-underline hover:opacity-90 transition-opacity"
            style={{ backgroundColor: s.bgColor, borderColor: s.borderColor }}
          >
            <s.Icon size={28} color={s.iconColor} />
            <h3 className="font-grotesk text-[18px] font-normal text-[#0A0A0A] tracking-[1px] leading-[1.2] whitespace-pre-line">
              {s.title}
            </h3>
            <p className="font-ibm-mono text-[14px] lg:text-[14px] text-[#555555] tracking-[0.8px] leading-[1.7] flex-1">
              {s.description}
            </p>
            <div className="flex items-center justify-between">
              <div
                className="flex items-center justify-center h-[28px] px-[12px] bg-white border w-fit"
                style={{ borderColor: s.tagBorderColor }}
              >
                <span className="font-ibm-mono text-[14px] tracking-[2px]" style={{ color: s.tagColor }}>
                  {s.tag}
                </span>
              </div>
              <span className="font-ibm-mono text-[14px] tracking-[2px] group-hover:underline" style={{ color: s.tagColor }}>
                VIEW SERVICE →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
