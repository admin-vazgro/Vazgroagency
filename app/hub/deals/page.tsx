"use client";

import { useState } from "react";

const deals = [
  { id: "DL-018", company: "UrbanNest", pillar: "GROW", package: "Social Pro — £699/mo", value: 8388, stage: "Proposal Signed", probability: 90, assignee: "Rohith M.", closeDate: "15 Apr 2026", partner: "James H." },
  { id: "DL-017", company: "Nova Analytics", pillar: "BUILD", package: "Custom Build — £15,000", value: 15000, stage: "Negotiation", probability: 70, assignee: "Rohith M.", closeDate: "20 Apr 2026", partner: "James H." },
  { id: "DL-016", company: "Brightly Studio", pillar: "LAUNCH", package: "Full Brand — £1,499", value: 1499, stage: "Discovery", probability: 50, assignee: "Priya K.", closeDate: "30 Apr 2026", partner: "Direct" },
  { id: "DL-015", company: "Flux Payments", pillar: "BUILD", package: "MVP Build — £8,500", value: 8500, stage: "Discovery", probability: 40, assignee: "Rohith M.", closeDate: "05 May 2026", partner: "Sara M." },
  { id: "DL-014", company: "Pixel & Co", pillar: "LAUNCH", package: "Brand + Web — £2,499", value: 2499, stage: "Closed Won", probability: 100, assignee: "Priya K.", closeDate: "25 Mar 2026", partner: "Sara M." },
  { id: "DL-013", company: "Solarise Energy", pillar: "GROW", package: "Content Base — £349/mo", value: 4188, stage: "Closed Lost", probability: 0, assignee: "Aisha B.", closeDate: "20 Mar 2026", partner: "Direct" },
];

const stageOrder = ["Discovery", "Proposal Sent", "Proposal Signed", "Negotiation", "Closed Won", "Closed Lost"];
const pillarColors: Record<string, string> = { LAUNCH: "#D6E264", GROW: "#FF6B35", BUILD: "#888" };

export default function DealsPage() {
  const [pillarFilter, setPillarFilter] = useState("All");

  const filtered = deals.filter((d) => pillarFilter === "All" || d.pillar === pillarFilter);
  const pipelineValue = deals.filter((d) => d.stage !== "Closed Won" && d.stage !== "Closed Lost").reduce((s, d) => s + d.value, 0);
  const wonValue = deals.filter((d) => d.stage === "Closed Won").reduce((s, d) => s + d.value, 0);

  return (
    <div className="p-8">
      <div className="mb-8 border-b border-[#1D1D1D] pb-6">
        <span className="font-ibm-mono text-[10px] text-[#D6E264] tracking-[3px]">// DEALS</span>
        <h1 className="font-grotesk text-[32px] font-bold text-[#F5F5F0] tracking-[-1px] mt-1">Deal Tracker</h1>
        <p className="font-ibm-mono text-[12px] text-[#888] tracking-[0.5px] mt-1">{deals.length} deals total</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="border border-[#1D1D1D] bg-[#0F0F0F] p-5">
          <p className="font-ibm-mono text-[10px] text-[#666] tracking-[1px] mb-2">PIPELINE VALUE</p>
          <p className="font-grotesk text-[28px] font-bold text-[#D6E264]">£{pipelineValue.toLocaleString()}</p>
        </div>
        <div className="border border-[#1D1D1D] bg-[#0F0F0F] p-5">
          <p className="font-ibm-mono text-[10px] text-[#666] tracking-[1px] mb-2">WON THIS MONTH</p>
          <p className="font-grotesk text-[28px] font-bold text-[#D6E264]">£{wonValue.toLocaleString()}</p>
        </div>
        <div className="border border-[#1D1D1D] bg-[#0F0F0F] p-5">
          <p className="font-ibm-mono text-[10px] text-[#666] tracking-[1px] mb-2">OPEN DEALS</p>
          <p className="font-grotesk text-[28px] font-bold text-[#F5F5F0]">{deals.filter(d => d.stage !== "Closed Won" && d.stage !== "Closed Lost").length}</p>
        </div>
      </div>

      {/* Pillar filter */}
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

      {/* Table */}
      <div className="border border-[#1D1D1D] bg-[#0F0F0F]">
        <div className="grid grid-cols-[80px_1fr_80px_180px_100px_100px_100px_60px] gap-4 px-5 py-3 border-b border-[#1D1D1D]">
          {["ID", "Company", "Pillar", "Package", "Value", "Stage", "Close Date", "Prob."].map((h) => (
            <span key={h} className="font-ibm-mono text-[9px] text-[#555] tracking-[2px]">{h}</span>
          ))}
        </div>
        {filtered.map((deal) => {
          const won = deal.stage === "Closed Won";
          const lost = deal.stage === "Closed Lost";
          return (
            <div key={deal.id} className="grid grid-cols-[80px_1fr_80px_180px_100px_100px_100px_60px] gap-4 px-5 py-4 border-b border-[#1D1D1D] hover:bg-[#111] transition-colors items-center"
              style={{ opacity: lost ? 0.5 : 1 }}
            >
              <span className="font-ibm-mono text-[10px] text-[#777]">{deal.id}</span>
              <div>
                <p className="font-ibm-mono text-[11px] text-[#CCCCCC] font-bold">{deal.company}</p>
                <p className="font-ibm-mono text-[10px] text-[#555] mt-0.5">{deal.partner !== "Direct" ? `via ${deal.partner}` : "Direct"}</p>
              </div>
              <span className="font-ibm-mono text-[10px]" style={{ color: pillarColors[deal.pillar] }}>{deal.pillar}</span>
              <span className="font-ibm-mono text-[10px] text-[#888]">{deal.package}</span>
              <span className="font-ibm-mono text-[11px] text-[#CCCCCC]">£{deal.value.toLocaleString()}</span>
              <span
                className="font-ibm-mono text-[10px]"
                style={{ color: won ? "#D6E264" : lost ? "#555" : "#888" }}
              >
                {deal.stage}
              </span>
              <span className="font-ibm-mono text-[10px] text-[#666]">{deal.closeDate}</span>
              <span
                className="font-ibm-mono text-[10px]"
                style={{ color: deal.probability >= 70 ? "#D6E264" : deal.probability >= 40 ? "#FF6B35" : "#555" }}
              >
                {deal.probability}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
