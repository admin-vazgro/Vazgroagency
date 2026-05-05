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
  bgColor = "#F2F2F2",
  accentColor,
}: TestimonialCardProps) {
  return (
    <div
      className="flex flex-col gap-6 p-8 lg:p-[40px] border-l-4 w-full lg:flex-1"
      style={{ backgroundColor: bgColor, borderLeftColor: accentColor }}
    >
      <p className="font-ibm-mono text-[14px] text-[#444444] tracking-[1px] leading-[1.6]">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="flex items-center gap-[12px]">
        <div className="w-[36px] h-[36px] rounded-full bg-[#D0D0D0] shrink-0" />
        <div className="flex flex-col gap-[2px]">
          <span className="font-grotesk text-[14px] font-normal text-[#0A0A0A] tracking-[1px]">
            {name}
          </span>
          <span className="font-ibm-mono text-[14px] text-[#666666] tracking-[1px]">
            {role}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="flex flex-col w-full bg-white py-16 px-6 md:py-[100px] md:px-8 lg:px-[120px] gap-12 md:gap-[64px]">
      <SectionHeader
        label="[04] // WHAT CLIENTS SAY"
        title={"REAL CLIENTS.\nREAL RESULTS."}
      />

      <div className="flex flex-col lg:flex-row w-full gap-[2px]">
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
          bgColor="#F5F5F5"
          accentColor="#FF6B35"
        />
        <TestimonialCard
          quote="VAZGRO BUILT OUR MVP IN 5 WEEKS — CLEAN CODE, FULL HANDOVER, AND THEY WERE AVAILABLE ON SLACK THE WHOLE TIME. WORTH EVERY PENNY."
          name="JAMES K."
          role="CO-FOUNDER, LONDON STARTUP"
          accentColor="#D0D0D0"
        />
      </div>
    </section>
  );
}
