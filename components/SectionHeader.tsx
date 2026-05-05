"use client";

import GlitchText from "@/components/GlitchText";

interface SectionHeaderProps {
  label: string;
  title: string;
  subtitle?: string;
  titleWidth?: string;
  subtitleWidth?: string;
}

export default function SectionHeader({
  label,
  title,
  subtitle,
  titleWidth = "w-full max-w-[700px]",
  subtitleWidth = "w-full max-w-[600px]",
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col w-full">
      <span className="font-ibm-mono text-[14px] font-normal text-[#6B7800] tracking-[1.5px] md:tracking-[3px]">
        <GlitchText text={label} speed={30} />
      </span>
      <h2
        className={`font-grotesk text-[36px] md:text-[56px] font-normal text-[#0A0A0A] tracking-[-1px] leading-[1.05] whitespace-pre-line mt-4 md:mt-5 ${titleWidth}`}
      >
        <GlitchText text={title} speed={40} delay={150} />
      </h2>
      {subtitle && (
        <p
          className={`font-ibm-mono text-[14px] text-[#555555] tracking-[0.5px] md:tracking-[1px] leading-[1.7] text-pretty mt-5 md:mt-7 ${subtitleWidth}`}
        >
          <GlitchText text={subtitle} speed={20} delay={350} />
        </p>
      )}
    </div>
  );
}
