"use client";

import { useState } from "react";
import { submitRequestAction } from "@/app/workspace/actions";

type RequestRow = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  created_at: string;
  engagement_id: string | null;
};

type EngagementOption = {
  id: string;
  title: string;
  pillar: string;
};

const COLUMNS: { key: string; label: string; color: string }[] = [
  { key: "submitted", label: "QUEUED", color: "var(--portal-text-soft)" },
  { key: "in_progress", label: "IN PROGRESS", color: "var(--portal-warning)" },
  { key: "in_review,delivered", label: "IN REVIEW", color: "var(--portal-accent)" },
  { key: "revision_requested", label: "REVISIONS", color: "var(--portal-warning)" },
  { key: "approved", label: "DONE", color: "var(--portal-text-dim)" },
];

const priorityColors: Record<string, string> = {
  low: "var(--portal-text-dim)",
  normal: "var(--portal-accent)",
  high: "var(--portal-warning)",
  urgent: "var(--portal-danger, var(--portal-warning))",
};

function matchesColumn(status: string, colKey: string) {
  return colKey.split(",").includes(status);
}

export default function RequestsBoard({
  initialRequests,
  engagements,
  statusMessage,
  errorMessage,
  projectFilter,
}: {
  initialRequests: RequestRow[];
  engagements: EngagementOption[];
  statusMessage?: string;
  errorMessage?: string;
  projectFilter?: string;
}) {
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [showNew, setShowNew] = useState(false);
  const [priority, setPriority] = useState<"low" | "normal" | "high">("normal");

  const requests = projectFilter
    ? initialRequests.filter((r) => r.engagement_id === projectFilter)
    : initialRequests;

  const engagementMap = new Map(engagements.map((e) => [e.id, e]));

  return (
    <div>
      {statusMessage && (
        <div className="mb-6 border border-[var(--portal-accent)] bg-[var(--portal-accent-soft)] px-4 py-3">
          <p className="font-ibm-mono text-[14px] text-[var(--portal-accent)]">{statusMessage}</p>
        </div>
      )}
      {errorMessage && (
        <div className="mb-6 border border-[var(--portal-warning)] bg-[var(--portal-warning-soft)] px-4 py-3">
          <p className="font-ibm-mono text-[14px] text-[var(--portal-warning)]">{errorMessage}</p>
        </div>
      )}

      {/* Controls */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex border border-[var(--portal-border)]">
          {(["kanban", "list"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="px-4 py-2 font-ibm-mono text-[14px] tracking-[1px] transition-colors cursor-pointer border-none"
              style={{
                background: view === v ? "var(--portal-accent)" : "var(--portal-surface-alt)",
                color: view === v ? "var(--portal-accent-contrast)" : "var(--portal-text-muted)",
              }}
            >
              {v.toUpperCase()}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="px-5 py-2 bg-[var(--portal-accent)] hover:bg-[var(--portal-accent-hover)] font-ibm-mono text-[14px] text-[var(--portal-accent-contrast)] tracking-[2px] transition-colors cursor-pointer border-none"
        >
          + NEW REQUEST
        </button>
      </div>

      {view === "kanban" ? (
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${COLUMNS.length}, minmax(0, 1fr))` }}>
          {COLUMNS.map((col) => {
            const items = requests.filter((r) => matchesColumn(r.status, col.key));
            return (
              <div key={col.key}>
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-ibm-mono text-[14px] tracking-[2px]" style={{ color: col.color }}>
                    {col.label}
                  </span>
                  <span className="font-ibm-mono text-[14px] text-[var(--portal-text-faint)]">{items.length}</span>
                </div>
                <div className="flex flex-col gap-3">
                  {items.map((r) => {
                    const eng = r.engagement_id ? engagementMap.get(r.engagement_id) : null;
                    return (
                      <div key={r.id} className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">{r.id.slice(0, 8)}</span>
                          <span
                            className="font-ibm-mono text-[14px] tracking-[1px]"
                            style={{ color: priorityColors[r.priority] ?? "var(--portal-text-soft)" }}
                          >
                            {r.priority.toUpperCase()}
                          </span>
                        </div>
                        <p className="font-ibm-mono text-[14px] leading-[1.5] text-[var(--portal-text)] mb-2">{r.title}</p>
                        {r.description && (
                          <p className="font-ibm-mono text-[14px] leading-[1.6] text-[var(--portal-text-dim)] mb-2 line-clamp-2">
                            {r.description}
                          </p>
                        )}
                        {eng && (
                          <span className="font-ibm-mono text-[14px] text-[var(--portal-text-faint)]">{eng.title}</span>
                        )}
                        <p className="font-ibm-mono text-[14px] text-[var(--portal-text-faint)] mt-1">
                          {new Date(r.created_at).toLocaleDateString("en-GB")}
                        </p>
                      </div>
                    );
                  })}
                  {items.length === 0 && (
                    <div className="border border-dashed border-[var(--portal-border)] p-6 text-center">
                      <p className="font-ibm-mono text-[14px] text-[var(--portal-text-faint)]">Empty</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
          <div className="grid grid-cols-[80px_1fr_140px_80px_100px_100px] gap-4 border-b border-[var(--portal-border)] px-5 py-3">
            {["ID", "Title", "Project", "Priority", "Status", "Date"].map((h) => (
              <span key={h} className="font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-dim)]">{h}</span>
            ))}
          </div>
          {requests.map((r) => {
            const eng = r.engagement_id ? engagementMap.get(r.engagement_id) : null;
            const colLabel = COLUMNS.find((c) => matchesColumn(r.status, c.key))?.label ?? r.status;
            const colColor = COLUMNS.find((c) => matchesColumn(r.status, c.key))?.color ?? "var(--portal-text-soft)";
            return (
              <div
                key={r.id}
                className="grid grid-cols-[80px_1fr_140px_80px_100px_100px] gap-4 border-b border-[var(--portal-border)] px-5 py-4 transition-colors hover:bg-[var(--portal-surface-alt)]"
              >
                <span className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">{r.id.slice(0, 8)}</span>
                <div>
                  <p className="font-ibm-mono text-[14px] text-[var(--portal-text)]">{r.title}</p>
                  {r.description && (
                    <p className="mt-0.5 font-ibm-mono text-[14px] leading-[1.5] text-[var(--portal-text-dim)] line-clamp-1">
                      {r.description}
                    </p>
                  )}
                </div>
                <span className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">{eng?.title ?? "—"}</span>
                <span
                  className="font-ibm-mono text-[14px]"
                  style={{ color: priorityColors[r.priority] ?? "var(--portal-text-soft)" }}
                >
                  {r.priority}
                </span>
                <span className="font-ibm-mono text-[14px]" style={{ color: colColor }}>
                  {colLabel}
                </span>
                <span className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">
                  {new Date(r.created_at).toLocaleDateString("en-GB")}
                </span>
              </div>
            );
          })}
          {requests.length === 0 && (
            <div className="px-5 py-12">
              <p className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">No requests yet.</p>
            </div>
          )}
        </div>
      )}

      {/* New Request Modal */}
      {showNew && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setShowNew(false)}
        >
          <div
            className="w-full max-w-lg border border-[var(--portal-border-strong)] bg-[var(--portal-surface)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-[var(--portal-border)] px-6 py-5">
              <span className="font-ibm-mono text-[14px] tracking-[3px] text-[var(--portal-accent)]">// NEW REQUEST</span>
              <h2 className="mt-1 font-grotesk text-[20px] font-normal text-[var(--portal-text)]">Raise a Request</h2>
            </div>
            <form action={submitRequestAction} className="flex flex-col gap-4 p-6">
              <div>
                <label className="mb-2 block font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-soft)]">TITLE *</label>
                <input
                  name="title"
                  required
                  placeholder="Briefly describe your request"
                  className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[14px] text-[var(--portal-text)] placeholder:text-[var(--portal-text-faint)] focus:border-[var(--portal-accent)] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-soft)]">DETAILS</label>
                <textarea
                  name="description"
                  rows={4}
                  placeholder="Provide as much detail as possible..."
                  className="w-full resize-none border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[14px] text-[var(--portal-text)] placeholder:text-[var(--portal-text-faint)] focus:border-[var(--portal-accent)] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-soft)]">PROJECT *</label>
                <select
                  name="engagement_id"
                  required
                  defaultValue=""
                  className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[14px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none"
                >
                  <option value="" disabled>Select a project</option>
                  {engagements.map((e) => (
                    <option key={e.id} value={e.id}>{e.title}</option>
                  ))}
                </select>
                {engagements.length === 0 && (
                  <p className="mt-1.5 font-ibm-mono text-[14px] text-[var(--portal-warning)]">
                    No active projects found. Contact your project manager.
                  </p>
                )}
              </div>
              <div>
                <label className="mb-2 block font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-soft)]">PRIORITY</label>
                <input type="hidden" name="priority" value={priority} />
                <div className="flex gap-2">
                  {(["low", "normal", "high"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className="flex-1 border py-2 font-ibm-mono text-[14px] tracking-[1px] transition-colors cursor-pointer"
                      style={{
                        background: priority === p ? `${priorityColors[p]}20` : "transparent",
                        borderColor: priority === p ? priorityColors[p] : "var(--portal-border-strong)",
                        color: priority === p ? priorityColors[p] : "var(--portal-text-dim)",
                      }}
                    >
                      {p.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNew(false)}
                  className="flex-1 border border-[var(--portal-border-strong)] bg-transparent py-3 font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-muted)] transition-colors hover:text-[var(--portal-text)] cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 border-none bg-[var(--portal-accent)] py-3 font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-accent-contrast)] transition-colors hover:bg-[var(--portal-accent-hover)] cursor-pointer"
                >
                  SUBMIT REQUEST →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
