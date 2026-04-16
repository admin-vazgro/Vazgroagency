"use client";

import PortalLayoutShell, { type NavGroup } from "@/components/PortalLayoutShell";

/* ── Inline SVG icons ── */

const IconDashboard = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="1" width="5" height="5" />
    <rect x="8" y="1" width="5" height="5" />
    <rect x="1" y="8" width="5" height="5" />
    <rect x="8" y="8" width="5" height="5" />
  </svg>
);

const IconInbox = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="12" height="9" rx="1" />
    <polyline points="1,3 7,8 13,3" />
  </svg>
);

const IconLeads = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 2h10l-3.5 5v5H5.5V7L2 2z" />
  </svg>
);

const IconDeals = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 8l5-7 5 7" />
    <path d="M4 13h6" />
    <path d="M7 8v5" />
  </svg>
);

const IconAccounts = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="10" height="9" />
    <path d="M2 4V2h10v2" />
    <rect x="5" y="8" width="2" height="5" />
    <rect x="9" y="6" width="1.5" height="2" />
    <rect x="3.5" y="6" width="1.5" height="2" />
  </svg>
);

const IconEngagements = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="7,1 13,4.5 7,8 1,4.5" />
    <polyline points="1,7 7,10.5 13,7" />
    <polyline points="1,10 7,13.5 13,10" />
  </svg>
);

const IconPartners = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5" cy="4" r="2.5" />
    <path d="M1 13c0-2.2 1.8-4 4-4s4 1.8 4 4" />
    <circle cx="11" cy="4.5" r="2" />
    <path d="M9.5 13c0-1.7 1.2-3 2.5-3" />
  </svg>
);

const IconCommissions = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="11" y1="3" x2="3" y2="11" />
    <circle cx="4" cy="4" r="1.5" />
    <circle cx="10" cy="10" r="1.5" />
  </svg>
);

const IconRequests = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="1" width="10" height="12" rx="1" />
    <line x1="5" y1="5" x2="9" y2="5" />
    <line x1="5" y1="8" x2="9" y2="8" />
    <line x1="5" y1="11" x2="7" y2="11" />
  </svg>
);

const navGroups: NavGroup[] = [
  {
    label: "INSIGHTS",
    items: [
      { label: "Dashboard", href: "/hub", icon: IconDashboard },
    ],
  },
  {
    label: "SALES",
    items: [
      { label: "Inbox", href: "/hub/inbox", icon: IconInbox },
      { label: "Leads", href: "/hub/leads", icon: IconLeads },
      { label: "Deals", href: "/hub/deals", icon: IconDeals },
    ],
  },
  {
    label: "DELIVERY",
    items: [
      { label: "Accounts", href: "/hub/accounts", icon: IconAccounts },
      { label: "Engagements", href: "/hub/engagements", icon: IconEngagements },
      { label: "Projects", href: "/hub/projects", icon: IconEngagements },
      { label: "Requests", href: "/hub/requests", icon: IconRequests },
    ],
  },
  {
    label: "GROWTH",
    items: [
      { label: "Partners", href: "/hub/partners", icon: IconPartners },
      { label: "Commissions", href: "/hub/commissions", icon: IconCommissions },
    ],
  },
];

export default function HubLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalLayoutShell
      navGroups={navGroups}
      portalLabel="INTERNAL HUB"
      sidebarWidthClass="w-[220px]"
      sidebarOffsetClass="ml-[220px]"
      adminHref="/hub/admin"
      libraryHref="/hub/library"
    >
      {children}
    </PortalLayoutShell>
  );
}
