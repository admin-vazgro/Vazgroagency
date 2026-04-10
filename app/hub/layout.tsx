"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const nav = [
  { label: "Dashboard", href: "/hub", icon: "⬛" },
  { label: "Inbox", href: "/hub/inbox", icon: "◈" },
  { label: "Leads", href: "/hub/leads", icon: "◉" },
  { label: "Deals", href: "/hub/deals", icon: "◫" },
  { label: "Accounts", href: "/hub/accounts", icon: "◧" },
  { label: "Engagements", href: "/hub/engagements", icon: "◎" },
  { label: "Library", href: "/hub/library", icon: "◌" },
  { label: "Partners", href: "/hub/partners", icon: "◈" },
  { label: "Commissions", href: "/hub/commissions", icon: "◉" },
  { label: "Reports", href: "/hub/reports", icon: "◫" },
  { label: "Admin", href: "/hub/admin", icon: "◧" },
];

export default function HubLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const { createClient: mkClient } = await import("@/lib/supabase/client");
    const supabase = mkClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      {/* Sidebar */}
      <aside className="w-[220px] min-h-screen border-r border-[#1D1D1D] bg-[#0F0F0F] flex flex-col fixed left-0 top-0 bottom-0 z-40">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-[#1D1D1D]">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-7 h-7 bg-[#D6E264] flex items-center justify-center">
              <span className="font-grotesk text-[12px] font-bold text-[#0A0A0A]">V</span>
            </div>
            <span className="font-grotesk text-[12px] font-bold text-[#F5F5F0] tracking-[2px]">VAZGRO</span>
          </Link>
          <p className="font-ibm-mono text-[9px] text-[#555] tracking-[2px] mt-1.5">INTERNAL HUB</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5 overflow-y-auto">
          {nav.map(({ label, href, icon }) => {
            const active = pathname === href || (href !== "/hub" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 transition-colors"
                style={{
                  background: active ? "#1A1A0A" : "transparent",
                  borderLeft: active ? "2px solid #D6E264" : "2px solid transparent",
                  color: active ? "#D6E264" : "#777",
                }}
              >
                <span className="text-[13px]">{icon}</span>
                <span className="font-ibm-mono text-[10px] tracking-[1px]">{label.toUpperCase()}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="px-2 py-3 border-t border-[#1D1D1D]">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-[#555] hover:text-[#AAAAAA] transition-colors cursor-pointer bg-transparent border-none"
          >
            <span className="text-[13px]">→</span>
            <span className="font-ibm-mono text-[10px] tracking-[1px]">SIGN OUT</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-[220px] min-h-screen">
        {children}
      </main>
    </div>
  );
}
