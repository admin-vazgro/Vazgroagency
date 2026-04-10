"use client";

import PortalLayoutShell from "@/components/PortalLayoutShell";

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
  return (
    <PortalLayoutShell nav={nav} portalLabel="CLIENT WORKSPACE" sidebarWidthClass="w-[240px]" sidebarOffsetClass="ml-[240px]">
      {children}
    </PortalLayoutShell>
  );
}
