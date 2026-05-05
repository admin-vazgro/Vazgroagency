import Link from "next/link";
import { IconYouTube, IconFacebook, IconX, IconInstagram, IconLinkedIn, IconVazgroLogo } from "./Icons";

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
  accent?: boolean;
};

const serviceLinks: FooterLink[] = [
  { label: "LAUNCH", href: "/services/launch" },
  { label: "GROW", href: "/services/grow" },
  { label: "BUILD", href: "/services/build" },
];

const companyLinks: FooterLink[] = [
  { label: "OUR WORK", href: "/work" },
  { label: "PRODUCTS", href: "/work" },
  { label: "ABOUT", href: "/about" },
  { label: "BLOG", href: "/blog" },
];

const resourceLinks: FooterLink[] = [
  { label: "PARTNER PROGRAMME", href: "/partner-programme" },
  { label: "VAZGRO HUB", href: "/login" },
  { label: "PROGRIZE", href: "https://www.progrize.com", external: true },
];

const getStartedLinks: FooterLink[] = [
  { label: "CONTACT US", href: "mailto:hello@vazgro.com", external: true },
  { label: "BOOK A FREE CALL", href: "mailto:hello@vazgro.com", external: true, accent: true },
  { label: "HELLO@VAZGRO.COM", href: "mailto:hello@vazgro.com", external: true },
];

function FooterNavLink({ link }: { link: FooterLink }) {
  const className = `font-ibm-mono text-[14px] tracking-[1px] transition-colors no-underline ${
    link.accent
      ? "text-[#6B7800] hover:text-[#4e5a00]"
      : "text-[#444444] hover:text-[#0A0A0A]"
  }`;

  if (link.external) {
    const isMailto = link.href.startsWith("mailto:");

    return (
      <a
        href={link.href}
        className={className}
        target={isMailto ? undefined : "_blank"}
        rel={isMailto ? undefined : "noopener noreferrer"}
      >
        {link.label}
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="flex flex-col w-full bg-[#F5F5F5]">
      <div className="flex flex-col gap-12 px-6 py-12 md:flex-row md:gap-[80px] md:px-8 lg:px-[120px] md:py-[64px]">
        <div className="flex flex-col gap-6 md:w-[280px] md:shrink-0">
          <Link href="/" className="flex items-center gap-[12px] no-underline">
            <IconVazgroLogo size={24} />
            <span className="font-grotesk text-[16px] font-normal text-[#0A0A0A] tracking-[3px]">
              VAZGRO
            </span>
          </Link>
          <p className="font-ibm-mono text-[14px] text-[#555555] tracking-[1px] leading-[1.6] max-w-[260px]">
            UK DIGITAL AGENCY — WEB DESIGN, MARKETING &amp; AI FOR GROWING BUSINESSES. LONDON, UK.
          </p>
          <div className="flex flex-wrap gap-[12px]">
            {[
              { Icon: IconYouTube, label: "YouTube", href: "https://www.youtube.com/@vazgro" },
              { Icon: IconFacebook, label: "Facebook", href: "https://www.facebook.com/vazgro" },
              { Icon: IconX, label: "X", href: "https://x.com/vazgro" },
              { Icon: IconInstagram, label: "Instagram", href: "https://www.instagram.com/vazgro" },
              { Icon: IconLinkedIn, label: "LinkedIn", href: "https://www.linkedin.com/company/vazgro" },
            ].map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex items-center justify-center w-[36px] h-[36px] bg-white border border-[#D8D8D8] hover:border-[#888888] transition-colors no-underline"
              >
                <Icon size={16} color="#555555" />
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 md:flex md:flex-1 md:gap-[80px]">
          {[
            { heading: "SERVICES", links: serviceLinks },
            { heading: "COMPANY", links: companyLinks },
            { heading: "RESOURCES", links: resourceLinks },
          ].map((column) => (
            <div key={column.heading} className="flex flex-col gap-4 md:gap-[20px]">
              <span className="font-grotesk text-[14px] font-normal text-[#0A0A0A] tracking-[2px]">
                {column.heading}
              </span>
              {column.links.map((link) => (
                <FooterNavLink key={link.label} link={link} />
              ))}
            </div>
          ))}

          <div className="flex flex-col gap-4 md:gap-[20px] col-span-2 md:col-span-1">
            <span className="font-grotesk text-[14px] font-normal text-[#0A0A0A] tracking-[2px]">
              GET STARTED
            </span>
            {getStartedLinks.map((link) => (
              <FooterNavLink key={link.label} link={link} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start justify-between gap-3 border-t border-t-[#E5E5E5] px-6 py-4 sm:flex-row sm:items-center sm:gap-0 md:px-8 lg:px-[120px] md:h-[56px]">
        <span className="font-ibm-mono text-[14px] text-[#777777] tracking-[1px]">
          © 2026 VAZGRO LTD · REGISTERED IN ENGLAND &amp; WALES · LONDON, UK
        </span>
        <div className="flex flex-wrap items-center gap-4 md:gap-[32px]">
          <Link href="/privacy" className="font-ibm-mono text-[14px] text-[#777777] tracking-[1px] hover:text-[#444444] transition-colors no-underline">
            PRIVACY
          </Link>
          <Link href="/terms" className="font-ibm-mono text-[14px] text-[#777777] tracking-[1px] hover:text-[#444444] transition-colors no-underline">
            TERMS
          </Link>
          <Link href="/" className="font-ibm-mono text-[14px] font-normal text-[#6B7800] tracking-[1px] no-underline">
            VAZGRO.COM
          </Link>
        </div>
      </div>
    </footer>
  );
}
