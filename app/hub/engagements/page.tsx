"use client";

import { useState } from "react";

const engagements = [
  { id: "ENG-011", client: "Acme Corp", pillar: "LAUNCH", package: "Brand & Website", status: "In Progress", progress: 65, lead: "Rohith M.", startDate: "10 Mar 2026", endDate: "10 May 2026" },
  { id: "ENG-010", client: "Acme Corp", pillar: "GROW", package: "Social Pro", status: "Active", progress: 40, lead: "Aisha B.", startDate: "01 Mar 2026", endDate: "28 Feb 2027" },
  { id: "ENG-009", client: "Pixel & Co", pillar: "LAUNCH", package: "Brand Identity", status: "In Review", progress: 90, lead: "Priya K.", startDate: "15 Feb 2026", endDate: "15 Apr 2026" },
  { id: "ENG-008", client: "UrbanNest", pillar: "GROW", package: "Content Base", status: "Active", progress: 55, lead: "Aisha B.", startDate: "01 Feb 2026", endDate: "31 Jan 2027" },
  { id: "ENG-007", client: "Nova Analytics", pillar: "BUILD", package: "MVP Build", status: "Scoping", progress: 10, lead: "Rohith M.", startDate: "01 Apr 2026", endDate: "01 Sep 2026" },
  { id: "ENG-006", client: "Flux Payments", pillar: "BUILD", package: "API Integration", status: "Completed", progress: 100, lead: "Rohith M.", startDate: "01 Jan 2026", endDate: "28 Mar 2026" },
];

const pillarColors: Record<string, string> = { LAUNCH: "#D6E264", GROW: "#FF6B35", BUILD: "#888" };
const statusColors: Record<string, { bg: string; text: string }> = {
  "In Progress": { bg: "#D6E26420", text: "#D6E264" },
  Active: { bg: "#D6E26420", text: "#D6E264" },
  "In Review": { bg: "#FF6B3520", text: "#FF6B35" },
  Scoping: { bg: "#FFFFFF10", text: "#888" },
  Completed: { bg: "#FFFFFF10", text: "#555" },
};

export default function HubEngagementsPage() {
  const [pillarFilter, setPillarFilter] = useState("All");

  const filtered = engagements.filter((e) => pillarFilter === "All" || e.pillar === pillarFilter);

  return (
    <div className="p-8">
      <div className="mb-8 border-b border-[#1D1D1D] pb-6 flex items-end justify-between">
        <div>
          <span className="font-ibm-mono text-[10px] text-[#D6E264] tracking-[3px]">// ENGAGEMENTS</span>
          <h1 className="font-grotesk text-[32px] font-bold text-[#F5F5F0] tracking-[-1px] mt-1">All Engagements</h1>
          <p className="font-ibm-mono text-[12px] text-[#888] tracking-[0.5px] mt-1">{engagements.filter(e => e.status !== "Completed").length} active · {engagements.filter(e => e.status === "Completed").length} completed</p>
        </div>
        <button className="px-5 py-2.5 bg-[#D6E264] hover:bg-[#c9d64f] font-ibm-mono text-[10px] text-[#0A0A0A] tracking-[2px] transition-colors cursor-pointer border-none">
          + NEW ENGAGEMENT
        </button>
      </div>

      <div className="flex border border-[#1D1D1D] w-fit mb-6">
        {["All", "LAUNCH", "GROW", "BUILD"].map((p) => (
          <button
            key={p}
            onClick={() => setPillarFilter(p)}
            className="px-4 py-2 font-ibm-mono text-[10px] tracking-[1px] transition-colors cursor-pointer border-none border-r border-[#1D1D1D] last:border-r-0"
            style={{ background: pillarFilter === p ? "#1A1A0A" : "#111", color: pillarFilter === p ? "#D6E264" : "#666" }}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((eng) => {
          const sc = statusColors[eng.status] ?? { bg: "#FFFFFF10", text: "#888" };
          return (
            <div key={eng.id} className="border border-[#1D1D1D] bg-[#0F0F0F] p-5 hover:border-[#2D2D2D] transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="font-ibm-mono text-[9px] tracking-[2px] px-2 py-1" style={{ background: pillarColors[eng.pillar] + "20", color: pillarColors[eng.pillar] }}>{eng.pillar}</span>
                  <span className="font-ibm-mono text-[10px] text-[#555]">{eng.id}</span>
                </div>
                <span className="font-ibm-mono text-[9px] tracking-[1px] px-2 py-1" style={{ background: sc.bg, color: sc.text }}>{eng.status.toUpperCase()}</span>
              </div>
              <div className="grid grid-cols-[1fr_1fr_1fr_140px] gap-4 items-center">
                <div>
                  <p className="font-grotesk text-[15px] font-bold text-[#F5F5F0]">{eng.client}</p>
                  <p className="font-ibm-mono text-[10px] text-[#777] mt-0.5">{eng.package}</p>
                </div>
                <div>
                  <p className="font-ibm-mono text-[10px] text-[#555] tracking-[1px]">LEAD</p>
                  <p className="font-ibm-mono text-[11px] text-[#AAAAAA] mt-0.5">{eng.lead}</p>
                </div>
                <div>
                  <p className="font-ibm-mono text-[10px] text-[#555] tracking-[1px]">TIMELINE</p>
                  <p className="font-ibm-mono text-[10px] text-[#AAAAAA] mt-0.5">{eng.startDate} → {eng.endDate}</p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-ibm-mono text-[10px] text-[#555]">PROGRESS</span>
                    <span className="font-ibm-mono text-[10px]" style={{ color: pillarColors[eng.pillar] }}>{eng.progress}%</span>
                  </div>
                  <div className="w-full bg-[#1D1D1D] h-1.5">
                    <div className="h-1.5" style={{ width: `${eng.progress}%`, background: pillarColors[eng.pillar] }} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
