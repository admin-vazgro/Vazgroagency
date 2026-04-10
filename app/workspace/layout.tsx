"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const nav = [
  { label: "Dashboard", href: "/workspace", icon: "⬛" },
  { label: "Engagements", href: "/workspace/engagements", icon: "◈" },
  { label: "Requests", href: "/workspace/requests", icon: "◫" },
  { label: "Files", href: "/workspace/files", icon: "◧" },
  { label: "Billing", href: "/workspace/billing", icon: "◉" },
  { label: "Team", href: "/workspace/team", icon: "◎" },
  { label: "Settings", href: "/workspace/settings", icon: "◌" },
];

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
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
      <aside className="w-[240px] min-h-screen border-r border-[#1D1D1D] bg-[#0F0F0F] flex flex-col fixed left-0 top-0 bottom-0 z-40">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-[#1D1D1D]">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-7 h-7 bg-[#D6E264] flex items-center justify-center">
              <span className="font-grotesk text-[12px] font-bold text-[#0A0A0A]">V</span>
            </div>
            <span className="font-grotesk text-[12px] font-bold text-[#F5F5F0] tracking-[2px]">VAZGRO</span>
          </Link>
          <p className="font-ibm-mono text-[9px] text-[#555] tracking-[2px] mt-2">CLIENT WORKSPACE</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {nav.map(({ label, href, icon }) => {
            const active = pathname === href || (href !== "/workspace" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 transition-colors"
                style={{
                  background: active ? "#1A1A0A" : "transparent",
                  borderLeft: active ? "2px solid #D6E264" : "2px solid transparent",
                  color: active ? "#D6E264" : "#888",
                }}
              >
                <span className="text-[14px]">{icon}</span>
                <span className="font-ibm-mono text-[11px] tracking-[1px]">{label.toUpperCase()}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="px-3 py-4 border-t border-[#1D1D1D]">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-[#555] hover:text-[#AAAAAA] transition-colors cursor-pointer bg-transparent border-none"
          >
            <span className="text-[14px]">→</span>
            <span className="font-ibm-mono text-[11px] tracking-[1px]">SIGN OUT</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-[240px] min-h-screen">
        {children}
      </main>
    </div>
  );
}
