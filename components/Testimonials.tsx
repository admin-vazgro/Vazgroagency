import SectionHeader from "./SectionHeader";

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  bgColor?: string;
  accentColor: string;
}

function TestimonialCard({
  quote,
  name,
  role,
  bgColor = "#111111",
  accentColor,
}: TestimonialCardProps) {
  return (
    <div
      className="flex flex-col gap-6 p-8 md:p-[40px] border-l-4 w-full md:flex-1"
      style={{ backgroundColor: bgColor, borderLeftColor: accentColor }}
    >
      <p className="font-ibm-mono text-[13px] text-[#CCCCCC] tracking-[1px] leading-[1.6]">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="flex items-center gap-[12px]">
        <div className="w-[36px] h-[36px] rounded-full bg-[#333333] shrink-0" />
        <div className="flex flex-col gap-[2px]">
          <span className="font-grotesk text-[13px] font-normal text-[#F5F5F0] tracking-[1px]">
            {name}
          </span>
          <span className="font-ibm-mono text-[11px] text-[#AAAAAA] tracking-[1px]">
            {role}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="flex flex-col w-full bg-[#0A0A0A] py-16 px-6 md:py-[100px] md:px-[120px] gap-12 md:gap-[64px]">
      <SectionHeader
        label="[04] // WHAT CLIENTS SAY"
        title={"REAL CLIENTS.\nREAL RESULTS."}
      />

      <div className="flex flex-col md:flex-row w-full gap-[2px]">
        <TestimonialCard
          quote="THEY DIDN'T JUST MAKE THE BRAND. THEY BUILT TRUST. VAZGRO DELIVERED FASTER THAN ANY AGENCY I'D WORKED WITH AND THE QUALITY WAS EXCEPTIONAL."
          name="GEORGE A."
          role="FOUNDER, PROGRIZE"
          accentColor="#D6E264"
        />
        <TestimonialCard
          quote="OUR WEBSITE WENT LIVE IN 7 DAYS AND WE SAW A 3X INCREASE IN ENQUIRIES WITHIN THE FIRST MONTH. THE GROW SUBSCRIPTION HAS BEEN A GAME CHANGER."
          name="SARAH M."
          role="DIRECTOR, UK RETAIL SME"
          bgColor="#0D0D0D"
          accentColor="#FF6B35"
        />
        <TestimonialCard
          quote="VAZGRO BUILT OUR MVP IN 5 WEEKS — CLEAN CODE, FULL HANDOVER, AND THEY WERE AVAILABLE ON SLACK THE WHOLE TIME. WORTH EVERY PENNY."
          name="JAMES K."
          role="CO-FOUNDER, LONDON STARTUP"
          accentColor="#F5F5F0"
        />
      </div>
    </section>
  );
}
