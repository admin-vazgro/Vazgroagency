import Link from "next/link";

interface LegalSection {
  title: string;
  body: string[];
}

interface LegalPageProps {
  activePage: "privacy" | "terms";
  eyebrow: string;
  title: string;
  description: string;
  effectiveDate: string;
  sections: LegalSection[];
}

export default function LegalPage({
  activePage,
  eyebrow,
  title,
  description,
  effectiveDate,
  sections,
}: LegalPageProps) {
  return (
    <main className="flex flex-col w-full bg-white pt-[60px]">
      <section className="flex flex-col w-full border-b border-[#E5E5E5] px-6 py-16 md:px-[120px] md:py-[80px]">
        <span className="font-ibm-mono text-[14px] font-normal text-[#6B7800] tracking-[3px]">
          {eyebrow}
        </span>
        <div className="h-5" />
        <h1 className="font-grotesk text-[40px] md:text-[72px] font-normal text-[#0A0A0A] tracking-[-3px] leading-[0.95]">
          {title}
        </h1>
        <div className="h-6" />
        <p className="max-w-[720px] font-ibm-mono text-[14px] md:text-[14px] text-[#555555] tracking-[0.5px] leading-[1.8]">
          {description}
        </p>
        <div className="h-8" />
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-4 md:gap-6">
            <span className="font-ibm-mono text-[14px] text-[#666666] tracking-[1px]">
              EFFECTIVE DATE: {effectiveDate}
            </span>
            <span className="font-ibm-mono text-[14px] text-[#666666] tracking-[1px]">
              VAZGRO LTD · LONDON, UK
            </span>
          </div>
          <div className="flex flex-wrap gap-[2px]">
            <Link
              href="/privacy"
              className="px-4 py-2 font-ibm-mono text-[14px] tracking-[2px] no-underline transition-colors"
              style={{
                backgroundColor: activePage === "privacy" ? "#D6E264" : "#F0F0F0",
                color: activePage === "privacy" ? "#0A0A0A" : "#444444",
                border: `1px solid ${activePage === "privacy" ? "#D6E264" : "#D8D8D8"}`,
              }}
            >
              PRIVACY
            </Link>
            <Link
              href="/terms"
              className="px-4 py-2 font-ibm-mono text-[14px] tracking-[2px] no-underline transition-colors"
              style={{
                backgroundColor: activePage === "terms" ? "#D6E264" : "#F0F0F0",
                color: activePage === "terms" ? "#0A0A0A" : "#444444",
                border: `1px solid ${activePage === "terms" ? "#D6E264" : "#D8D8D8"}`,
              }}
            >
              TERMS
            </Link>
          </div>
        </div>
      </section>

      <section className="flex w-full justify-center px-6 py-16 md:px-[120px] md:py-[80px]">
        <div className="flex w-full max-w-[920px] flex-col gap-[2px]">
          {sections.map((section) => (
            <div key={section.title} className="flex flex-col gap-4 border border-[#E5E5E5] bg-[#F8F8F8] p-6 md:p-8">
              <h2 className="font-grotesk text-[16px] md:text-[18px] font-normal text-[#6B7800] tracking-[1px]">
                {section.title}
              </h2>
              <div className="flex flex-col gap-4">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="font-ibm-mono text-[14px] md:text-[14px] text-[#444444] tracking-[0.5px] leading-[1.8]">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col w-full border-t border-[#E5E5E5] px-6 py-12 md:px-[120px] md:py-[60px]">
        <p className="max-w-[760px] font-ibm-mono text-[14px] md:text-[14px] text-[#555555] tracking-[0.5px] leading-[1.8]">
          If you have any questions about these legal terms or how Vazgro handles your data, email{" "}
          <a href="mailto:hello@vazgro.com" className="text-[#6B7800] hover:underline">
            hello@vazgro.com
          </a>
          .
        </p>
      </section>
    </main>
  );
}
