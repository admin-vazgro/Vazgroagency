"use client";

import { useState } from "react";

type Lead = {
  id: string;
  company: string;
  contact: string;
  email: string;
  pillar: "LAUNCH" | "GROW" | "BUILD";
  stage: string;
  value: number;
  partner: string;
  slaHours: number;
  slaDue: string;
  createdAt: string;
};

const leads: Lead[] = [
  { id: "LD-034", company: "Brightly Studio", contact: "Emma Rhodes", email: "emma@brightly.io", pillar: "LAUNCH", stage: "Qualified", value: 1500, partner: "Direct", slaHours: 46, slaDue: "12 Apr", createdAt: "08 Apr 2026" },
  { id: "LD-033", company: "UrbanNest", contact: "Mark Liu", email: "mark@urbannest.co", pillar: "GROW", stage: "Proposal Sent", value: 699, partner: "James H.", slaHours: 12, slaDue: "11 Apr", createdAt: "05 Apr 2026" },
  { id: "LD-032", company: "Flux Payments", contact: "Priya Sharma", email: "priya@fluxpay.com", pillar: "BUILD", stage: "Discovery", value: 8500, partner: "Sara M.", slaHours: 30, slaDue: "13 Apr", createdAt: "02 Apr 2026" },
  { id: "LD-031", company: "Greenfield Farms", contact: "Tom Hardy", email: "tom@greenfield.ag", pillar: "LAUNCH", stage: "New", value: 999, partner: "Direct", slaHours: 72, slaDue: "14 Apr", createdAt: "01 Apr 2026" },
  { id: "LD-030", company: "Nova Analytics", contact: "Sophie Chen", email: "sophie@nova.ai", pillar: "BUILD", stage: "Negotiation", value: 15000, partner: "James H.", slaHours: 6, slaDue: "10 Apr", createdAt: "30 Mar 2026" },
  { id: "LD-029", company: "Pixel & Co", contact: "Dan Walsh", email: "dan@pixelco.com", pillar: "LAUNCH", stage: "Closed Won", value: 2499, partner: "Sara M.", slaHours: 0, slaDue: "—", createdAt: "25 Mar 2026" },
];

const stages = ["All", "New", "Qualified", "Discovery", "Proposal Sent", "Negotiation", "Closed Won", "Closed Lost"];
const pillars = ["All", "LAUNCH", "GROW", "BUILD"];
const pillarColors: Record<string, string> = { LAUNCH: "#D6E264", GROW: "#FF6B35", BUILD: "#888" };

export default function LeadsPage() {
  const [stageFilter, setStageFilter] = useState("All");
  const [pillarFilter, setPillarFilter] = useState("All");
  const [showNew, setShowNew] = useState(false);

  const filtered = leads.filter((l) => {
    const stageOk = stageFilter === "All" || l.stage === stageFilter;
    const pillarOk = pillarFilter === "All" || l.pillar === pillarFilter;
    return stageOk && pillarOk;
  });

  return (
    <div className="p-8">
      <div className="mb-8 border-b border-[#1D1D1D] pb-6 flex items-end justify-between">
        <div>
          <span className="font-ibm-mono text-[10px] text-[#D6E264] tracking-[3px]">// LEADS</span>
          <h1 className="font-grotesk text-[32px] font-bold text-[#F5F5F0] tracking-[-1px] mt-1">Lead Pipeline</h1>
          <p className="font-ibm-mono text-[12px] text-[#888] tracking-[0.5px] mt-1">{leads.length} leads · {leads.filter(l => l.stage !== "Closed Won" && l.stage !== "Closed Lost").length} active</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="px-5 py-2.5 bg-[#D6E264] hover:bg-[#c9d64f] font-ibm-mono text-[10px] text-[#0A0A0A] tracking-[2px] transition-colors cursor-pointer border-none"
        >
          + ADD LEAD
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex border border-[#1D1D1D] flex-wrap">
          {stages.map((s) => (
            <button
              key={s}
              onClick={() => setStageFilter(s)}
              className="px-3 py-2 font-ibm-mono text-[9px] tracking-[1px] transition-colors cursor-pointer border-none border-r border-[#1D1D1D] last:border-r-0"
              style={{ background: stageFilter === s ? "#D6E264" : "#111", color: stageFilter === s ? "#0A0A0A" : "#666" }}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex border border-[#1D1D1D]">
          {pillars.map((p) => (
            <button
              key={p}
              onClick={() => setPillarFilter(p)}
              className="px-3 py-2 font-ibm-mono text-[9px] tracking-[1px] transition-colors cursor-pointer border-none border-r border-[#1D1D1D] last:border-r-0"
              style={{ background: pillarFilter === p ? "#1A1A0A" : "#111", color: pillarFilter === p ? "#D6E264" : "#666" }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="border border-[#1D1D1D] bg-[#0F0F0F]">
        <div className="grid grid-cols-[80px_1fr_140px_80px_80px_120px_80px_80px] gap-4 px-5 py-3 border-b border-[#1D1D1D]">
          {["ID", "Company / Contact", "Email", "Pillar", "Value", "Stage", "Partner", "SLA"].map((h) => (
            <span key={h} className="font-ibm-mono text-[9px] text-[#555] tracking-[2px]">{h}</span>
          ))}
        </div>
        {filtered.map((lead) => {
          const slaOk = lead.slaHours > 24;
          const slaWarn = lead.slaHours > 0 && lead.slaHours <= 24;
          const slaDone = lead.slaHours === 0;
          return (
            <div key={lead.id} className="grid grid-cols-[80px_1fr_140px_80px_80px_120px_80px_80px] gap-4 px-5 py-4 border-b border-[#1D1D1D] hover:bg-[#111] transition-colors items-center">
              <span className="font-ibm-mono text-[10px] text-[#777]">{lead.id}</span>
              <div>
                <p className="font-ibm-mono text-[11px] text-[#CCCCCC] font-bold">{lead.company}</p>
                <p className="font-ibm-mono text-[10px] text-[#555] mt-0.5">{lead.contact}</p>
              </div>
              <span className="font-ibm-mono text-[10px] text-[#666]">{lead.email}</span>
              <span className="font-ibm-mono text-[10px]" style={{ color: pillarColors[lead.pillar] }}>{lead.pillar}</span>
              <span className="font-ibm-mono text-[11px] text-[#CCCCCC]">£{lead.value.toLocaleString()}</span>
              <span className="font-ibm-mono text-[10px] text-[#888]">{lead.stage}</span>
              <span className="font-ibm-mono text-[10px] text-[#777]">{lead.partner}</span>
              <span
                className="font-ibm-mono text-[9px]"
                style={{ color: slaDone ? "#555" : slaWarn ? "#FF6B35" : "#D6E264" }}
              >
                {slaDone ? "—" : `${lead.slaHours}h`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
