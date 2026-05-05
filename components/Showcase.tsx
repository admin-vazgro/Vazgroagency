"use client";

import { useState } from "react";
import Image from "next/image";
import SectionHeader from "./SectionHeader";
import { IconCode, IconGlobe, IconMobile, IconZap } from "./Icons";

const slides = [
  {
    tag: "[MOBILE APP]",
    tagBg: "#D6E264",
    tagColor: "#0A0A0A",
    idx: "01 / 04",
    idxColor: "#777777",
    title: "PROGRIZE APP\nMOBILE PRODUCT",
    by: "CAREER DISCOVERY // BUILT FOR CLARITY, CALM, AND GROWTH",
    border: "#D8D8D8",
    bg: "#EFEFEF",
    tagBorder: "",
    img: "/showcase-progrize-app.png",
    Icon: IconMobile,
    href: "/work/progrize",
  },
  {
    tag: "[WEB PLATFORM]",
    tagBg: "#EFEFEF",
    tagColor: "#6B7800",
    idx: "02 / 04",
    idxColor: "#6B7800",
    title: "PROGRIZE WEB\nDESKTOP EXPERIENCE",
    by: "CAREER MATCHING // AI-ASSISTED PROGRESS TRACKING",
    border: "#D6E264",
    bg: "#F5F5F5",
    tagBorder: "#D6E264",
    img: "/showcase-progrize-web.png",
    Icon: IconGlobe,
    href: "/work/progrize",
  },
  {
    tag: "[EDTECH]",
    tagBg: "#E8E8E8",
    tagColor: "#FF6B35",
    idx: "03 / 04",
    idxColor: "#777777",
    title: "PROGRIZE LEARN\nINTERVIEW PREP",
    by: "EDUCATION LAYER // USERS KEEP MOVING, NOT JUST BROWSING",
    border: "#D8D8D8",
    bg: "#FFFFFF",
    tagBorder: "#FF6B35",
    img: "/showcase-progrize-learn.png",
    Icon: IconCode,
    href: "/work/progrize",
  },
  {
    tag: "[SERVICE PRODUCT]",
    tagBg: "#D6E264",
    tagColor: "#0A0A0A",
    idx: "04 / 04",
    idxColor: "#777777",
    title: "TRACK YOUR TAXI\nMOBILE-FIRST",
    by: "REAL-TIME MOTION // PAYMENT CONTEXT & SYSTEM THINKING",
    border: "#D8D8D8",
    bg: "#EFEFEF",
    tagBorder: "",
    img: "/showcase-taxi.png",
    Icon: IconZap,
    href: "/work/track-taxi",
  },
];

