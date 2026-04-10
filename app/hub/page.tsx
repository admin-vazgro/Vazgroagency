"use client";

import Link from "next/link";

const stats = [
  { label: "Active Leads", value: "14", delta: "+3 this week", color: "#D6E264" },
  { label: "Open Deals", value: "7", delta: "£42,300 pipeline", color: "#D6E264" },
  { label: "Active Engagements", value: "11", delta: "3 LAUNCH · 5 GROW · 3 BUILD", color: "#D6E264" },
  { label: "Commissions Pending", value: "£3,120", delta: "4 awaiting approval", color: "#FF6B35" },
  { label: "Unread Messages", value: "8", delta: "3 from clients", color: "#FF6B35" },
  { label: "SLA Breaches", value: "0", delta: "All within SLA", color: "#D6E264" },
];

const recentLeads = [
  { id: "LD-034", company: "Brightly Studio", pillar: "LAUNCH", stage: "Qualified", partner: "Direct", days: 2 },
  { id: "LD-033", company: "UrbanNest", pillar: "GROW", stage: "Proposal Sent", partner: "James H.", days: 5 },
  { id: "LD-032", company: "Flux Payments", pillar: "BUILD", stage: "Discovery", partner: "Sara M.", days: 8 },
  { id: "LD-031", company: "Greenfield Farms", pillar: "LAUNCH", stage: "New", partner: "Direct", days: 11 },
];

const recentActivity = [
  { text: "Brightly Studio moved to Qualified", time: "2h ago", type: "lead" },
  { text: "INV-2026-004 sent to Acme Corp", time: "4h ago", type: "invoice" },
  { text: "Sara M. submitted commission claim", time: "6h ago", type: "commission" },
  { text: "UrbanNest proposal signed", time: "1d ago", type: "deal" },
  { text: "Flux Payments engagement kicked off", time: "1d ago", type: "engagement" },
  { text: "New request from Acme Corp (REQ-004)", time: "2d ago", type: "request" },
];

const pillarColors: Record<string, string> = { LAUNCH: "#D6E264", GROW: "#FF6B35", BUILD: "#888" };

export default function HubDashboard() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 border-b border-[#1D1D1D] pb-6">
        <span className="font-ibm-mono text-[10px] text-[#D6E264] tracking-[3px]">// INTERNAL HUB</span>
        <h1 className="font-grotesk text-[32px] font-bold text-[#F5F5F0] tracking-[-1px] mt-1">Command Centre</h1>
        <p className="font-ibm-mono text-[12px] text-[#888] tracking-[0.5px] mt-1">Thursday, 10 April 2026</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, delta, color }) => (
          <div key={label} className="border border-[#1D1D1D] bg-[#0F0F0F] p-5">
            <p className="font-ibm-mono text-[10px] text-[#666] tracking-[1px] mb-2">{label.toUpperCase()}</p>
            <p className="font-grotesk text-[28px] font-bold" style={{ color }}>{value}</p>
            <p className="font-ibm-mono text-[10px] text-[#555] mt-1">{delta}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-6">
        {/* Left — recent leads */}
        <div>
          <div className="border border-[#1D1D1D] bg-[#0F0F0F] mb-6">
            <div className="px-6 py-4 border-b border-[#1D1D1D] flex items-center justify-between">
              <span className="font-ibm-mono text-[10px] text-[#AAAAAA] tracking-[2px]">RECENT LEADS</span>
              <Link href="/hub/leads" className="font-ibm-mono text-[10px] text-[#D6E264] tracking-[1px] hover:opacity-80">VIEW ALL →</Link>
            </div>
            <div>
              <div className="grid grid-cols-[80px_1fr_80px_120px_100px_60px] gap-4 px-5 py-3 border-b border-[#1D1D1D]">
                {["ID", "Company", "Pillar", "Stage", "Partner", "Days"].map((h) => (
                  <span key={h} className="font-ibm-mono text-[9px] text-[#555] tracking-[2px]">{h}</span>
                ))}
              </div>
              {recentLeads.map((lead) => (
                <Link key={lead.id} href={`/hub/leads/${lead.id}`} className="grid grid-cols-[80px_1fr_80px_120px_100px_60px] gap-4 px-5 py-3.5 border-b border-[#1D1D1D] hover:bg-[#111] transition-colors">
                  <span className="font-ibm-mono text-[10px] text-[#777]">{lead.id}</span>
                  <span className="font-ibm-mono text-[11px] text-[#CCCCCC] font-bold">{lead.company}</span>
                  <span className="font-ibm-mono text-[10px]" style={{ color: pillarColors[lead.pillar] }}>{lead.pillar}</span>
                  <span className="font-ibm-mono text-[10px] text-[#888]">{lead.stage}</span>
                  <span className="font-ibm-mono text-[10px] text-[#777]">{lead.partner}</span>
                  <span className="font-ibm-mono text-[10px] text-[#555]">{lead.days}d</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "New Lead", href: "/hub/leads", desc: "Add to pipeline" },
              { label: "New Engagement", href: "/hub/engagements", desc: "Kick off a project" },
              { label: "New Invoice", href: "/hub/accounts", desc: "Bill a client" },
            ].map(({ label, href, desc }) => (
              <Link key={label} href={href} className="border border-[#1D1D1D] bg-[#0F0F0F] p-4 hover:border-[#D6E264] transition-colors group">
                <p className="font-ibm-mono text-[11px] text-[#CCCCCC] group-hover:text-[#D6E264] transition-colors">+ {label}</p>
                <p className="font-ibm-mono text-[10px] text-[#555] mt-1">{desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Right — activity feed */}
        <div className="border border-[#1D1D1D] bg-[#0F0F0F]">
          <div className="px-5 py-4 border-b border-[#1D1D1D]">
            <span className="font-ibm-mono text-[10px] text-[#AAAAAA] tracking-[2px]">RECENT ACTIVITY</span>
          </div>
          <div className="divide-y divide-[#1D1D1D]">
            {recentActivity.map((a, i) => (
              <div key={i} className="px-5 py-3.5">
                <p className="font-ibm-mono text-[11px] text-[#CCCCCC] leading-[1.5]">{a.text}</p>
                <p className="font-ibm-mono text-[10px] text-[#444] mt-1">{a.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
