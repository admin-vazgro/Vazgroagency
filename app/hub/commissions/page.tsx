"use client";

import { useState } from "react";

const commissions: Array<{ id: string; partner: string; deal: string; pillar: string; month: string; baseAmount: number; rate: number; amount: number; status: string; tier: string }> = [];

const statusColors = {
  Pending: { bg: "var(--portal-warning-strong-soft)", text: "var(--portal-warning)" },
  Approved: { bg: "var(--portal-accent-strong-soft)", text: "var(--portal-accent)" },
  Paid: { bg: "var(--portal-muted-soft)", text: "var(--portal-text-dim)" },
};

const pillarColors: Record<string, string> = { LAUNCH: "var(--portal-accent)", GROW: "var(--portal-warning)", BUILD: "var(--portal-text-soft)" };

export default function CommissionsPage() {
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = commissions.filter((c) => statusFilter === "All" || c.status === statusFilter);
  const pendingTotal = commissions.filter(c => c.status === "Pending").reduce((s, c) => s + c.amount, 0);
  const approvedTotal = commissions.filter(c => c.status === "Approved").reduce((s, c) => s + c.amount, 0);
  const paidTotal = commissions.filter(c => c.status === "Paid").reduce((s, c) => s + c.amount, 0);

  return (
    <div className="p-8">
      <div className="mb-8 border-b border-[var(--portal-border)] pb-6">
        <span className="font-ibm-mono text-[10px] text-[var(--portal-accent)] tracking-[3px]">// COMMISSIONS</span>
        <h1 className="font-grotesk text-[32px] font-bold text-[var(--portal-text)] tracking-[-1px] mt-1">Commission Engine</h1>
        <p className="font-ibm-mono text-[12px] text-[var(--portal-text-soft)] tracking-[0.5px] mt-1">Track, approve, and pay out partner commissions.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="border border-[var(--portal-warning-strong-soft)] bg-[var(--portal-surface)] p-5">
          <p className="font-ibm-mono text-[10px] text-[var(--portal-text-muted)] tracking-[1px] mb-2">PENDING APPROVAL</p>
          <p className="font-grotesk text-[28px] font-bold text-[var(--portal-warning)]">£{pendingTotal.toFixed(2)}</p>
          <p className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)] mt-1">{commissions.filter(c => c.status === "Pending").length} claims</p>
        </div>
        <div className="border border-[var(--portal-accent-strong-soft)] bg-[var(--portal-surface)] p-5">
          <p className="font-ibm-mono text-[10px] text-[var(--portal-text-muted)] tracking-[1px] mb-2">APPROVED / TO PAY</p>
          <p className="font-grotesk text-[28px] font-bold text-[var(--portal-accent)]">£{approvedTotal.toFixed(2)}</p>
          <p className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)] mt-1">{commissions.filter(c => c.status === "Approved").length} approved</p>
        </div>
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
          <p className="font-ibm-mono text-[10px] text-[var(--portal-text-muted)] tracking-[1px] mb-2">PAID ALL TIME</p>
          <p className="font-grotesk text-[28px] font-bold text-[var(--portal-text)]">£{paidTotal.toFixed(2)}</p>
          <p className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)] mt-1">{commissions.filter(c => c.status === "Paid").length} payments</p>
        </div>
      </div>

      {/* Approved payout action */}
      {approvedTotal > 0 && (
        <div className="border border-[var(--portal-accent-strong-soft)] bg-[var(--portal-success-tint)] px-6 py-4 flex items-center justify-between mb-6">
          <div>
            <p className="font-ibm-mono text-[11px] text-[var(--portal-accent)] tracking-[1px]">READY TO PAY</p>
            <p className="font-ibm-mono text-[12px] text-[var(--portal-text-muted)] mt-1">£{approvedTotal.toFixed(2)} in approved commissions ready for payout via Stripe Connect.</p>
          </div>
          <button className="bg-[var(--portal-accent)] hover:bg-[var(--portal-accent-hover)] text-[var(--portal-accent-contrast)] font-ibm-mono text-[11px] font-bold tracking-[2px] px-6 py-3 transition-colors cursor-pointer border-none">
            PAY OUT ALL →
          </button>
        </div>
      )}

      {/* Filter */}
      <div className="flex border border-[var(--portal-border)] w-fit mb-6">
        {["All", "Pending", "Approved", "Paid"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className="px-4 py-2 font-ibm-mono text-[10px] tracking-[1px] transition-colors cursor-pointer border-none border-r border-[var(--portal-border)] last:border-r-0"
            style={{ background: statusFilter === s ? "var(--portal-accent)" : "var(--portal-surface-alt)", color: statusFilter === s ? "var(--portal-accent-contrast)" : "var(--portal-text-muted)" }}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
        <div className="grid grid-cols-[80px_100px_1fr_80px_80px_80px_80px_100px_100px] gap-3 px-5 py-3 border-b border-[var(--portal-border)]">
          {["ID", "Partner", "Deal", "Pillar", "Month", "Base", "Rate", "Commission", "Status"].map((h) => (
            <span key={h} className="font-ibm-mono text-[9px] text-[var(--portal-text-dim)] tracking-[2px]">{h}</span>
          ))}
        </div>
        {filtered.map((c) => {
          const sc = statusColors[c.status as keyof typeof statusColors];
          return (
            <div key={c.id} className="grid grid-cols-[80px_100px_1fr_80px_80px_80px_80px_100px_100px] gap-3 px-5 py-4 border-b border-[var(--portal-border)] hover:bg-[var(--portal-surface-alt)] transition-colors items-center">
              <span className="font-ibm-mono text-[10px] text-[var(--portal-text-muted)]">{c.id}</span>
              <span className="font-ibm-mono text-[10px] text-[var(--portal-text-muted)]">{c.partner}</span>
              <div>
                <p className="font-ibm-mono text-[10px] text-[var(--portal-text)]">{c.deal}</p>
                <p className="font-ibm-mono text-[9px] text-[var(--portal-text-faint)] mt-0.5">{c.tier}</p>
              </div>
              <span className="font-ibm-mono text-[10px]" style={{ color: pillarColors[c.pillar] }}>{c.pillar}</span>
              <span className="font-ibm-mono text-[10px] text-[var(--portal-text-muted)]">{c.month}</span>
              <span className="font-ibm-mono text-[10px] text-[var(--portal-text-soft)]">£{c.baseAmount.toLocaleString()}</span>
              <span className="font-ibm-mono text-[10px] text-[var(--portal-text-soft)]">{c.rate}%</span>
              <span className="font-ibm-mono text-[12px] font-bold text-[var(--portal-text)]">£{c.amount.toFixed(2)}</span>
              <div className="flex items-center gap-2">
                <span className="font-ibm-mono text-[9px] tracking-[1px] px-2 py-1" style={{ background: sc.bg, color: sc.text }}>
                  {c.status.toUpperCase()}
                </span>
                {c.status === "Pending" && (
                  <button className="font-ibm-mono text-[9px] text-[var(--portal-accent)] hover:opacity-80 cursor-pointer bg-transparent border-none">✓</button>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="px-5 py-12">
            <p className="font-ibm-mono text-[11px] text-[var(--portal-text-soft)]">No commission data yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
