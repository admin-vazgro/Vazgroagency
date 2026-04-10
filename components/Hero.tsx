"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import GlitchText from "@/components/GlitchText";
import CollabCursors from "@/components/CollabCursors";

const reviewAvatars = [
  { src: "/AVATAR.svg", alt: "Client avatar" },
  { src: "/AVATAR-1.svg", alt: "Client avatar" },
  { src: "/AVATAR-2.svg", alt: "Client avatar" },
];

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative flex flex-col w-full bg-[#0A0A0A] py-16 px-6 md:py-[100px] md:px-[120px] overflow-hidden">

      {/* ── Two-column layout ── */}
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 w-full max-w-[1200px] mx-auto">

        {/* ── LEFT: copy ── */}
        <div className="flex flex-col items-start w-full lg:w-[52%] shrink-0">
          {/* Badge */}
          <div className="flex items-center gap-[8px] h-[32px] px-[12px] md:px-[16px] bg-[#1A1A1A] border-2 border-[#D6E264]">
            <div className="w-[8px] h-[8px] bg-[#D6E264] shrink-0" />
            <span className="font-ibm-mono text-[9px] md:text-[11px] font-normal text-[#D6E264] tracking-[1px] md:tracking-[2px]">
              [⚡] // UK DIGITAL AGENCY — LONDON
            </span>
          </div>

          <div className="h-8" />

          {/* Headline */}
          <h1 className="font-grotesk text-[clamp(36px,7vw,76px)] font-normal text-[#F5F5F0] tracking-[-2px] leading-[0.95] w-full">
            <GlitchText text="MORE" speed={45} delay={100} />
            <br />
            <GlitchText text="CUSTOMERS." speed={45} delay={200} />
            <br />
            <span className="text-[#D6E264]">
              <GlitchText text="STRONGER" speed={45} delay={300} />
            </span>
            <br />
            <GlitchText text="BRAND." speed={45} delay={400} />
            <br />
            <span className="text-[#D6E264]">
              <GlitchText text="FASTER GROWTH." speed={45} delay={500} />
            </span>
          </h1>

          <div className="h-8" />

          {/* Subheading */}
          <p className="font-ibm-mono text-[12px] md:text-[13px] text-[#FFFFFF] tracking-[1px] leading-[1.7] max-w-[520px]">
            WE BUILD THE WEBSITES, RUN THE MARKETING, AND SHIP THE AI PRODUCTS THAT TURN YOUR BUSINESS INTO A DIGITAL POWERHOUSE.
          </p>

          <div className="h-10" />

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-start gap-4 w-full sm:w-auto">
            <a href="mailto:hello@vazgro.com" className="flex items-center justify-center w-full sm:w-[260px] h-[56px] bg-[#D6E264] hover:bg-[#c9d64f] transition-colors no-underline">
              <span className="font-grotesk text-[12px] font-normal text-[#0A0A0A] tracking-[2px]">
                BOOK A FREE STRATEGY CALL
              </span>
            </a>
            <button
              onClick={() => { const el = document.getElementById("features"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
              className="flex items-center justify-center w-full sm:w-[200px] h-[56px] bg-[#0A0A0A] border-2 border-[#3D3D3D] hover:border-[#888888] transition-colors"
            >
              <span className="font-ibm-mono text-[12px] text-[#FFFFFF] tracking-[2px]">
                SEE WHAT WE DO &gt;
              </span>
            </button>
          </div>

          <div className="h-8" />

          {/* Social proof */}
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {reviewAvatars.map((a) => (
                <div key={a.src} className="relative w-[40px] h-[40px] border-2 border-[#0A0A0A] overflow-hidden rounded-full">
                  <Image src={a.src} alt={a.alt} fill className="object-cover" sizes="40px" />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-[2px]">
              <span className="font-grotesk text-[13px] font-normal text-[#F5F5F0] tracking-[0.5px]">500+ Reviews</span>
              <span className="font-ibm-mono text-[10px] text-[#AAAAAA] tracking-[1px]">4.9/5 · 94% RETENTION</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT: hero photo ── */}
        <div className="relative w-full lg:flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-[560px] aspect-square">
            <Image
              src="/hero-photo.jpg"
              alt="Vazgro digital agency hero"
              fill
              priority
              className="object-contain"
              sizes="(max-width: 1023px) 90vw, 50vw"
            />
          </div>
          {/* Floating stat cards */}
          <div className="absolute top-[10%] -left-4 hidden xl:block">
            <div className="bg-[#111111] border border-[#2D2D2D] px-4 py-3 flex items-center gap-3">
              <div className="w-[8px] h-[8px] bg-[#D6E264] shrink-0 animate-pulse" />
              <div>
                <div className="font-grotesk text-[18px] font-normal text-[#D6E264] leading-none">7 DAYS</div>
                <div className="font-ibm-mono text-[9px] text-[#AAAAAA] tracking-[1px] mt-1">AVG. DELIVERY</div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-[12%] -right-4 hidden xl:block">
            <div className="bg-[#111111] border border-[#2D2D2D] px-4 py-3 flex items-center gap-3">
              <div className="w-[8px] h-[8px] bg-[#FF6B35] shrink-0 animate-pulse" />
              <div>
                <div className="font-grotesk text-[18px] font-normal text-[#F5F5F0] leading-none">£149</div>
                <div className="font-ibm-mono text-[9px] text-[#AAAAAA] tracking-[1px] mt-1">STARTS FROM</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collab cursors */}
      <CollabCursors />
    </section>
  );
}
