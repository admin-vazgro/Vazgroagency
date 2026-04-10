"use client";

import { useState } from "react";

const deals: Array<{ id: string; company: string; pillar: string; package: string; value: number; stage: string; probability: number; assignee: string; closeDate: string; partner: string }> = [];

const stageOrder = ["Discovery", "Proposal Sent", "Proposal Signed", "Negotiation", "Closed Won", "Closed Lost"];
const pillarColors: Record<string, string> = { LAUNCH: "var(--portal-accent)", GROW: "var(--portal-warning)", BUILD: "var(--portal-text-soft)" };

export default function DealsPage() {
  const [pillarFilter, setPillarFilter] = useState("All");

  const filtered = deals.filter((d) => pillarFilter === "All" || d.pillar === pillarFilter);
  const pipelineValue = deals.filter((d) => d.stage !== "Closed Won" && d.stage !== "Closed Lost").reduce((s, d) => s + d.value, 0);
  const wonValue = deals.filter((d) => d.stage === "Closed Won").reduce((s, d) => s + d.value, 0);

  return (
    <div className="p-8">
      <div className="mb-8 border-b border-[var(--portal-border)] pb-6">
        <span className="font-ibm-mono text-[10px] text-[var(--portal-accent)] tracking-[3px]">// DEALS</span>
        <h1 className="font-grotesk text-[32px] font-bold text-[var(--portal-text)] tracking-[-1px] mt-1">Deal Tracker</h1>
        <p className="font-ibm-mono text-[12px] text-[var(--portal-text-soft)] tracking-[0.5px] mt-1">{deals.length} deals total</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
          <p className="font-ibm-mono text-[10px] text-[var(--portal-text-muted)] tracking-[1px] mb-2">PIPELINE VALUE</p>
          <p className="font-grotesk text-[28px] font-bold text-[var(--portal-accent)]">£{pipelineValue.toLocaleString()}</p>
        </div>
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
          <p className="font-ibm-mono text-[10px] text-[var(--portal-text-muted)] tracking-[1px] mb-2">WON THIS MONTH</p>
          <p className="font-grotesk text-[28px] font-bold text-[var(--portal-accent)]">£{wonValue.toLocaleString()}</p>
        </div>
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
          <p className="font-ibm-mono text-[10px] text-[var(--portal-text-muted)] tracking-[1px] mb-2">OPEN DEALS</p>
          <p className="font-grotesk text-[28px] font-bold text-[var(--portal-text)]">{deals.filter(d => d.stage !== "Closed Won" && d.stage !== "Closed Lost").length}</p>
        </div>
      </div>

      {/* Pillar filter */}
      <div className="flex border border-[var(--portal-border)] w-fit mb-6">
        {["All", "LAUNCH", "GROW", "BUILD"].map((p) => (
          <button
            key={p}
            onClick={() => setPillarFilter(p)}
            className="px-4 py-2 font-ibm-mono text-[10px] tracking-[1px] transition-colors cursor-pointer border-none border-r border-[var(--portal-border)] last:border-r-0"
            style={{ background: pillarFilter === p ? "var(--portal-active-bg)" : "var(--portal-surface-alt)", color: pillarFilter === p ? "var(--portal-accent)" : "var(--portal-text-muted)" }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
        <div className="grid grid-cols-[80px_1fr_80px_180px_100px_100px_100px_60px] gap-4 px-5 py-3 border-b border-[var(--portal-border)]">
          {["ID", "Company", "Pillar", "Package", "Value", "Stage", "Close Date", "Prob."].map((h) => (
            <span key={h} className="font-ibm-mono text-[9px] text-[var(--portal-text-dim)] tracking-[2px]">{h}</span>
          ))}
        </div>
        {filtered.map((deal) => {
          const won = deal.stage === "Closed Won";
          const lost = deal.stage === "Closed Lost";
          return (
            <div key={deal.id} className="grid grid-cols-[80px_1fr_80px_180px_100px_100px_100px_60px] gap-4 px-5 py-4 border-b border-[var(--portal-border)] hover:bg-[var(--portal-surface-alt)] transition-colors items-center"
              style={{ opacity: lost ? 0.5 : 1 }}
            >
              <span className="font-ibm-mono text-[10px] text-[var(--portal-text-soft)]">{deal.id}</span>
              <div>
                <p className="font-ibm-mono text-[11px] text-[var(--portal-text-muted)] font-bold">{deal.company}</p>
                <p className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)] mt-0.5">{deal.partner !== "Direct" ? `via ${deal.partner}` : "Direct"}</p>
              </div>
              <span className="font-ibm-mono text-[10px]" style={{ color: pillarColors[deal.pillar] }}>{deal.pillar}</span>
              <span className="font-ibm-mono text-[10px] text-[var(--portal-text-soft)]">{deal.package}</span>
              <span className="font-ibm-mono text-[11px] text-[var(--portal-text-muted)]">£{deal.value.toLocaleString()}</span>
              <span
                className="font-ibm-mono text-[10px]"
                style={{ color: won ? "var(--portal-accent)" : lost ? "var(--portal-text-dim)" : "var(--portal-text-soft)" }}
              >
                {deal.stage}
              </span>
              <span className="font-ibm-mono text-[10px] text-[var(--portal-text-muted)]">{deal.closeDate}</span>
              <span
                className="font-ibm-mono text-[10px]"
                style={{ color: deal.probability >= 70 ? "var(--portal-accent)" : deal.probability >= 40 ? "var(--portal-warning)" : "var(--portal-text-dim)" }}
              >
                {deal.probability}%
              </span>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="px-5 py-12">
            <p className="font-ibm-mono text-[11px] text-[var(--portal-text-soft)]">No deals yet.</p>
            <p className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)] mt-2">Deals will populate here once they are added to the pipeline.</p>
          </div>
        )}
      </div>
    </div>
  );
}
