"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { label: "SERVICES",  section: "features"  },
  { label: "PROCESS",   section: "process"   },
  { label: "SHOWCASE",  section: "showcase"  },
  { label: "FAQ",       section: "faq"       },
  { label: "PRICING",   section: "pricing"   },
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const y = el.getBoundingClientRect().top + window.scrollY - 84;
  window.scrollTo({ top: y, behavior: "smooth" });
}

export default function Navbar() {
  const [scrolled, setScrolled]           = useState(false);
  const [active, setActive]               = useState("");
  const [menuOpen, setMenuOpen]           = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  // On the homepage the background is always dark, so use light text.
  // On all other pages (white bg) use dark text until the user scrolls and
  // the frosted-dark backdrop kicks in.
  const isHomepage = pathname === "/";
  const useLightText = isHomepage || scrolled;

  const navTextColor   = useLightText ? "#E8E8E8" : "#1A1A1A";
  const navHoverColor  = useLightText ? "#FFFFFF"  : "#000000";
  const contactColor   = useLightText ? "#E8E8E8" : "#1A1A1A";
  const mobileTextColor = "#E8E8E8"; // mobile drawer always has dark bg

  function navigateToSection(section: string) {
    setMenuOpen(false);

    if (pathname === "/") {
      scrollToSection(section);
      return;
    }

    router.push(`/#${section}`);
  }

  /* ── scroll detection ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── active section via IntersectionObserver ── */
  useEffect(() => {
    if (pathname !== "/") {
      setActive("");
      return;
    }

    const ids = links.map((l) => l.section).filter(Boolean);
    const obs: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const o = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: "-35% 0px -60% 0px" }
      );
      o.observe(el);
      obs.push(o);
    });

    return () => obs.forEach((o) => o.disconnect());
  }, [pathname]);

  /* ── adjust hash navigation for fixed header ── */
  useEffect(() => {
    if (pathname !== "/") return;

    const syncHashScroll = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (!id) return;

      window.requestAnimationFrame(() => {
        scrollToSection(id);
      });
    };

    syncHashScroll();
    window.addEventListener("hashchange", syncHashScroll);

    return () => window.removeEventListener("hashchange", syncHashScroll);
  }, [pathname]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background:       scrolled ? "rgba(10,10,10,0.88)" : "transparent",
        backdropFilter:   scrolled ? "blur(14px)"          : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px)"      : "none",
        borderBottom:     scrolled ? "1px solid #1E1E1E" : useLightText ? "1px solid transparent" : "1px solid #E5E5E5",
      }}
    >
        <div className="flex items-center justify-between h-[60px] px-6 md:px-[48px] max-w-[1400px] mx-auto">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-[10px] shrink-0 group">
          <span className="w-[10px] h-[10px] bg-[#D6E264] group-hover:scale-110 transition-transform" />
          <span
            className="font-grotesk text-[13px] font-normal tracking-[2.5px] transition-colors duration-300"
            style={{ color: useLightText ? "#F5F5F0" : "#0A0A0A" }}
          >
            VAZGRO
          </span>
        </Link>

        {/* ── Desktop nav ── */}
        <nav className="hidden md:flex items-center gap-[36px]">
          {links.map(({ label, section }) => {
            const isActive = active === section;
            return (
              <button
                key={label}
                type="button"
                onClick={() => navigateToSection(section)}
                className="relative font-ibm-mono text-[11px] tracking-[1.5px] transition-colors duration-150 bg-transparent border-none cursor-pointer"
                style={{ color: isActive ? "#D6E264" : navTextColor }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = navHoverColor;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = isActive ? "#D6E264" : navTextColor;
                }}
              >
                {label}
                <span
                  className="absolute left-0 -bottom-[3px] h-[1.5px] bg-[#D6E264] transition-all duration-300"
                  style={{ width: isActive ? "100%" : "0%" }}
                />
              </button>
            );
          })}
        </nav>

        {/* ── Desktop CTA ── */}
        <div className="hidden md:flex items-center gap-[14px]">
          <a
            href="mailto:hello@vazgro.com"
            className="font-ibm-mono text-[11px] tracking-[1.5px] hover:text-[#FFFFFF] transition-colors"
            style={{ color: contactColor }}
          >
            CONTACT
          </a>
          <button
            type="button"
            onClick={() => navigateToSection("pricing")}
            className="font-grotesk text-[11px] font-normal text-[#0A0A0A] bg-[#D6E264] tracking-[1.5px] px-[18px] py-[9px] hover:bg-[#F5F5F0] transition-colors"
          >
            BOOK A CALL
          </button>
        </div>

        {/* ── Mobile burger ── */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2 -mr-2"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span
            className="block w-[20px] h-[1.5px] transition-all duration-200 origin-center"
            style={{ background: useLightText ? "#F5F5F0" : "#0A0A0A", transform: menuOpen ? "translateY(6.5px) rotate(45deg)" : "none" }}
          />
          <span
            className="block w-[20px] h-[1.5px] transition-all duration-200"
            style={{ background: useLightText ? "#F5F5F0" : "#0A0A0A", opacity: menuOpen ? 0 : 1 }}
          />
          <span
            className="block w-[20px] h-[1.5px] transition-all duration-200 origin-center"
            style={{ background: useLightText ? "#F5F5F0" : "#0A0A0A", transform: menuOpen ? "translateY(-6.5px) rotate(-45deg)" : "none" }}
          />
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight:    menuOpen ? "400px" : "0px",
          background:   "rgba(10,10,10,0.97)",
          backdropFilter: "blur(14px)",
          borderBottom: menuOpen ? "1px solid #1E1E1E" : "none",
        }}
      >
        <nav className="flex flex-col px-6 py-5 gap-0">
          {links.map(({ label, section }) => {
            const isActive = active === section;
            return (
              <button
                key={label}
                type="button"
                onClick={() => navigateToSection(section)}
                className="flex items-center gap-2 w-full font-ibm-mono text-[12px] tracking-[2px] py-[14px] border-b border-[#141414] transition-colors bg-transparent border-x-0 border-t-0 cursor-pointer"
                style={{ color: isActive ? "#D6E264" : mobileTextColor }}
              >
                <span
                  className="w-[4px] h-[4px] rounded-full shrink-0 transition-colors"
                  style={{ background: isActive ? "#D6E264" : "#2D2D2D" }}
                />
                {label}
              </button>
            );
          })}
          <div className="flex flex-col gap-[10px] pt-5">
            <a
              href="mailto:hello@vazgro.com"
              className="font-ibm-mono text-[12px] tracking-[1.5px]"
              style={{ color: contactColor }}
            >
              CONTACT
            </a>
            <button
              type="button"
              onClick={() => navigateToSection("pricing")}
              className="font-grotesk text-[11px] font-normal text-[#0A0A0A] bg-[#D6E264] tracking-[1.5px] px-[18px] py-[11px] text-center hover:bg-[#F5F5F0] transition-colors"
            >
              BOOK A CALL
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
