const serviceLinks = ["LAUNCH", "GROW", "BUILD", "PRICING"];
const companyLinks = ["OUR WORK", "PRODUCTS", "ABOUT", "BLOG"];
const resourceLinks = ["PARTNER PROGRAMME", "CLIENT PORTAL", "PROGRIZE"];

export default function Footer() {
  return (
    <footer className="flex flex-col w-full bg-[#050505]">
      {/* Top */}
      <div className="flex flex-col md:flex-row gap-12 md:gap-[80px] px-6 md:px-[120px] py-12 md:py-[64px]">
        {/* Brand */}
        <div className="flex flex-col gap-6 md:w-[280px] md:shrink-0">
          <div className="flex items-center gap-[12px]">
            <div className="w-[10px] h-[10px] bg-[#D6E264] shrink-0" />
            <span className="font-grotesk text-[16px] font-normal text-[#D6E264] tracking-[3px]">
              VAZGRO
            </span>
          </div>
          <p className="font-ibm-mono text-[11px] text-[#FFFFFF] tracking-[1px] leading-[1.6] max-w-[260px]">
            UK DIGITAL AGENCY — WEB DESIGN, MARKETING &amp; AI FOR GROWING BUSINESSES. LONDON, UK.
          </p>
          <div className="flex flex-wrap gap-[12px]">
            {[
              { label: "YT", href: "https://www.youtube.com" },
              { label: "FB", href: "https://www.facebook.com" },
              { label: "X", href: "https://x.com/vazgro" },
              { label: "IG", href: "https://www.instagram.com/vazgro" },
              { label: "IN", href: "https://www.linkedin.com/company/vazgro" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-[36px] h-[36px] bg-[#111111] border border-[#2D2D2D] hover:border-[#888888] transition-colors no-underline"
              >
                <span className="font-grotesk text-[10px] font-normal text-[#AAAAAA]">
                  {s.label}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 md:flex md:flex-1 gap-8 md:gap-[80px]">
          {[
            { heading: "SERVICES", links: serviceLinks },
            { heading: "COMPANY", links: companyLinks },
            { heading: "RESOURCES", links: resourceLinks },
          ].map((col) => (
            <div key={col.heading} className="flex flex-col gap-4 md:gap-[20px]">
              <span className="font-grotesk text-[11px] font-normal text-[#F5F5F0] tracking-[2px]">
                {col.heading}
              </span>
              {col.links.map((link) => (
                <a
                  key={link}
                  href="mailto:hello@vazgro.com"
                  className="font-ibm-mono text-[12px] text-[#FFFFFF] tracking-[1px] hover:text-[#CCCCCC] transition-colors no-underline"
                >
                  {link}
                </a>
              ))}
            </div>
          ))}

          {/* Get started col */}
          <div className="flex flex-col gap-4 md:gap-[20px] col-span-2 md:col-span-1">
            <span className="font-grotesk text-[11px] font-normal text-[#F5F5F0] tracking-[2px]">
              GET STARTED
            </span>
            <a href="mailto:hello@vazgro.com" className="font-ibm-mono text-[12px] text-[#FFFFFF] tracking-[1px] hover:text-[#CCCCCC] transition-colors no-underline">
              CONTACT US
            </a>
            <a href="mailto:hello@vazgro.com" className="font-ibm-mono text-[12px] text-[#D6E264] tracking-[1px] hover:text-[#e6c200] transition-colors no-underline font-normal">
              BOOK A FREE CALL
            </a>
            <a href="mailto:hello@vazgro.com" className="font-ibm-mono text-[12px] text-[#FFFFFF] tracking-[1px] hover:text-[#CCCCCC] transition-colors no-underline">
              HELLO@VAZGRO.COM
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full px-6 md:px-[120px] py-4 md:h-[56px] border-t border-t-[#1D1D1D] gap-3 sm:gap-0">
        <span className="font-ibm-mono text-[11px] text-[#BBBBBB] tracking-[1px]">
          © 2026 VAZGRO LTD · REGISTERED IN ENGLAND &amp; WALES · LONDON, UK
        </span>
        <div className="flex flex-wrap items-center gap-4 md:gap-[32px]">
          <a href="#" className="font-ibm-mono text-[11px] text-[#BBBBBB] tracking-[1px] hover:text-[#AAAAAA] transition-colors">
            PRIVACY
          </a>
          <a href="#" className="font-ibm-mono text-[11px] text-[#BBBBBB] tracking-[1px] hover:text-[#AAAAAA] transition-colors">
            TERMS
          </a>
          <span className="font-ibm-mono text-[11px] font-normal text-[#D6E264] tracking-[1px]">
            VAZGRO.COM
          </span>
        </div>
      </div>
    </footer>
  );
}
