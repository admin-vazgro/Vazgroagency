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

const IconLeads = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7" cy="5" r="3" />
    <path d="M1 13c0-3.3 2.7-6 6-6s6 2.7 6 6" />
  </svg>
);

const IconDeals = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 7h10M7 2l5 5-5 5" />
  </svg>
);

const IconCommissions = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="4.5" cy="4.5" r="2" />
    <circle cx="9.5" cy="9.5" r="2" />
    <line x1="2" y1="12" x2="12" y2="2" />
  </svg>
);

const IconLibrary = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 2h3v10H2zM6 2h3v10H6zM10 2h3v10h-3z" />
  </svg>
);

const IconOnboarding = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7" cy="7" r="6" />
    <path d="M7 4v3l2 2" />
  </svg>
);

const navGroups: NavGroup[] = [
  {
    label: "HOME",
    items: [
      { label: "Dashboard", href: "/partners", icon: IconDashboard },
    ],
  },
  {
    label: "PIPELINE",
    items: [
      { label: "My Leads", href: "/partners/leads", icon: IconLeads },
      { label: "My Deals", href: "/partners/deals", icon: IconDeals },
    ],
  },
  {
    label: "EARNINGS",
    items: [
      { label: "Commissions", href: "/partners/commissions", icon: IconCommissions },
    ],
  },
  {
    label: "RESOURCES",
    items: [
      { label: "Sales Library", href: "/partners/library", icon: IconLibrary },
    ],
  },
  {
    label: "ACCOUNT",
    items: [
      { label: "Onboarding", href: "/partners/onboarding", icon: IconOnboarding },
    ],
  },
];

export default function PartnersLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalLayoutShell
      navGroups={navGroups}
      portalLabel="PARTNER PORTAL"
      sidebarWidthClass="w-[240px]"
      sidebarOffsetClass="ml-[240px]"
    >
      {children}
    </PortalLayoutShell>
  );
}
