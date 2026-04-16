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
    <div className="flex flex-col gap-[16px] w-full">
      <span className="font-ibm-mono text-[14px] md:text-[14px] font-normal text-[#D6E264] tracking-[1.5px] md:tracking-[3px]">
        <GlitchText text={label} speed={30} />
      </span>
      <h2
        className={`font-grotesk text-[36px] md:text-[56px] font-normal text-[#F5F5F0] tracking-[-1px] leading-[1.05] whitespace-pre-line ${titleWidth}`}
      >
        <GlitchText text={title} speed={40} delay={150} />
      </h2>
      {subtitle && (
        <p
          className={`font-ibm-mono text-[14px] md:text-[14px] text-[#C2C2C2] tracking-[0.5px] md:tracking-[1px] leading-[1.7] text-pretty ${subtitleWidth}`}
        >
          <GlitchText text={subtitle} speed={20} delay={350} />
        </p>
      )}
    </div>
  );
}
