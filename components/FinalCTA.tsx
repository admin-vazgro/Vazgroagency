"use client";

import GlitchText from "@/components/GlitchText";

export default function FinalCTA() {
  return (
    <section className="flex flex-col items-center w-full bg-[#0A0A0A] py-16 px-6 md:p-[120px] gap-10 md:gap-[48px] border-t-2 border-t-[#D6E264]">
      {/* Badge */}
      <div className="flex items-center justify-center gap-[8px] h-[32px] px-[16px] bg-[#1A1A1A] border-2 border-[#D6E264]">
        <span className="font-ibm-mono text-[11px] font-normal text-[#D6E264] tracking-[2px]">
          <GlitchText text="[READY TO GROW?]" speed={30} />
        </span>
      </div>

      {/* Title */}
      <h2 className="font-grotesk text-[44px] md:text-[80px] font-normal text-[#F5F5F0] tracking-[-2px] leading-none text-center w-full max-w-[1000px] whitespace-pre-line">
        <GlitchText text={"LET'S GROW YOUR\nBUSINESS DIGITALLY."} speed={40} delay={200} />
      </h2>

      {/* Subtitle */}
      <p className="font-ibm-mono text-[10px] md:text-[14px] text-[#BBBBBB] tracking-[0.5px] md:tracking-[2px] text-center text-pretty w-full max-w-[700px] px-2">
        <GlitchText text="FREE 30-MINUTE STRATEGY CALL. NO COMMITMENT. NO PRESSURE. JUST RESULTS." speed={20} delay={450} />
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-[16px] w-full sm:w-auto">
        <a
          href="mailto:hello@vazgro.com"
          className="flex items-center justify-center w-full sm:w-[280px] h-[64px] bg-[#D6E264] hover:bg-[#e6c200] transition-colors no-underline"
        >
          <span className="font-grotesk text-[13px] font-normal text-[#0A0A0A] tracking-[2px]">
            BOOK A FREE STRATEGY CALL
          </span>
        </a>
        <a
          href="mailto:hello@vazgro.com"
          className="flex items-center justify-center w-full sm:w-[220px] h-[64px] bg-[#0A0A0A] border-2 border-[#3D3D3D] hover:border-[#888888] transition-colors no-underline"
        >
          <span className="font-ibm-mono text-[12px] text-[#BBBBBB] tracking-[2px]">
            EMAIL US
          </span>
        </a>
      </div>

      <p className="font-ibm-mono text-[11px] text-[#999999] tracking-[2px] text-center">
        HELLO@VAZGRO.COM // LONDON, UK // SERVING CLIENTS WORLDWIDE
      </p>
    </section>
  );
}
