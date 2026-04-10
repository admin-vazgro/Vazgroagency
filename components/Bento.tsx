import SectionHeader from "./SectionHeader";

export default function Bento() {
  return (
    <section className="flex flex-col w-full bg-[#0D0D0D] py-16 px-6 md:py-[100px] md:px-[120px] gap-10 md:gap-[48px]">
      <SectionHeader
        label="[05] // CAPABILITIES"
        title={"THE FULL STACK.\nIN ONE AGENCY."}
        titleWidth="w-full max-w-[800px]"
      />

      <div className="flex flex-col w-full gap-[2px]">
        {/* Row 1 */}
        <div className="flex flex-col md:flex-row w-full gap-[2px]">
          {/* Bento A — Yellow */}
          <div className="flex flex-col gap-5 p-8 md:p-[40px] md:h-[320px] bg-[#D6E264] w-full md:flex-1">
            <span className="font-ibm-mono text-[11px] font-normal text-[#1A1A1A] tracking-[2px]">[01]</span>
            <h3 className="font-grotesk text-[24px] md:text-[28px] font-normal text-[#0A0A0A] tracking-[-1px] leading-[1.1] whitespace-pre-line">
              {"WEB DESIGN\n& DEVELOPMENT"}
            </h3>
            <p className="font-ibm-mono text-[12px] text-[#1A1A1A] tracking-[1px] leading-[1.6]">
              PIXEL-PERFECT WEBSITES BUILT TO CONVERT. FROM LANDING PAGES TO FULL CMS-POWERED PLATFORMS.
            </p>
            <div className="flex items-center justify-center h-[28px] px-[12px] bg-[#0A0A0A] w-fit">
              <span className="font-ibm-mono text-[10px] font-normal text-[#D6E264] tracking-[2px]">[FROM £149]</span>
            </div>
          </div>

          {/* Bento B */}
          <div className="flex flex-col gap-5 p-8 md:p-[40px] md:h-[320px] bg-[#111111] border border-[#2D2D2D] w-full md:flex-1">
            <span className="font-ibm-mono text-[11px] font-normal text-[#D6E264] tracking-[2px]">[02]</span>
            <h3 className="font-grotesk text-[24px] md:text-[28px] font-normal text-[#F5F5F0] tracking-[-1px] leading-[1.1] whitespace-pre-line">
              {"BRAND\nIDENTITY"}
            </h3>
            <p className="font-ibm-mono text-[12px] text-[#BBBBBB] tracking-[1px] leading-[1.6]">
              LOGOS, COLOUR SYSTEMS, TYPOGRAPHY, AND FULL BRAND GUIDELINES. DELIVERED IN DAYS.
            </p>
          </div>

          {/* Bento C */}
          <div className="flex flex-col gap-5 p-8 md:p-[40px] md:h-[320px] bg-[#0A0A0A] border border-[#2D2D2D] w-full md:flex-1">
            <span className="font-ibm-mono text-[11px] font-normal text-[#D6E264] tracking-[2px]">[03]</span>
            <h3 className="font-grotesk text-[24px] md:text-[28px] font-normal text-[#F5F5F0] tracking-[-1px] leading-[1.1] whitespace-pre-line">
              {"SOCIAL MEDIA\nMANAGEMENT"}
            </h3>
            <p className="font-ibm-mono text-[12px] text-[#BBBBBB] tracking-[1px] leading-[1.6]">
              CONTENT, SCHEDULING, ANALYTICS, AND GROWTH — YOUR BRAND ACTIVE ONLINE EVERY DAY.
            </p>
            <div className="flex items-center justify-center h-[28px] px-[12px] bg-[#1A1A1A] border border-[#FF6B35] w-fit">
              <span className="font-ibm-mono text-[10px] font-normal text-[#FF6B35] tracking-[2px]">[FROM £399/MO]</span>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex flex-col md:flex-row w-full gap-[2px]">
          {/* Bento D */}
          <div className="flex flex-col gap-5 p-8 md:p-[40px] md:h-[260px] bg-[#111111] border border-[#2D2D2D] w-full md:flex-1">
            <span className="font-ibm-mono text-[11px] font-normal text-[#D6E264] tracking-[2px]">[04]</span>
            <h3 className="font-grotesk text-[24px] md:text-[28px] font-normal text-[#F5F5F0] tracking-[-1px] leading-[1.1] whitespace-pre-line">
              {"AI CHATBOT\n& AUTOMATION"}
            </h3>
            <p className="font-ibm-mono text-[12px] text-[#BBBBBB] tracking-[1px] leading-[1.6]">
              CUSTOM AI TRAINED ON YOUR CONTENT. AUTOMATE FOLLOW-UPS, SCHEDULING, AND REPORTING.
            </p>
          </div>

          {/* Bento E */}
          <div className="flex flex-col gap-5 p-8 md:p-[40px] md:h-[260px] bg-[#0F0F0F] border-2 border-[#FF6B35] w-full md:flex-1">
            <span className="font-ibm-mono text-[11px] font-normal text-[#FF6B35] tracking-[2px]">[05]</span>
            <h3 className="font-grotesk text-[24px] md:text-[28px] font-normal text-[#F5F5F0] tracking-[-1px] leading-[1.1] whitespace-pre-line">
              {"MVP &\nPRODUCT BUILD"}
            </h3>
            <p className="font-ibm-mono text-[12px] text-[#BBBBBB] tracking-[1px] leading-[1.6]">
              FROM IDEA TO LIVE PRODUCT IN 4 WEEKS. SENIOR ENGINEERING, CLEAN CODE, FULL HANDOVER.
            </p>
            <div className="flex items-center justify-center h-[28px] px-[12px] bg-[#1A1A1A] border border-[#FF6B35] w-fit">
              <span className="font-ibm-mono text-[10px] font-normal text-[#FF6B35] tracking-[2px]">[FROM £3,999]</span>
            </div>
          </div>

          {/* Bento F */}
          <div className="flex flex-col gap-5 p-8 md:p-[40px] md:h-[260px] bg-[#0A0A0A] border border-[#2D2D2D] w-full md:flex-1">
            <span className="font-ibm-mono text-[11px] font-normal text-[#D6E264] tracking-[2px]">[06]</span>
            <h3 className="font-grotesk text-[24px] md:text-[28px] font-normal text-[#F5F5F0] tracking-[-1px] leading-[1.1] whitespace-pre-line">
              {"DEDICATED PM\n& SLACK ACCESS"}
            </h3>
            <p className="font-ibm-mono text-[12px] text-[#BBBBBB] tracking-[1px] leading-[1.6]">
              REAL HUMANS. REAL COMMUNICATION. YOUR PM IS ON SLACK, NOT HIDING BEHIND A TICKET SYSTEM.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
