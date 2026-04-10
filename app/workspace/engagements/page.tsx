"use client";

import Link from "next/link";

const engagements: Array<{ id: string; pillar: string; name: string; package: string; status: string; progress: number; startDate: string; expectedEnd: string; nextMilestone: string; milestoneDue: string; color: string; team: string[]; milestones: Array<{ name: string; status: string; date: string }> }> = [];

export default function EngagementsPage() {
  return (
    <div className="p-8">
      <div className="mb-8 border-b border-[var(--portal-border)] pb-6">
        <span className="font-ibm-mono text-[10px] text-[var(--portal-accent)] tracking-[3px]">// ENGAGEMENTS</span>
        <h1 className="font-grotesk text-[32px] font-bold text-[var(--portal-text)] tracking-[-1px] mt-1">Your Projects</h1>
        <p className="font-ibm-mono text-[12px] text-[var(--portal-text-soft)] tracking-[0.5px] mt-1">Track progress, milestones, and team across all active engagements.</p>
      </div>

      <div className="flex flex-col gap-6">
        {engagements.map((eng) => (
          <div key={eng.id} className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
            {/* Header */}
            <div className="px-6 py-5 border-b border-[var(--portal-border)] flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-ibm-mono text-[9px] tracking-[2px] px-2 py-1" style={{ background: eng.color + "20", color: eng.color }}>
                    {eng.pillar}
                  </span>
                  <span className="font-ibm-mono text-[9px] text-[var(--portal-text-soft)] tracking-[1px]">{eng.id}</span>
                </div>
                <h2 className="font-grotesk text-[20px] font-bold text-[var(--portal-text)]">{eng.name}</h2>
                <p className="font-ibm-mono text-[11px] text-[var(--portal-text-soft)] mt-1">{eng.package}</p>
              </div>
              <div className="text-right">
                <p className="font-ibm-mono text-[10px] text-[var(--portal-text-muted)] tracking-[1px]">TEAM</p>
                <div className="flex items-center gap-2 mt-1 justify-end">
                  {eng.team.map((name) => (
                    <span key={name} className="font-ibm-mono text-[10px] text-[var(--portal-text)] bg-[var(--portal-surface-subtle)] px-2 py-1">{name}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 grid grid-cols-3 gap-6">
              {/* Progress */}
              <div className="col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-ibm-mono text-[10px] text-[var(--portal-text-muted)] tracking-[1px]">OVERALL PROGRESS</p>
                  <p className="font-ibm-mono text-[12px] font-bold" style={{ color: eng.color }}>{eng.progress}%</p>
                </div>
                <div className="w-full bg-[var(--portal-border)] h-2 mb-6">
                  <div className="h-2 transition-all" style={{ width: `${eng.progress}%`, background: eng.color }} />
                </div>

                {/* Milestones */}
                <p className="font-ibm-mono text-[10px] text-[var(--portal-text-muted)] tracking-[1px] mb-3">MILESTONES</p>
                <div className="flex flex-col gap-2">
                  {eng.milestones.map((m, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 flex items-center justify-center text-[10px] shrink-0"
                        style={{
                          background: m.status === "done" ? eng.color : m.status === "active" ? eng.color + "30" : "var(--portal-border)",
                          color: m.status === "done" ? "var(--portal-accent-contrast)" : eng.color,
                          border: m.status === "active" ? `1px solid ${eng.color}` : "none",
                        }}
                      >
                        {m.status === "done" ? "✓" : m.status === "active" ? "▶" : ""}
                      </div>
                      <span
                        className="font-ibm-mono text-[11px] flex-1"
                        style={{ color: m.status === "done" ? "var(--portal-text-muted)" : m.status === "active" ? "var(--portal-text)" : "var(--portal-text-dim)" }}
                      >
                        {m.name}
                      </span>
                      <span className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">{m.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meta */}
              <div className="flex flex-col gap-4">
                <div className="border border-[var(--portal-border)] p-4 bg-[var(--portal-bg)]">
                  <p className="font-ibm-mono text-[10px] text-[var(--portal-text-muted)] tracking-[1px] mb-1">NEXT MILESTONE</p>
                  <p className="font-ibm-mono text-[12px] text-[var(--portal-text)]">{eng.nextMilestone}</p>
                  <p className="font-ibm-mono text-[10px] mt-1" style={{ color: eng.color }}>Due {eng.milestoneDue}</p>
                </div>
                <div className="border border-[var(--portal-border)] p-4 bg-[var(--portal-bg)]">
                  <p className="font-ibm-mono text-[10px] text-[var(--portal-text-muted)] tracking-[1px] mb-2">TIMELINE</p>
                  <p className="font-ibm-mono text-[10px] text-[var(--portal-text-soft)]">Started: <span className="text-[var(--portal-text-muted)]">{eng.startDate}</span></p>
                  <p className="font-ibm-mono text-[10px] text-[var(--portal-text-soft)] mt-1">Expected: <span className="text-[var(--portal-text-muted)]">{eng.expectedEnd}</span></p>
                </div>
                <Link
                  href={`/workspace/requests?engagement=${eng.id}`}
                  className="border border-[var(--portal-accent)] px-4 py-2.5 text-center font-ibm-mono text-[10px] text-[var(--portal-accent)] tracking-[1px] hover:bg-[var(--portal-accent-soft)] transition-colors"
                >
                  RAISE A REQUEST →
                </Link>
              </div>
            </div>
          </div>
        ))}
        {engagements.length === 0 && (
          <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-6">
            <p className="font-ibm-mono text-[11px] text-[var(--portal-text-soft)]">No engagements yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
