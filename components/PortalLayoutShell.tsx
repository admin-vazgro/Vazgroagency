"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type ThemeMode = "dark" | "light";

type NavItem = {
  label: string;
  href: string;
  icon: string;
};

type PortalLayoutShellProps = {
  children: React.ReactNode;
  nav: NavItem[];
  portalLabel: string;
  sidebarWidthClass: string;
  sidebarOffsetClass: string;
};

const STORAGE_KEY = "portal-theme";

export default function PortalLayoutShell({
  children,
  nav,
  portalLabel,
  sidebarWidthClass,
  sidebarOffsetClass,
}: PortalLayoutShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState<ThemeMode>("dark");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(STORAGE_KEY);
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  async function handleSignOut() {
    const { createClient: mkClient } = await import("@/lib/supabase/client");
    const supabase = mkClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <div data-portal-theme={theme} className="portal-shell min-h-screen flex transition-colors duration-200">
      <aside className={`${sidebarWidthClass} fixed left-0 top-0 bottom-0 z-40 flex min-h-screen flex-col border-r bg-[var(--portal-surface)] border-[var(--portal-border)]`}>
        <div className="border-b border-[var(--portal-border)] px-5 py-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center bg-[var(--portal-accent)]">
              <span className="font-grotesk text-[12px] font-bold text-[var(--portal-accent-contrast)]">V</span>
            </div>
            <span className="font-grotesk text-[12px] font-bold tracking-[2px] text-[var(--portal-text)]">VAZGRO</span>
          </Link>
          <p className="mt-1.5 font-ibm-mono text-[9px] tracking-[2px] text-[var(--portal-text-dim)]">{portalLabel}</p>
        </div>

        <div className="border-b border-[var(--portal-border)] px-2 py-3">
          <button
            onClick={() => setTheme(nextTheme)}
            className="flex w-full items-center justify-between border border-[var(--portal-border-strong)] bg-[var(--portal-surface-alt)] px-3 py-2.5 font-ibm-mono text-[10px] tracking-[1px] text-[var(--portal-text-soft)] transition-colors hover:border-[var(--portal-accent)] hover:text-[var(--portal-accent)]"
          >
            <span>{theme === "dark" ? "LIGHT MODE" : "DARK MODE"}</span>
            <span>{theme === "dark" ? "◐" : "◑"}</span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3">
          {nav.map(({ label, href, icon }) => {
            const active = pathname === href || (href !== "/hub" && href !== "/workspace" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 transition-colors"
                style={{
                  background: active ? "var(--portal-active-bg)" : "transparent",
                  borderLeft: active ? "2px solid var(--portal-accent)" : "2px solid transparent",
                  color: active ? "var(--portal-accent)" : "var(--portal-text-soft)",
                }}
              >
                <span className="text-[13px]">{icon}</span>
                <span className="font-ibm-mono text-[10px] tracking-[1px]">{label.toUpperCase()}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[var(--portal-border)] px-2 py-3">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 bg-transparent px-3 py-2.5 text-[var(--portal-text-dim)] transition-colors hover:text-[var(--portal-text)]"
          >
            <span className="text-[13px]">→</span>
            <span className="font-ibm-mono text-[10px] tracking-[1px]">SIGN OUT</span>
          </button>
        </div>
      </aside>

      <main className={`${sidebarOffsetClass} min-h-screen flex-1 bg-[var(--portal-bg)] text-[var(--portal-text)]`}>
        {children}
      </main>
    </div>
  );
}
