"use client";

import { useState } from "react";

const commissions = [
  { id: "COM-008", partner: "James H.", deal: "UrbanNest — Social Pro", pillar: "GROW", month: "Mar 2026", baseAmount: 699, rate: 20, amount: 139.80, status: "Pending", tier: "Tier 1" },
  { id: "COM-007", partner: "Sara M.", deal: "Pixel & Co — Brand Identity", pillar: "LAUNCH", month: "Mar 2026", baseAmount: 2499, rate: 15, amount: 374.85, status: "Pending", tier: "Tier 1" },
  { id: "COM-006", partner: "James H.", deal: "Nova Analytics — MVP Build", pillar: "BUILD", month: "Feb 2026", baseAmount: 15000, rate: 10, amount: 1500, status: "Approved", tier: "Tier 2" },
  { id: "COM-005", partner: "Sara M.", deal: "Flux Payments — API Build", pillar: "BUILD", month: "Feb 2026", baseAmount: 8500, rate: 10, amount: 850, status: "Approved", tier: "Tier 1" },
  { id: "COM-004", partner: "James H.", deal: "UrbanNest — Social Pro", pillar: "GROW", month: "Feb 2026", baseAmount: 699, rate: 20, amount: 139.80, status: "Paid", tier: "Tier 1" },
  { id: "COM-003", partner: "Sara M.", deal: "Pixel & Co — Brand Identity", pillar: "LAUNCH", month: "Feb 2026", baseAmount: 2499, rate: 15, amount: 374.85, status: "Paid", tier: "Tier 1" },
  { id: "COM-002", partner: "James H.", deal: "UrbanNest — Social Pro", pillar: "GROW", month: "Jan 2026", baseAmount: 699, rate: 20, amount: 139.80, status: "Paid", tier: "Tier 1" },
  { id: "COM-001", partner: "Sara M.", deal: "Pixel & Co — Discovery", pillar: "LAUNCH", month: "Jan 2026", baseAmount: 500, rate: 15, amount: 75, status: "Paid", tier: "Tier 1" },
];

const statusColors = {
  Pending: { bg: "#FF6B3520", text: "#FF6B35" },
  Approved: { bg: "#D6E26420", text: "#D6E264" },
  Paid: { bg: "#FFFFFF10", text: "#555" },
};

const pillarColors: Record<string, string> = { LAUNCH: "#D6E264", GROW: "#FF6B35", BUILD: "#888" };

