"use client";

import PortalLayoutShell, { type NavGroup } from "@/components/PortalLayoutShell";

const IconDashboard = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="1" width="5" height="5" />
    <rect x="8" y="1" width="5" height="5" />
    <rect x="1" y="8" width="5" height="5" />
    <rect x="8" y="8" width="5" height="5" />
  </svg>
);

const IconProjects = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="7,1 13,4.5 7,8 1,4.5" />
    <polyline points="1,7 7,10.5 13,7" />
    <polyline points="1,10 7,13.5 13,10" />
  </svg>
);

const IconRequests = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="1" width="12" height="3" rx="1" />
    <rect x="1" y="6" width="8" height="2" rx="1" />
    <rect x="1" y="10" width="10" height="2" rx="1" />
  </svg>
);

const IconBrandHub = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7" cy="7" r="3" />
    <circle cx="7" cy="7" r="6" />
    <line x1="7" y1="1" x2="7" y2="4" />
    <line x1="7" y1="10" x2="7" y2="13" />
    <line x1="1" y1="7" x2="4" y2="7" />
    <line x1="10" y1="7" x2="13" y2="7" />
  </svg>
);

const IconBilling = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="12" height="9" rx="1" />
    <line x1="1" y1="7" x2="13" y2="7" />
    <line x1="4" y1="10.5" x2="7" y2="10.5" />
  </svg>
);

const IconTeam = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5" cy="4" r="2.5" />
    <path d="M1 13c0-2.2 1.8-4 4-4s4 1.8 4 4" />
    <circle cx="11" cy="4.5" r="2" />
    <path d="M9.5 13c0-1.7 1.2-3 2.5-3" />
  </svg>
);

const IconSettings = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="7" cy="7" r="2.5" />
    <path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M3.1 3.1l1.1 1.1M9.8 9.8l1.1 1.1M10.9 3.1l-1.1 1.1M4.2 9.8l-1.1 1.1" />
  </svg>
);

const navGroups: NavGroup[] = [
  {
    label: "OVERVIEW",
    items: [
      { label: "Dashboard", href: "/workspace", icon: IconDashboard },
    ],
  },
  {
    label: "WORK",
    items: [
      { label: "Projects", href: "/workspace/engagements", icon: IconProjects },
      { label: "Requests", href: "/workspace/requests", icon: IconRequests },
      { label: "Brand Hub", href: "/workspace/files", icon: IconBrandHub },
    ],
  },
  {
    label: "ACCOUNT",
    items: [
      { label: "Services & Billing", href: "/workspace/billing", icon: IconBilling },
      { label: "Team", href: "/workspace/team", icon: IconTeam },
      { label: "Settings", href: "/workspace/settings", icon: IconSettings },
    ],
  },
];

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalLayoutShell
      navGroups={navGroups}
      portalLabel="CLIENT WORKSPACE"
      sidebarWidthClass="w-[240px]"
      sidebarOffsetClass="ml-[240px]"
    >
      {children}
    </PortalLayoutShell>
  );
}