export default function Showcase() {
  const [active, setActive] = useState(1);

  const prev = () => setActive((p) => Math.max(0, p - 1));
  const next = () => setActive((p) => Math.min(slides.length - 1, p + 1));

  const slide = slides[active];

  return (
      <section id="showcase" className="flex flex-col w-full bg-[#FAFAFA] pt-16 md:pt-[100px] pb-0 gap-8 md:gap-[48px]">
      {/* Header */}
      <div className="flex flex-col gap-6 px-6 md:px-8 lg:px-[120px] md:flex-row md:items-end md:justify-between">
        <SectionHeader
          label="[07] // SHOWCASE"
          title={"REAL PROJECTS,\nREAL RESULTS."}
          titleWidth="w-full max-w-[600px]"
        />
        <div className="flex items-center gap-[8px] shrink-0 self-start md:self-auto">
          <button
            type="button"
            onClick={prev}
            className="flex items-center justify-center w-[48px] h-[48px] bg-[#F0F0F0] border-2 border-[#D0D0D0] hover:border-[#888888] transition-colors"
          >
            <span className="font-grotesk text-[18px] font-normal text-[#0A0A0A]">&lt;</span>
          </button>
          <button
            type="button"
            onClick={next}
            className="flex items-center justify-center w-[48px] h-[48px] bg-[#D6E264] hover:bg-[#c9d64f] transition-colors"
          >
            <span className="font-grotesk text-[18px] font-normal text-[#0A0A0A]">&gt;</span>
          </button>
        </div>
      </div>

      {/* Mobile: single card */}
      <div className="lg:hidden px-6">
        <div
          className="flex flex-col gap-5 p-6 border-2 w-full"
          style={{ backgroundColor: slide.bg, borderColor: slide.border }}
        >
          <div className="relative h-[180px] bg-white border border-[#D0D0D0] overflow-hidden">
            <Image src={slide.img} alt={slide.title} fill className="object-cover object-center" sizes="100vw" />
            <div className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center border border-[#D8D8D8] bg-white/90 backdrop-blur-sm">
              <slide.Icon size={18} color={slide.tagColor} />
            </div>
          </div>
          <div className="flex items-center justify-between w-full">
            <div
              className="flex items-center justify-center h-[24px] px-[10px] border"
              style={{ backgroundColor: slide.tagBg, borderColor: slide.tagBorder || "transparent" }}
            >
              <span className="font-ibm-mono text-[14px] font-normal tracking-[1px]" style={{ color: slide.tagColor }}>
                {slide.tag}
              </span>
            </div>
            <span className="font-ibm-mono text-[14px] tracking-[2px]" style={{ color: slide.idxColor }}>
              {slide.idx}
            </span>
          </div>
          <h3 className="font-grotesk text-[20px] font-normal text-[#0A0A0A] tracking-[1px] leading-[1.2] whitespace-pre-line">
            {slide.title}
          </h3>
          <p className="font-ibm-mono text-[14px] text-[#666666] tracking-[1px]">{slide.by}</p>
          <a href={slide.href} className="font-ibm-mono text-[14px] font-normal text-[#6B7800] tracking-[2px] no-underline hover:underline mt-1">
            VIEW CASE STUDY &gt;
          </a>
        </div>
      </div>

      {/* Desktop: carousel track */}
      <div className="hidden lg:overflow-hidden h-[416px] lg:block lg:px-[120px]">
        <div
          className="flex gap-[2px] transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(calc(-${active} * (560px + 2px)))` }}
        >
        {slides.map((s, i) => (
          <div
            key={i}
            className="flex flex-col gap-[24px] p-[40px] h-[412px] w-[560px] shrink-0 border-2"
            style={{ backgroundColor: s.bg, borderColor: s.border }}
          >
            <div className="relative h-[200px] bg-white border border-[#D0D0D0] overflow-hidden">
              <Image src={s.img} alt={s.title} fill className="object-cover object-center" sizes="560px" />
              <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center border border-[#D8D8D8] bg-white/90 backdrop-blur-sm">
                <s.Icon size={20} color={s.tagColor} />
              </div>
            </div>
            <div className="flex items-center justify-between w-full">
              <div
                className="flex items-center justify-center h-[24px] px-[10px] border"
                style={{ backgroundColor: s.tagBg, borderColor: s.tagBorder || "transparent" }}
              >
                <span className="font-ibm-mono text-[14px] font-normal tracking-[1px]" style={{ color: s.tagColor }}>
                  {s.tag}
                </span>
              </div>
              <span className="font-ibm-mono text-[14px] tracking-[2px]" style={{ color: s.idxColor }}>
                {s.idx}
              </span>
            </div>
            <h3 className="font-grotesk text-[20px] font-normal text-[#0A0A0A] tracking-[1px] leading-[1.2] whitespace-pre-line">
              {s.title}
            </h3>
            <p className="font-ibm-mono text-[14px] text-[#666666] tracking-[1px]">{s.by}</p>
            <a href={s.href} className="font-ibm-mono text-[14px] font-normal text-[#6B7800] tracking-[2px] no-underline hover:underline mt-1">
              VIEW CASE STUDY &gt;
            </a>
          </div>
        ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex items-center gap-[8px] px-6 md:px-8 lg:px-[120px]">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className="h-[4px] transition-all"
            style={{ width: i === active ? 32 : 8, backgroundColor: i === active ? "#D6E264" : "#C8C8C8" }}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="flex flex-col items-start gap-3 px-6 pb-16 md:px-8 md:pb-[100px] lg:px-[120px] sm:flex-row sm:items-center sm:justify-between">
        <span className="font-ibm-mono text-[14px] text-[#777777] tracking-[2px]">
          SHOWING 0{active + 1} OF 04 PROJECTS
        </span>
        <a href="mailto:hello@vazgro.com" className="font-ibm-mono text-[14px] text-[#6B7800] tracking-[2px] cursor-pointer hover:underline no-underline">
          ENQUIRE ABOUT YOUR PROJECT &gt;
        </a>
      </div>
    </section>
  );
}