export default function CommissionsPage() {
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = commissions.filter((c) => statusFilter === "All" || c.status === statusFilter);
  const pendingTotal = commissions.filter(c => c.status === "Pending").reduce((s, c) => s + c.amount, 0);
  const approvedTotal = commissions.filter(c => c.status === "Approved").reduce((s, c) => s + c.amount, 0);
  const paidTotal = commissions.filter(c => c.status === "Paid").reduce((s, c) => s + c.amount, 0);

  return (
    <div className="p-8">
      <div className="mb-8 border-b border-[#1D1D1D] pb-6">
        <span className="font-ibm-mono text-[10px] text-[#D6E264] tracking-[3px]">// COMMISSIONS</span>
        <h1 className="font-grotesk text-[32px] font-bold text-[#F5F5F0] tracking-[-1px] mt-1">Commission Engine</h1>
        <p className="font-ibm-mono text-[12px] text-[#888] tracking-[0.5px] mt-1">Track, approve, and pay out partner commissions.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="border border-[#FF6B3540] bg-[#0F0F0F] p-5">
          <p className="font-ibm-mono text-[10px] text-[#666] tracking-[1px] mb-2">PENDING APPROVAL</p>
          <p className="font-grotesk text-[28px] font-bold text-[#FF6B35]">£{pendingTotal.toFixed(2)}</p>
          <p className="font-ibm-mono text-[10px] text-[#555] mt-1">{commissions.filter(c => c.status === "Pending").length} claims</p>
        </div>
        <div className="border border-[#D6E26440] bg-[#0F0F0F] p-5">
          <p className="font-ibm-mono text-[10px] text-[#666] tracking-[1px] mb-2">APPROVED / TO PAY</p>
          <p className="font-grotesk text-[28px] font-bold text-[#D6E264]">£{approvedTotal.toFixed(2)}</p>
          <p className="font-ibm-mono text-[10px] text-[#555] mt-1">{commissions.filter(c => c.status === "Approved").length} approved</p>
        </div>
        <div className="border border-[#1D1D1D] bg-[#0F0F0F] p-5">
          <p className="font-ibm-mono text-[10px] text-[#666] tracking-[1px] mb-2">PAID ALL TIME</p>
          <p className="font-grotesk text-[28px] font-bold text-[#F5F5F0]">£{paidTotal.toFixed(2)}</p>
          <p className="font-ibm-mono text-[10px] text-[#555] mt-1">{commissions.filter(c => c.status === "Paid").length} payments</p>
        </div>
      </div>

      {/* Approved payout action */}
      {approvedTotal > 0 && (
        <div className="border border-[#D6E26440] bg-[#1A2A0A] px-6 py-4 flex items-center justify-between mb-6">
          <div>
            <p className="font-ibm-mono text-[11px] text-[#D6E264] tracking-[1px]">READY TO PAY</p>
            <p className="font-ibm-mono text-[12px] text-[#CCCCCC] mt-1">£{approvedTotal.toFixed(2)} in approved commissions ready for payout via Stripe Connect.</p>
          </div>
          <button className="bg-[#D6E264] hover:bg-[#c9d64f] text-[#0A0A0A] font-ibm-mono text-[11px] font-bold tracking-[2px] px-6 py-3 transition-colors cursor-pointer border-none">
            PAY OUT ALL →
          </button>
        </div>
      )}

      {/* Filter */}
      <div className="flex border border-[#1D1D1D] w-fit mb-6">
        {["All", "Pending", "Approved", "Paid"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className="px-4 py-2 font-ibm-mono text-[10px] tracking-[1px] transition-colors cursor-pointer border-none border-r border-[#1D1D1D] last:border-r-0"
            style={{ background: statusFilter === s ? "#D6E264" : "#111", color: statusFilter === s ? "#0A0A0A" : "#666" }}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="border border-[#1D1D1D] bg-[#0F0F0F]">
        <div className="grid grid-cols-[80px_100px_1fr_80px_80px_80px_80px_100px_100px] gap-3 px-5 py-3 border-b border-[#1D1D1D]">
          {["ID", "Partner", "Deal", "Pillar", "Month", "Base", "Rate", "Commission", "Status"].map((h) => (
            <span key={h} className="font-ibm-mono text-[9px] text-[#555] tracking-[2px]">{h}</span>
          ))}
        </div>
        {filtered.map((c) => {
          const sc = statusColors[c.status as keyof typeof statusColors];
          return (
            <div key={c.id} className="grid grid-cols-[80px_100px_1fr_80px_80px_80px_80px_100px_100px] gap-3 px-5 py-4 border-b border-[#1D1D1D] hover:bg-[#111] transition-colors items-center">
              <span className="font-ibm-mono text-[10px] text-[#666]">{c.id}</span>
              <span className="font-ibm-mono text-[10px] text-[#CCCCCC]">{c.partner}</span>
              <div>
                <p className="font-ibm-mono text-[10px] text-[#AAAAAA]">{c.deal}</p>
                <p className="font-ibm-mono text-[9px] text-[#444] mt-0.5">{c.tier}</p>
              </div>
              <span className="font-ibm-mono text-[10px]" style={{ color: pillarColors[c.pillar] }}>{c.pillar}</span>
              <span className="font-ibm-mono text-[10px] text-[#666]">{c.month}</span>
              <span className="font-ibm-mono text-[10px] text-[#888]">£{c.baseAmount.toLocaleString()}</span>
              <span className="font-ibm-mono text-[10px] text-[#777]">{c.rate}%</span>
              <span className="font-ibm-mono text-[12px] font-bold text-[#F5F5F0]">£{c.amount.toFixed(2)}</span>
              <div className="flex items-center gap-2">
                <span className="font-ibm-mono text-[9px] tracking-[1px] px-2 py-1" style={{ background: sc.bg, color: sc.text }}>
                  {c.status.toUpperCase()}
                </span>
                {c.status === "Pending" && (
                  <button className="font-ibm-mono text-[9px] text-[#D6E264] hover:opacity-80 cursor-pointer bg-transparent border-none">✓</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
