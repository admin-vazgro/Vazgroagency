"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type ThemeMode = "dark" | "light";

export type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

type PortalLayoutShellProps = {
  children: React.ReactNode;
  navGroups: NavGroup[];
  portalLabel: string;
  sidebarWidthClass: string;
  sidebarOffsetClass: string;
  /** If provided, an Admin link appears in the profile section */
  adminHref?: string;
  /** If provided, a Library link appears in the profile section */
  libraryHref?: string;
};

const STORAGE_KEY = "portal-theme";

export default function PortalLayoutShell({
  children,
  navGroups,
  portalLabel,
  sidebarWidthClass,
  sidebarOffsetClass,
  adminHref,
  libraryHref,
}: PortalLayoutShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState<ThemeMode>("dark");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "dark" || saved === "light") setTheme(saved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div data-portal-theme={theme} className="portal-shell min-h-screen flex transition-colors duration-200">
      <aside
        className={`${sidebarWidthClass} fixed left-0 top-0 bottom-0 z-40 flex min-h-screen flex-col border-r bg-[var(--portal-surface)] border-[var(--portal-border)]`}
      >
        {/* Logo */}
        <div className="border-b border-[var(--portal-border)] px-5 py-5 shrink-0">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center bg-[var(--portal-accent)]">
              <span className="font-grotesk text-[14px] font-bold text-[var(--portal-accent-contrast)]">V</span>
            </div>
            <span className="font-grotesk text-[14px] font-bold tracking-[2px] text-[var(--portal-text)]">VAZGRO</span>
          </Link>
          <p className="mt-1.5 font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-dim)]">{portalLabel}</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 flex flex-col gap-5">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="px-3 mb-1.5 font-ibm-mono text-[8px] tracking-[2.5px] text-[var(--portal-text-faint)]">
                {group.label}
              </p>
              {group.items.map(({ label, href, icon }) => {
                const active =
                  pathname === href ||
                  (href !== "/hub" && href !== "/workspace" && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3 px-3 py-2 rounded-none transition-colors"
                    style={{
                      background: active ? "var(--portal-active-bg)" : "transparent",
                      borderLeft: active
                        ? "2px solid var(--portal-accent)"
                        : "2px solid transparent",
                      color: active ? "var(--portal-accent)" : "var(--portal-text-soft)",
                    }}
                  >
                    <span className="shrink-0 w-[14px] h-[14px] flex items-center justify-center">
                      {icon}
                    </span>
                    <span className="font-ibm-mono text-[14px] tracking-[1px]">
                      {label.toUpperCase()}
                    </span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Profile / bottom section */}
        <div className="border-t border-[var(--portal-border)] px-2 py-3 shrink-0 flex flex-col gap-0.5">
          {adminHref ? (
            <Link
              href={adminHref}
              className="flex items-center gap-3 px-3 py-2 text-[var(--portal-text-dim)] hover:text-[var(--portal-text-soft)] transition-colors"
            >
              <IconAdmin />
              <span className="font-ibm-mono text-[14px] tracking-[1px]">ADMIN</span>
            </Link>
          ) : null}
          {libraryHref ? (
            <Link
              href={libraryHref}
              className="flex items-center gap-3 px-3 py-2 text-[var(--portal-text-dim)] hover:text-[var(--portal-text-soft)] transition-colors"
            >
              <IconLibrary />
              <span className="font-ibm-mono text-[14px] tracking-[1px]">LIBRARY</span>
            </Link>
          ) : null}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center gap-3 px-3 py-2 w-full text-[var(--portal-text-dim)] hover:text-[var(--portal-text-soft)] transition-colors bg-transparent border-none cursor-pointer text-left"
          >
            <IconTheme dark={theme === "dark"} />
            <span className="font-ibm-mono text-[14px] tracking-[1px]">
              {theme === "dark" ? "LIGHT MODE" : "DARK MODE"}
            </span>
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2 w-full text-[var(--portal-text-dim)] hover:text-[var(--portal-text-soft)] transition-colors bg-transparent border-none cursor-pointer text-left"
          >
            <IconSignOut />
            <span className="font-ibm-mono text-[14px] tracking-[1px]">SIGN OUT</span>
          </button>
        </div>
      </aside>

      <main
        className={`${sidebarOffsetClass} min-h-screen flex-1 bg-[var(--portal-bg)] text-[var(--portal-text)]`}
      >
        {children}
      </main>
    </div>
  );
}

/* ── Inline SVG icons ── */

function IconAdmin() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="4.5" r="2.5" />
      <path d="M7 9c-3.3 0-5 1.5-5 2.5v.5h10v-.5c0-1-1.7-2.5-5-2.5z" />
    </svg>
  );
}

function IconLibrary() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="2" width="3" height="10" />
      <rect x="5.5" y="2" width="3" height="10" />
      <path d="M10 2l2.5 1-2.5 9-2.5-1 2.5-9z" />
    </svg>
  );
}

function IconTheme({ dark }: { dark: boolean }) {
  return dark ? (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="7" cy="7" r="3" />
      <line x1="7" y1="1" x2="7" y2="2.5" />
      <line x1="7" y1="11.5" x2="7" y2="13" />
      <line x1="1" y1="7" x2="2.5" y2="7" />
      <line x1="11.5" y1="7" x2="13" y2="7" />
      <line x1="2.9" y1="2.9" x2="4" y2="4" />
      <line x1="10" y1="10" x2="11.1" y2="11.1" />
      <line x1="11.1" y1="2.9" x2="10" y2="4" />
      <line x1="4" y1="10" x2="2.9" y2="11.1" />
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M12 8.5A5.5 5.5 0 0 1 5.5 2a5.5 5.5 0 1 0 6.5 6.5z" />
    </svg>
  );
}

function IconSignOut() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 2H2.5A1.5 1.5 0 0 0 1 3.5v7A1.5 1.5 0 0 0 2.5 12H5" />
      <polyline points="9,4 13,7 9,10" />
      <line x1="13" y1="7" x2="5" y2="7" />
    </svg>
  );
}
