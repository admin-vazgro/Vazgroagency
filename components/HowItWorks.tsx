import SectionHeader from "./SectionHeader";

interface StepCardProps {
  number: string;
  title: string;
  description: string;
  bgColor?: string;
  borderColor?: string;
  borderWidth?: number;
}

function StepCard({
  number,
  title,
  description,
  bgColor = "#0A0A0A",
  borderColor = "#2D2D2D",
  borderWidth = 1,
}: StepCardProps) {
  return (
    <div
      className="flex flex-col gap-4 p-8 md:p-[40px] border w-full md:flex-1 md:h-[280px]"
      style={{ backgroundColor: bgColor, borderColor, borderWidth }}
    >
      <span className="font-grotesk text-[48px] font-normal text-[#D6E264] tracking-[-2px]">
        {number}
      </span>
      <h3 className="font-grotesk text-[20px] font-normal text-[#F5F5F0] tracking-[1px] leading-[1.2] whitespace-pre-line">
        {title}
      </h3>
      <p className="font-ibm-mono text-[11px] text-[#AAAAAA] tracking-[1px] leading-[1.5]">
        {description}
      </p>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section id="process" className="flex flex-col w-full bg-[#0D0D0D] py-16 px-6 md:py-[100px] md:px-[120px] gap-12 md:gap-[64px]">
      <SectionHeader
        label="[02] // OUR PROCESS"
        title={"SIMPLE. HONEST.\nREPEATABLE."}
        subtitle="WE'VE STRIPPED OUT EVERYTHING THAT WASTES TIME OR MONEY. WHAT'S LEFT GETS YOU RESULTS FAST."
      />

      <div className="flex flex-col md:flex-row w-full gap-[2px]">
        <StepCard
          number="01"
          title={"CHOOSE YOUR\nSERVICE"}
          description="BROWSE FIXED-FEE PACKAGES OR BOOK A FREE DISCOVERY CALL. NO GATEKEEPING. NO SALES PRESSURE."
        />
        <StepCard
          number="02"
          title={"WE SCOPE\nAND ALIGN"}
          description="YOUR DEDICATED PM CONFIRMS SCOPE, BRIEF, AND TIMELINE. SPRINT 0 FOR BIGGER PROJECTS."
          bgColor="#111111"
          borderColor="#D6E264"
          borderWidth={1}
        />
        <StepCard
          number="03"
          title={"WE BUILD\nAND DELIVER"}
          description="DESIGN-LED, AI-ASSISTED EXECUTION WITH REGULAR CHECK-INS. DELIVERED TO BRIEF, ON TIME."
        />
        <StepCard
          number="04"
          title={"YOU OWN\nEVERYTHING"}
          description="FULL IP TRANSFER, SOURCE FILES, DOCUMENTED CODEBASE, AND ONGOING SUPPORT. NO LOCK-IN."
          bgColor="#111111"
          borderColor="#FF6B35"
          borderWidth={1}
        />
      </div>
    </section>
  );
}
