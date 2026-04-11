import SectionHeader from "./SectionHeader";

const rows = [
  { feature: "FIXED, TRANSPARENT PRICING", vz: "[✓]", agency: "[—]", freelance: "[—]", diy: "[✗]" },
  { feature: "DELIVERY IN DAYS, NOT MONTHS", vz: "[✓]", agency: "[✗]", freelance: "[—]", diy: "[✗]" },
  { feature: "DEDICATED PM + SLACK ACCESS", vz: "[✓]", agency: "[✓]", freelance: "[✗]", diy: "[✗]" },
  { feature: "AI & AUTOMATION INCLUDED", vz: "[✓]", agency: "[—]", freelance: "[✗]", diy: "[✗]" },
  { feature: "FULL IP TRANSFER", vz: "[✓]", agency: "[✓]", freelance: "[—]", diy: "[✓]" },
  { feature: "NO LONG-TERM CONTRACT", vz: "[✓]", agency: "[✗]", freelance: "[✓]", diy: "[✓]" },
];

function cellStyle(val: string) {
  if (val === "[✓]") return "font-normal text-[14px]";
  if (val === "[✗]") return "text-[#CCCCCC] text-[13px]";
  if (val === "[—]") return "text-[#999999] text-[13px]";
  return "text-[#999999] text-[10px]";
}

function cellColor(val: string) {
  if (val === "[✓]") return "text-[#999999]";
  return "";
}

export default function Comparison() {
  return (
    <section id="comparison" className="flex flex-col w-full bg-[#050505] py-16 px-6 md:py-[100px] md:px-8 lg:px-[120px] gap-12 md:gap-[64px]">
      <SectionHeader
        label="[06] // VS. THE REST"
        title={"WHY VAZGRO\nWINS."}
        subtitle="SEE HOW WE STACK UP AGAINST TRADITIONAL AGENCIES, FREELANCERS, AND DIY TOOLS."
      />

      {/* Desktop table */}
      <div className="hidden lg:flex flex-col w-full border border-[#2D2D2D]">
        {/* Header */}
        <div className="flex w-full h-[56px] bg-[#111111] border-b-2 border-b-[#D6E264]">
          <div className="flex items-center w-[400px] shrink-0 px-[32px] border-r border-r-[#2D2D2D]">
            <span className="font-grotesk text-[11px] font-normal text-[#FFFFFF] tracking-[2px]">FEATURE</span>
          </div>
          <div className="flex items-center flex-1 px-[32px] bg-[#1A1A1A] border-r border-r-[#2D2D2D]">
            <span className="font-grotesk text-[11px] font-normal text-[#D6E264] tracking-[2px]">VAZGRO</span>
          </div>
          {["TRAD. AGENCY", "FREELANCER", "DIY"].map((tool, i) => (
            <div key={tool} className={`flex items-center flex-1 px-[32px] ${i < 2 ? "border-r border-r-[#2D2D2D]" : ""}`}>
              <span className="font-grotesk text-[11px] font-normal text-[#AAAAAA] tracking-[2px]">{tool}</span>
            </div>
          ))}
        </div>

        {/* Data rows */}
        {rows.map((row, i) => (
          <div key={row.feature} className={`flex w-full h-[56px] ${i < rows.length - 1 ? "border-b border-b-[#1D1D1D]" : ""}`}>
            <div className="flex items-center w-[400px] shrink-0 px-[32px] border-r border-r-[#2D2D2D]">
              <span className="font-ibm-mono text-[12px] text-[#CCCCCC] tracking-[1px]">{row.feature}</span>
            </div>
            <div className="flex items-center flex-1 px-[32px] bg-[#0D0D0D] border-r border-r-[#2D2D2D]">
              <span className="font-ibm-mono tracking-[1px] text-[#D6E264] font-normal text-[14px]">{row.vz}</span>
            </div>
            {[row.agency, row.freelance, row.diy].map((val, j) => (
              <div key={j} className={`flex items-center flex-1 px-[32px] ${j < 2 ? "border-r border-r-[#2D2D2D]" : ""}`}>
                <span className={`font-ibm-mono tracking-[1px] ${cellStyle(val)} ${cellColor(val)}`}>{val}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Mobile: card-per-feature layout */}
      <div className="flex flex-col lg:hidden w-full gap-[2px]">
        {rows.map((row, i) => (
          <div
            key={row.feature}
            className={`flex flex-col gap-4 border border-[#1D1D1D] p-4 ${i % 2 === 0 ? "bg-[#0A0A0A]" : "bg-[#0D0D0D]"}`}
          >
            <div className="flex items-center justify-between gap-4">
              <span className="font-ibm-mono text-[10px] text-[#CCCCCC] tracking-[1px] leading-[1.5]">
                {row.feature}
              </span>
              <span className="font-ibm-mono text-[10px] text-[#D6E264] tracking-[1.5px] shrink-0">
                VAZGRO {row.vz}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-[2px]">
              {[
                { label: "AGENCY", value: row.agency },
                { label: "FREELANCER", value: row.freelance },
                { label: "DIY", value: row.diy },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-2 border border-[#1D1D1D] bg-[#111111] px-3 py-3">
                  <span className="font-grotesk text-[8px] font-normal text-[#AAAAAA] tracking-[1px]">
                    {item.label}
                  </span>
                  <span className={`font-ibm-mono text-[12px] ${cellColor(item.value)}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
