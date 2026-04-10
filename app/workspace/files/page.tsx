"use client";

import { useState } from "react";

type Deliverable = {
  id: string;
  name: string;
  type: string;
  engagement: string;
  pillar: "LAUNCH" | "GROW" | "BUILD";
  status: "Awaiting approval" | "Approved" | "Revision requested";
  uploadedBy: string;
  date: string;
  size: string;
};

const deliverables: Deliverable[] = [];

const statusColors = {
  "Awaiting approval": { bg: "var(--portal-warning-strong-soft)", text: "var(--portal-warning)" },
  Approved: { bg: "var(--portal-accent-strong-soft)", text: "var(--portal-accent)" },
  "Revision requested": { bg: "var(--portal-muted-soft)", text: "var(--portal-text-soft)" },
};

const typeIcons: Record<string, string> = {
  PDF: "◈",
  Figma: "◉",
  Doc: "◧",
  Spreadsheet: "◫",
};

export default function FilesPage() {
  const [filter, setFilter] = useState<"All" | "Awaiting approval" | "Approved" | "Revision requested">("All");
  const [pillarFilter, setPillarFilter] = useState<"All" | "LAUNCH" | "GROW" | "BUILD">("All");

  const filtered = deliverables.filter((d) => {
    const statusOk = filter === "All" || d.status === filter;
    const pillarOk = pillarFilter === "All" || d.pillar === pillarFilter;
    return statusOk && pillarOk;
  });

  const pending = deliverables.filter((d) => d.status === "Awaiting approval").length;

  return (
    <div className="p-8">
      <div className="mb-8 border-b border-[var(--portal-border)] pb-6">
        <span className="font-ibm-mono text-[10px] text-[var(--portal-accent)] tracking-[3px]">// FILES & DELIVERABLES</span>
        <h1 className="font-grotesk text-[32px] font-bold text-[var(--portal-text)] tracking-[-1px] mt-1">Files</h1>
        {pending > 0 && (
          <p className="font-ibm-mono text-[12px] mt-1">
            <span className="text-[var(--portal-warning)]">{pending} file{pending !== 1 ? "s" : ""} awaiting your approval.</span>{" "}
            <span className="text-[var(--portal-text-muted)]">Review and approve or request revisions below.</span>
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex border border-[var(--portal-border)]">
          {(["All", "Awaiting approval", "Approved", "Revision requested"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-2 font-ibm-mono text-[10px] tracking-[1px] transition-colors cursor-pointer border-none border-r border-[var(--portal-border)] last:border-r-0"
              style={{ background: filter === f ? "var(--portal-accent)" : "var(--portal-surface-alt)", color: filter === f ? "var(--portal-accent-contrast)" : "var(--portal-text-muted)" }}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex border border-[var(--portal-border)]">
          {(["All", "LAUNCH", "GROW", "BUILD"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setPillarFilter(f)}
              className="px-4 py-2 font-ibm-mono text-[10px] tracking-[1px] transition-colors cursor-pointer border-none border-r border-[var(--portal-border)] last:border-r-0"
              style={{ background: pillarFilter === f ? "var(--portal-active-bg)" : "var(--portal-surface-alt)", color: pillarFilter === f ? "var(--portal-accent)" : "var(--portal-text-muted)" }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
        <div className="grid grid-cols-[32px_1fr_100px_160px_140px_100px_100px] gap-4 px-5 py-3 border-b border-[var(--portal-border)]">
          {["", "Name", "Type", "Engagement", "Status", "Uploaded", "Actions"].map((h, i) => (
            <span key={i} className="font-ibm-mono text-[9px] text-[var(--portal-text-dim)] tracking-[2px]">{h}</span>
          ))}
        </div>
        {filtered.map((d) => {
          const sc = statusColors[d.status];
          return (
            <div key={d.id} className="grid grid-cols-[32px_1fr_100px_160px_140px_100px_100px] gap-4 px-5 py-4 border-b border-[var(--portal-border)] hover:bg-[var(--portal-surface-alt)] transition-colors items-center">
              <span className="font-ibm-mono text-[14px] text-[var(--portal-text-faint)]">{typeIcons[d.type] ?? "◌"}</span>
              <div>
                <p className="font-ibm-mono text-[11px] text-[var(--portal-text-muted)]">{d.name}</p>
                <p className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)] mt-0.5">by {d.uploadedBy} · {d.size}</p>
              </div>
              <span className="font-ibm-mono text-[10px] text-[var(--portal-text-soft)]">{d.type}</span>
              <span className="font-ibm-mono text-[10px] text-[var(--portal-text-soft)]">{d.engagement}</span>
              <span className="font-ibm-mono text-[9px] tracking-[1px] px-2 py-1 w-fit" style={{ background: sc.bg, color: sc.text }}>
                {d.status.toUpperCase()}
              </span>
              <span className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">{d.date}</span>
              <div className="flex gap-2">
                {d.status === "Awaiting approval" && (
                  <>
                    <button className="font-ibm-mono text-[9px] text-[var(--portal-accent)] hover:opacity-80 cursor-pointer bg-transparent border-none tracking-[1px]">APPROVE</button>
                    <button className="font-ibm-mono text-[9px] text-[var(--portal-text-soft)] hover:opacity-80 cursor-pointer bg-transparent border-none tracking-[1px]">REVISE</button>
                  </>
                )}
                {d.status !== "Awaiting approval" && (
                  <button className="font-ibm-mono text-[9px] text-[var(--portal-text-dim)] hover:text-[var(--portal-text-soft)] cursor-pointer bg-transparent border-none tracking-[1px]">VIEW</button>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center">
            <p className="font-ibm-mono text-[12px] text-[var(--portal-text-faint)]">No files match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
