import SectionHeader from "./SectionHeader";

interface PricingCardProps {
  tier: string;
  tierColor?: string;
  name: string;
  nameColor?: string;
  price: string;
  priceColor?: string;
  priceSuffix?: string;
  btnLabel: string;
  btnLabelColor?: string;
  bgColor?: string;
  borderColor?: string;
  borderWidth?: number;
  btnBg?: string;
  btnBorderColor?: string;
  tierBg?: string;
  tierBorderColor?: string;
  features: { label: string; included: boolean }[];
  accentColor?: string;
  href?: string;
}

function PricingCard({
  tier,
  tierColor = "#FFFFFF",
  name,
  nameColor = "#F5F5F0",
  price,
  priceColor = "#F5F5F0",
  priceSuffix = "",
  btnLabel,
  btnLabelColor = "#FFFFFF",
  bgColor = "#0F0F0F",
  borderColor = "#2D2D2D",
  borderWidth = 1,
  btnBg = "#1A1A1A",
  btnBorderColor = "#888888",
  tierBg = "#1A1A1A",
  tierBorderColor = "#888888",
  features,
  accentColor = "#AAAAAA",
  href = "mailto:hello@vazgro.com",
}: PricingCardProps) {
  return (
    <div
      className="flex min-w-0 flex-col gap-8 overflow-hidden p-6 lg:w-full lg:flex-1 lg:p-[40px]"
      style={{ backgroundColor: bgColor, border: `${borderWidth}px solid ${borderColor}` }}
    >
      <div
        className="flex items-center justify-center h-[28px] px-[12px] w-fit"
        style={{ backgroundColor: tierBg, border: `1px solid ${tierBorderColor}` }}
      >
        <span className="font-ibm-mono text-[14px] tracking-[2px]" style={{ color: tierColor }}>
          {tier}
        </span>
      </div>
      <span className="font-grotesk text-[28px] font-normal tracking-[1px]" style={{ color: nameColor }}>
        {name}
      </span>
      <div className="flex flex-wrap items-end gap-[4px]">
        <span className="font-grotesk text-[40px] lg:text-[48px] font-normal tracking-[-2px] leading-none" style={{ color: priceColor }}>
          {price}
        </span>
        {priceSuffix && (
          <span className="font-ibm-mono text-[14px] lg:text-[14px] text-[#AAAAAA] tracking-[1px] mb-[6px]">{priceSuffix}</span>
        )}
      </div>

      {/* Feature list */}
      <div className="flex flex-col gap-[10px]" style={{ borderTop: `1px solid ${borderColor === "#0F0F0F" ? "#2D2D2D" : borderColor}` }}>
        <div className="pt-6 flex flex-col gap-[10px]">
          {features.map((f, i) => (
            <div key={i} className="flex min-w-0 items-start gap-3">
              <span
                className="font-ibm-mono text-[14px] leading-none shrink-0"
                style={{ color: f.included ? accentColor : "#888888" }}
              >
                {f.included ? "+" : "—"}
              </span>
              <span
                className="min-w-0 break-words font-ibm-mono text-[14px] tracking-[0.8px] leading-[1.6]"
                style={{ color: f.included ? "#CCCCCC" : "#888888" }}
              >
                {f.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <a
        href={href}
        className="mt-auto flex h-[48px] w-full items-center justify-center no-underline"
        style={{ backgroundColor: btnBg, border: `2px solid ${btnBorderColor}` }}
      >
        <span className="text-center font-ibm-mono text-[14px] md:text-[14px] tracking-[1.5px] md:tracking-[2px]" style={{ color: btnLabelColor }}>
          {btnLabel}
        </span>
      </a>
    </div>
  );
}

const LAUNCH_FEATURES = [
  { label: "LANDING PAGE FROM £149 (3 DAYS)", included: true },
  { label: "STARTER SITE FROM £199 (7 DAYS)", included: true },
  { label: "BUSINESS SITE FROM £499 (14 DAYS)", included: true },
  { label: "E-COMMERCE FROM £999 (21 DAYS)", included: true },
  { label: "BRAND STARTER KIT FROM £299", included: true },
  { label: "AI CHATBOT SETUP £799", included: true },
  { label: "AUTOMATION QUICK-WIN £599", included: true },
  { label: "FULL IP TRANSFER INCLUDED", included: true },
];

const GROW_FEATURES = [
  { label: "DESIGN FROM £349/MO", included: true },
  { label: "DEVELOPMENT FROM £799/MO", included: true },
  { label: "SOCIAL MEDIA FROM £399/MO", included: true },
  { label: "UNLIMITED REQUESTS & REVISIONS", included: true },
  { label: "DEDICATED PM + SLACK ACCESS", included: true },
  { label: "FAST TURNAROUND ACROSS CHANNELS", included: true },
  { label: "3-MONTH MINIMUM, CANCEL AFTER", included: true },
  { label: "NO LONG-TERM LOCK-IN", included: true },
];

const BUILD_FEATURES = [
  { label: "MVP DEVELOPMENT £3,999–£8,000", included: true },
  { label: "AI PRODUCTS £5,000–£15,000", included: true },
  { label: "CUSTOM PLATFORMS £10,000–£25,000+", included: true },
  { label: "SPRINT RETAINERS £2,500–£8,000/MO", included: true },
  { label: "SENIOR ENGINEERING TEAM", included: true },
  { label: "FULL IP TRANSFER + DOCS", included: true },
  { label: "PROPOSAL WITHIN 48 HOURS", included: true },
  { label: "FREE STRATEGY CALL FIRST", included: true },
];

export default function Pricing() {
  return (
    <section id="pricing" className="flex flex-col w-full bg-[#080808] py-16 px-6 md:py-[100px] md:px-8 lg:px-[120px] gap-12 md:gap-[64px]">
      <SectionHeader
        label="[09] // PRICING"
        title={"TRANSPARENT.\nNO SURPRISES."}
        subtitle="ALL LAUNCH AND GROW PRICES ARE FINAL. BUILD IS SCOPED INDIVIDUALLY — FREE CALL FIRST."
      />

      <div className="flex w-full flex-col gap-[2px] lg:flex-row">
        <PricingCard
          tier="⚡ LAUNCH"
          name="FIXED-FEE"
          price="£149"
          priceSuffix="+ ONE-OFF"
          btnLabel="BROWSE PACKAGES"
          features={LAUNCH_FEATURES}
          accentColor="#555555"
          href="mailto:hello@vazgro.com"
        />
        <PricingCard
          tier="MOST POPULAR"
          tierColor="#0A0A0A"
          tierBg="#D6E264"
          tierBorderColor="#D6E264"
          name="📈 GROW"
          nameColor="#D6E264"
          price="£349"
          priceSuffix="/MO"
          priceColor="#D6E264"
          btnLabel="START YOUR SUBSCRIPTION"
          btnLabelColor="#0A0A0A"
          bgColor="#111111"
          borderColor="#D6E264"
          borderWidth={2}
          btnBg="#D6E264"
          btnBorderColor="transparent"
          features={GROW_FEATURES}
          accentColor="#D6E264"
          href="mailto:hello@vazgro.com"
        />
        <PricingCard
          tier="🔧 BUILD"
          tierColor="#FF6B35"
          tierBorderColor="#FF6B35"
          name="CUSTOM"
          price="£3,999"
          priceSuffix="+ CUSTOM"
          btnLabel="BOOK A FREE CALL"
          btnLabelColor="#FF6B35"
          btnBorderColor="#FF6B35"
          features={BUILD_FEATURES}
          accentColor="#FF6B35"
          href="mailto:hello@vazgro.com"
        />
      </div>
    </section>
  );
}
