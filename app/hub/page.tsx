"use client";

import Link from "next/link";

const stats = [
  { label: "Active Leads", value: "0", delta: "No live lead data yet", color: "var(--portal-accent)" },
  { label: "Open Deals", value: "0", delta: "No live deal data yet", color: "var(--portal-accent)" },
  { label: "Active Engagements", value: "0", delta: "No live engagement data yet", color: "var(--portal-accent)" },
  { label: "Commissions Pending", value: "£0", delta: "No pending commissions", color: "var(--portal-warning)" },
  { label: "Unread Messages", value: "0", delta: "No unread messages", color: "var(--portal-warning)" },
  { label: "SLA Breaches", value: "0", delta: "No SLA activity yet", color: "var(--portal-accent)" },
];

const recentLeads: Array<{ id: string; company: string; pillar: string; stage: string; partner: string; days: number }> = [];
const recentActivity: Array<{ text: string; time: string; type: string }> = [];

const pillarColors: Record<string, string> = { LAUNCH: "var(--portal-accent)", GROW: "var(--portal-warning)", BUILD: "var(--portal-text-soft)" };

export default function HubDashboard() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 border-b border-[var(--portal-border)] pb-6">
        <span className="font-ibm-mono text-[10px] text-[var(--portal-accent)] tracking-[3px]">// INTERNAL HUB</span>
        <h1 className="font-grotesk text-[32px] font-bold text-[var(--portal-text)] tracking-[-1px] mt-1">Command Centre</h1>
        <p className="font-ibm-mono text-[12px] text-[var(--portal-text-soft)] tracking-[0.5px] mt-1">Thursday, 10 April 2026</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, delta, color }) => (
          <div key={label} className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
            <p className="font-ibm-mono text-[10px] text-[var(--portal-text-muted)] tracking-[1px] mb-2">{label.toUpperCase()}</p>
            <p className="font-grotesk text-[28px] font-bold" style={{ color }}>{value}</p>
            <p className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)] mt-1">{delta}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-6">
        {/* Left — recent leads */}
        <div>
          <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] mb-6">
            <div className="px-6 py-4 border-b border-[var(--portal-border)] flex items-center justify-between">
              <span className="font-ibm-mono text-[10px] text-[var(--portal-text)] tracking-[2px]">RECENT LEADS</span>
              <Link href="/hub/leads" className="font-ibm-mono text-[10px] text-[var(--portal-accent)] tracking-[1px] hover:opacity-80">VIEW ALL →</Link>
            </div>
            <div>
              <div className="grid grid-cols-[80px_1fr_80px_120px_100px_60px] gap-4 px-5 py-3 border-b border-[var(--portal-border)]">
                {["ID", "Company", "Pillar", "Stage", "Partner", "Days"].map((h) => (
                  <span key={h} className="font-ibm-mono text-[9px] text-[var(--portal-text-dim)] tracking-[2px]">{h}</span>
                ))}
              </div>
              {recentLeads.length ? recentLeads.map((lead) => (
                <Link key={lead.id} href={`/hub/leads?lead=${lead.id}`} className="grid grid-cols-[80px_1fr_80px_120px_100px_60px] gap-4 px-5 py-3.5 border-b border-[var(--portal-border)] hover:bg-[var(--portal-surface-alt)] transition-colors">
                  <span className="font-ibm-mono text-[10px] text-[var(--portal-text-soft)]">{lead.id}</span>
                  <span className="font-ibm-mono text-[11px] text-[var(--portal-text-muted)] font-bold">{lead.company}</span>
                  <span className="font-ibm-mono text-[10px]" style={{ color: pillarColors[lead.pillar] }}>{lead.pillar}</span>
                  <span className="font-ibm-mono text-[10px] text-[var(--portal-text-soft)]">{lead.stage}</span>
                  <span className="font-ibm-mono text-[10px] text-[var(--portal-text-soft)]">{lead.partner}</span>
                  <span className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">{lead.days}d</span>
                </Link>
              )) : (
                <div className="px-5 py-12">
                  <p className="font-ibm-mono text-[11px] text-[var(--portal-text-soft)]">No lead data yet.</p>
                  <p className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)] mt-2">Leads will appear here once they exist in the system.</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "New Lead", href: "/hub/leads", desc: "Add to pipeline" },
              { label: "New Engagement", href: "/hub/engagements", desc: "Kick off a project" },
              { label: "New Invoice", href: "/hub/accounts", desc: "Bill a client" },
            ].map(({ label, href, desc }) => (
              <Link key={label} href={href} className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-4 hover:border-[var(--portal-accent)] transition-colors group">
                <p className="font-ibm-mono text-[11px] text-[var(--portal-text-muted)] group-hover:text-[var(--portal-accent)] transition-colors">+ {label}</p>
                <p className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)] mt-1">{desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Right — activity feed */}
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
          <div className="px-5 py-4 border-b border-[var(--portal-border)]">
            <span className="font-ibm-mono text-[10px] text-[var(--portal-text)] tracking-[2px]">RECENT ACTIVITY</span>
          </div>
          <div className="divide-y divide-[var(--portal-border)]">
            {recentActivity.length ? recentActivity.map((a, i) => (
              <div key={i} className="px-5 py-3.5">
                <p className="font-ibm-mono text-[11px] text-[var(--portal-text-muted)] leading-[1.5]">{a.text}</p>
                <p className="font-ibm-mono text-[10px] text-[var(--portal-text-faint)] mt-1">{a.time}</p>
              </div>
            )) : (
              <div className="px-5 py-12">
                <p className="font-ibm-mono text-[11px] text-[var(--portal-text-soft)]">No activity recorded yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
