"use client";

import Link from "next/link";

const engagements: Array<{ id: string; pillar: string; name: string; status: string; progress: number; nextMilestone: string; dueDate: string; color: string }> = [];
const recentDeliverables: Array<{ name: string; date: string; type: string; status: string }> = [];
const recentRequests: Array<{ id: string; title: string; status: string; date: string }> = [];

export default function WorkspaceDashboard() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 border-b border-[var(--portal-border)] pb-6">
        <span className="font-ibm-mono text-[10px] text-[var(--portal-accent)] tracking-[3px]">// YOUR WORKSPACE</span>
        <h1 className="font-grotesk text-[32px] font-bold text-[var(--portal-text)] tracking-[-1px] mt-1">Good morning.</h1>
        <p className="font-ibm-mono text-[12px] text-[var(--portal-text-soft)] tracking-[0.5px] mt-1">
          Your workspace is ready. Live projects, files, requests, and invoices will appear here once they are added.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Engagements", value: "0", note: "No live engagement data yet" },
          { label: "Open Requests", value: "0", note: "No live request data yet" },
          { label: "Pending Approvals", value: "0", note: "No live approval data yet" },
          { label: "Invoices Due", value: "£0", note: "All paid" },
        ].map(({ label, value, note }) => (
          <div key={label} className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
            <p className="font-ibm-mono text-[10px] text-[var(--portal-text-muted)] tracking-[1px] mb-2">{label.toUpperCase()}</p>
            <p className="font-grotesk text-[28px] font-bold text-[var(--portal-text)]">{value}</p>
            <p className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)] tracking-[0.5px] mt-1">{note}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Active Engagements */}
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
          <div className="px-6 py-4 border-b border-[var(--portal-border)] flex items-center justify-between">
            <span className="font-ibm-mono text-[10px] text-[var(--portal-text)] tracking-[2px]">ACTIVE ENGAGEMENTS</span>
            <Link href="/workspace/engagements" className="font-ibm-mono text-[10px] text-[var(--portal-accent)] tracking-[1px] hover:opacity-80">VIEW ALL →</Link>
          </div>
          <div className="p-4 flex flex-col gap-3">
            {engagements.map((eng) => (
              <Link key={eng.id} href={`/workspace/engagements?engagement=${eng.id}`} className="block p-4 border border-[var(--portal-border)] hover:border-[var(--portal-border-strong)] transition-colors bg-[var(--portal-bg)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-ibm-mono text-[9px] tracking-[2px] px-2 py-1" style={{ background: eng.color + "20", color: eng.color }}>
                    {eng.pillar}
                  </span>
                  <span className="font-ibm-mono text-[9px] text-[var(--portal-text-muted)] tracking-[1px]">{eng.status.toUpperCase()}</span>
                </div>
                <p className="font-grotesk text-[14px] font-bold text-[var(--portal-text)] mb-3">{eng.name}</p>
                {/* Progress bar */}
                <div className="w-full bg-[var(--portal-border)] h-1 mb-2">
                  <div className="h-1 transition-all" style={{ width: `${eng.progress}%`, background: eng.color }} />
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-ibm-mono text-[10px] text-[var(--portal-text-soft)]">Next: {eng.nextMilestone}</p>
                  <p className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">{eng.dueDate}</p>
                </div>
              </Link>
            ))}
            {engagements.length === 0 && (
              <div className="p-4 border border-[var(--portal-border)] bg-[var(--portal-bg)]">
                <p className="font-ibm-mono text-[11px] text-[var(--portal-text-soft)]">No active engagements yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent activity */}
        <div className="flex flex-col gap-6">
          {/* Recent deliverables */}
          <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
            <div className="px-6 py-4 border-b border-[var(--portal-border)] flex items-center justify-between">
              <span className="font-ibm-mono text-[10px] text-[var(--portal-text)] tracking-[2px]">RECENT DELIVERABLES</span>
              <Link href="/workspace/files" className="font-ibm-mono text-[10px] text-[var(--portal-accent)] tracking-[1px] hover:opacity-80">VIEW ALL →</Link>
            </div>
            <div className="divide-y divide-[var(--portal-border)]">
              {recentDeliverables.map((d) => (
                <div key={d.name} className="px-6 py-3 flex items-center justify-between">
                  <div>
                    <p className="font-ibm-mono text-[11px] text-[var(--portal-text-muted)]">{d.name}</p>
                    <p className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)] mt-0.5">{d.type} · {d.date}</p>
                  </div>
                  <span
                    className="font-ibm-mono text-[9px] tracking-[1px] px-2 py-1"
                    style={{
                      background: d.status === "Approved" ? "var(--portal-accent-strong-soft)" : "var(--portal-warning-strong-soft)",
                      color: d.status === "Approved" ? "var(--portal-accent)" : "var(--portal-warning)",
                    }}
                  >
                    {d.status.toUpperCase()}
                  </span>
                </div>
              ))}
              {recentDeliverables.length === 0 && (
                <div className="px-6 py-6">
                  <p className="font-ibm-mono text-[11px] text-[var(--portal-text-soft)]">No deliverables yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent requests */}
          <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
            <div className="px-6 py-4 border-b border-[var(--portal-border)] flex items-center justify-between">
              <span className="font-ibm-mono text-[10px] text-[var(--portal-text)] tracking-[2px]">RECENT REQUESTS</span>
              <Link href="/workspace/requests" className="font-ibm-mono text-[10px] text-[var(--portal-accent)] tracking-[1px] hover:opacity-80">VIEW ALL →</Link>
            </div>
            <div className="divide-y divide-[var(--portal-border)]">
              {recentRequests.map((r) => (
                <div key={r.id} className="px-6 py-3 flex items-center justify-between">
                  <div>
                    <p className="font-ibm-mono text-[11px] text-[var(--portal-text-muted)]">{r.title}</p>
                    <p className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)] mt-0.5">{r.id} · {r.date}</p>
                  </div>
                  <span
                    className="font-ibm-mono text-[9px] tracking-[1px] px-2 py-1"
                    style={{
                      background: r.status === "In Review" ? "var(--portal-accent-strong-soft)" : "var(--portal-muted-soft)",
                      color: r.status === "In Review" ? "var(--portal-accent)" : "var(--portal-text-soft)",
                    }}
                  >
                    {r.status.toUpperCase()}
                  </span>
                </div>
              ))}
              {recentRequests.length === 0 && (
                <div className="px-6 py-6">
                  <p className="font-ibm-mono text-[11px] text-[var(--portal-text-soft)]">No requests yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
