"use client";

import PortalLayoutShell from "@/components/PortalLayoutShell";

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
  return (
    <PortalLayoutShell nav={nav} portalLabel="INTERNAL HUB" sidebarWidthClass="w-[220px]" sidebarOffsetClass="ml-[220px]">
      {children}
    </PortalLayoutShell>
  );
}
