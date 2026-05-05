import SectionHeader from "./SectionHeader";
import { IconBot, IconGlobe, IconMegaphone, IconPalette, IconRocket, IconSlack } from "./Icons";

export default function Bento() {
  return (
    <section className="flex flex-col w-full bg-[#F8F8F8] py-16 px-6 md:py-[100px] md:px-8 lg:px-[120px] gap-10 md:gap-[48px]">
      <SectionHeader
        label="[05] // CAPABILITIES"
        title={"THE FULL STACK.\nIN ONE AGENCY."}
        titleWidth="w-full max-w-[800px]"
      />

      <div className="flex flex-col w-full gap-[2px]">
        {/* Row 1 */}
        <div className="flex flex-col lg:flex-row w-full gap-[2px]">
          {/* Bento A — Yellow */}
          <div className="flex flex-col gap-5 p-8 lg:p-[40px] lg:h-[320px] bg-[#D6E264] w-full lg:flex-1">
            <div className="flex items-center justify-between">
              <span className="font-ibm-mono text-[14px] font-normal text-[#3A3A00] tracking-[2px]">[01]</span>
              <IconGlobe size={26} color="#3A3A00" />
            </div>
            <h3 className="font-grotesk text-[24px] md:text-[28px] font-normal text-[#0A0A0A] tracking-[-1px] leading-[1.1] whitespace-pre-line">
              {"WEB DESIGN\n& DEVELOPMENT"}
            </h3>
            <p className="font-ibm-mono text-[14px] text-[#2A2A00] tracking-[1px] leading-[1.6]">
              PIXEL-PERFECT WEBSITES BUILT TO CONVERT. FROM LANDING PAGES TO FULL CMS-POWERED PLATFORMS.
            </p>
            <div className="flex items-center justify-center h-[28px] px-[12px] bg-[#0A0A0A] w-fit">
              <span className="font-ibm-mono text-[14px] font-normal text-[#D6E264] tracking-[2px]">[FROM £149]</span>
            </div>
          </div>

          {/* Bento B */}
          <div className="flex flex-col gap-5 p-8 lg:p-[40px] lg:h-[320px] bg-[#EFEFEF] border border-[#D8D8D8] w-full lg:flex-1">
            <div className="flex items-center justify-between">
              <span className="font-ibm-mono text-[14px] font-normal text-[#6B7800] tracking-[2px]">[02]</span>
              <IconPalette size={26} color="#6B7800" />
            </div>
            <h3 className="font-grotesk text-[24px] md:text-[28px] font-normal text-[#0A0A0A] tracking-[-1px] leading-[1.1] whitespace-pre-line">
              {"BRAND\nIDENTITY"}
            </h3>
            <p className="font-ibm-mono text-[14px] text-[#555555] tracking-[1px] leading-[1.6]">
              LOGOS, COLOUR SYSTEMS, TYPOGRAPHY, AND FULL BRAND GUIDELINES. DELIVERED IN DAYS.
            </p>
          </div>

          {/* Bento C */}
          <div className="flex flex-col gap-5 p-8 lg:p-[40px] lg:h-[320px] bg-white border border-[#D8D8D8] w-full lg:flex-1">
            <div className="flex items-center justify-between">
              <span className="font-ibm-mono text-[14px] font-normal text-[#6B7800] tracking-[2px]">[03]</span>
              <IconMegaphone size={26} color="#FF6B35" />
            </div>
            <h3 className="font-grotesk text-[24px] md:text-[28px] font-normal text-[#0A0A0A] tracking-[-1px] leading-[1.1] whitespace-pre-line">
              {"SOCIAL MEDIA\nMANAGEMENT"}
            </h3>
            <p className="font-ibm-mono text-[14px] text-[#555555] tracking-[1px] leading-[1.6]">
              CONTENT, SCHEDULING, ANALYTICS, AND GROWTH — YOUR BRAND ACTIVE ONLINE EVERY DAY.
            </p>
            <div className="flex items-center justify-center h-[28px] px-[12px] bg-white border border-[#FF6B35] w-fit">
              <span className="font-ibm-mono text-[14px] font-normal text-[#FF6B35] tracking-[2px]">[FROM £399/MO]</span>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex flex-col lg:flex-row w-full gap-[2px]">
          {/* Bento D */}
          <div className="flex flex-col gap-5 p-8 lg:p-[40px] lg:h-[260px] bg-[#EFEFEF] border border-[#D8D8D8] w-full lg:flex-1">
            <div className="flex items-center justify-between">
              <span className="font-ibm-mono text-[14px] font-normal text-[#6B7800] tracking-[2px]">[04]</span>
              <IconBot size={26} color="#6B7800" />
            </div>
            <h3 className="font-grotesk text-[24px] md:text-[28px] font-normal text-[#0A0A0A] tracking-[-1px] leading-[1.1] whitespace-pre-line">
              {"AI CHATBOT\n& AUTOMATION"}
            </h3>
            <p className="font-ibm-mono text-[14px] text-[#555555] tracking-[1px] leading-[1.6]">
              CUSTOM AI TRAINED ON YOUR CONTENT. AUTOMATE FOLLOW-UPS, SCHEDULING, AND REPORTING.
            </p>
          </div>

          {/* Bento E */}
          <div className="flex flex-col gap-5 p-8 lg:p-[40px] lg:h-[260px] bg-[#FFF8F5] border-2 border-[#FF6B35] w-full lg:flex-1">
            <div className="flex items-center justify-between">
              <span className="font-ibm-mono text-[14px] font-normal text-[#FF6B35] tracking-[2px]">[05]</span>
              <IconRocket size={26} color="#FF6B35" />
            </div>
            <h3 className="font-grotesk text-[24px] md:text-[28px] font-normal text-[#0A0A0A] tracking-[-1px] leading-[1.1] whitespace-pre-line">
              {"MVP &\nPRODUCT BUILD"}
            </h3>
            <p className="font-ibm-mono text-[14px] text-[#555555] tracking-[1px] leading-[1.6]">
              FROM IDEA TO LIVE PRODUCT IN 4 WEEKS. SENIOR ENGINEERING, CLEAN CODE, FULL HANDOVER.
            </p>
            <div className="flex items-center justify-center h-[28px] px-[12px] bg-white border border-[#FF6B35] w-fit">
              <span className="font-ibm-mono text-[14px] font-normal text-[#FF6B35] tracking-[2px]">[FROM £3,999]</span>
            </div>
          </div>

          {/* Bento F */}
          <div className="flex flex-col gap-5 p-8 lg:p-[40px] lg:h-[260px] bg-white border border-[#D8D8D8] w-full lg:flex-1">
            <div className="flex items-center justify-between">
              <span className="font-ibm-mono text-[14px] font-normal text-[#6B7800] tracking-[2px]">[06]</span>
              <IconSlack size={26} color="#6B7800" />
            </div>
            <h3 className="font-grotesk text-[24px] md:text-[28px] font-normal text-[#0A0A0A] tracking-[-1px] leading-[1.1] whitespace-pre-line">
              {"DEDICATED PM\n& SLACK ACCESS"}
            </h3>
            <p className="font-ibm-mono text-[14px] text-[#555555] tracking-[1px] leading-[1.6]">
              REAL HUMANS. REAL COMMUNICATION. YOUR PM IS ON SLACK, NOT HIDING BEHIND A TICKET SYSTEM.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
