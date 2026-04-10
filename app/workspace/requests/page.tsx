"use client";

import { useState } from "react";

type Request = {
  id: string;
  title: string;
  description: string;
  engagement: string;
  status: "Open" | "In Review" | "In Progress" | "Done";
  priority: "Low" | "Medium" | "High";
  date: string;
};

const initialRequests: Request[] = [];

const statusCols: Request["status"][] = ["Open", "In Review", "In Progress", "Done"];

const statusColors: Record<Request["status"], string> = {
  Open: "var(--portal-text-soft)",
  "In Review": "var(--portal-accent)",
  "In Progress": "var(--portal-warning)",
  Done: "var(--portal-text-dim)",
};

const priorityColors: Record<Request["priority"], string> = {
  Low: "var(--portal-text-dim)",
  Medium: "var(--portal-accent)",
  High: "var(--portal-warning)",
};

export default function RequestsPage() {
  const [requests] = useState<Request[]>(initialRequests);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", engagement: "", priority: "Medium" });
  const [view, setView] = useState<"kanban" | "list">("kanban");

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 border-b border-[var(--portal-border)] pb-6 flex items-end justify-between">
        <div>
          <span className="font-ibm-mono text-[10px] text-[var(--portal-accent)] tracking-[3px]">// REQUESTS</span>
          <h1 className="font-grotesk text-[32px] font-bold text-[var(--portal-text)] tracking-[-1px] mt-1">Requests</h1>
          <p className="font-ibm-mono text-[12px] text-[var(--portal-text-soft)] tracking-[0.5px] mt-1">Raise changes, questions, or additions to your engagement scope.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex border border-[var(--portal-border)]">
            {(["kanban", "list"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className="px-4 py-2 font-ibm-mono text-[10px] tracking-[1px] transition-colors cursor-pointer border-none"
                style={{ background: view === v ? "var(--portal-accent)" : "var(--portal-surface-alt)", color: view === v ? "var(--portal-accent-contrast)" : "var(--portal-text-muted)" }}
              >
                {v.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowNew(true)}
            className="px-5 py-2 bg-[var(--portal-accent)] hover:bg-[var(--portal-accent-hover)] font-ibm-mono text-[10px] text-[var(--portal-accent-contrast)] tracking-[2px] transition-colors cursor-pointer border-none"
          >
            + NEW REQUEST
          </button>
        </div>
      </div>

      {view === "kanban" ? (
        <div className="grid grid-cols-4 gap-4">
          {statusCols.map((col) => {
            const colItems = requests.filter((r) => r.status === col);
            return (
              <div key={col}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-ibm-mono text-[10px] tracking-[2px]" style={{ color: statusColors[col] }}>{col.toUpperCase()}</span>
                  <span className="font-ibm-mono text-[10px] text-[var(--portal-text-faint)]">{colItems.length}</span>
                </div>
                <div className="flex flex-col gap-3">
                  {colItems.map((r) => (
                    <div key={r.id} className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-ibm-mono text-[9px] text-[var(--portal-text-dim)]">{r.id}</span>
                        <span className="font-ibm-mono text-[9px] tracking-[1px]" style={{ color: priorityColors[r.priority] }}>
                          {r.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="font-ibm-mono text-[11px] text-[var(--portal-text-muted)] leading-[1.5] mb-2">{r.title}</p>
                      <p className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)] leading-[1.6] mb-3">{r.description}</p>
                      <p className="font-ibm-mono text-[9px] text-[var(--portal-text-faint)]">{r.engagement}</p>
                      <p className="font-ibm-mono text-[9px] text-[#333] mt-1">{r.date}</p>
                    </div>
                  ))}
                  {colItems.length === 0 && (
                    <div className="border border-dashed border-[var(--portal-border)] p-6 text-center">
                      <p className="font-ibm-mono text-[10px] text-[#333]">No items</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
          <div className="grid grid-cols-[60px_1fr_160px_80px_80px_100px] gap-4 px-5 py-3 border-b border-[var(--portal-border)]">
            {["ID", "Title", "Engagement", "Priority", "Status", "Date"].map((h) => (
              <span key={h} className="font-ibm-mono text-[9px] text-[var(--portal-text-dim)] tracking-[2px]">{h.toUpperCase()}</span>
            ))}
          </div>
          {requests.map((r) => (
            <div key={r.id} className="grid grid-cols-[60px_1fr_160px_80px_80px_100px] gap-4 px-5 py-4 border-b border-[var(--portal-border)] hover:bg-[var(--portal-surface-alt)] transition-colors">
              <span className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">{r.id}</span>
              <div>
                <p className="font-ibm-mono text-[11px] text-[var(--portal-text-muted)]">{r.title}</p>
                <p className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)] mt-0.5 leading-[1.5]">{r.description}</p>
              </div>
              <span className="font-ibm-mono text-[10px] text-[var(--portal-text-soft)]">{r.engagement}</span>
              <span className="font-ibm-mono text-[10px]" style={{ color: priorityColors[r.priority] }}>{r.priority}</span>
              <span className="font-ibm-mono text-[10px]" style={{ color: statusColors[r.status] }}>{r.status}</span>
              <span className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">{r.date}</span>
            </div>
          ))}
        </div>
      )}

      {/* New Request Modal */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowNew(false)}>
          <div className="bg-[var(--portal-surface)] border border-[var(--portal-border-strong)] w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-[var(--portal-border)]">
              <span className="font-ibm-mono text-[10px] text-[var(--portal-accent)] tracking-[3px]">// NEW REQUEST</span>
              <h2 className="font-grotesk text-[20px] font-bold text-[var(--portal-text)] mt-1">Raise a Request</h2>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="font-ibm-mono text-[10px] text-[var(--portal-text-soft)] tracking-[2px] block mb-2">TITLE *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Briefly describe your request"
                  className="w-full bg-[var(--portal-bg)] border border-[var(--portal-border-strong)] text-[var(--portal-text)] font-ibm-mono text-[12px] px-4 py-3 focus:outline-none focus:border-[var(--portal-accent)] transition-colors placeholder:text-[var(--portal-text-faint)]"
                />
              </div>
              <div>
                <label className="font-ibm-mono text-[10px] text-[var(--portal-text-soft)] tracking-[2px] block mb-2">DETAILS *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Provide as much detail as possible..."
                  rows={4}
                  className="w-full bg-[var(--portal-bg)] border border-[var(--portal-border-strong)] text-[var(--portal-text)] font-ibm-mono text-[12px] px-4 py-3 focus:outline-none focus:border-[var(--portal-accent)] transition-colors placeholder:text-[var(--portal-text-faint)] resize-none"
                />
              </div>
              <div>
                <label className="font-ibm-mono text-[10px] text-[var(--portal-text-soft)] tracking-[2px] block mb-2">RELATED ENGAGEMENT</label>
                <select
                  value={form.engagement}
                  onChange={(e) => setForm({ ...form, engagement: e.target.value })}
                  className="w-full bg-[var(--portal-bg)] border border-[var(--portal-border-strong)] text-[var(--portal-text)] font-ibm-mono text-[12px] px-4 py-3 focus:outline-none focus:border-[var(--portal-accent)] transition-colors"
                >
                  <option value="">Select engagement</option>
                </select>
              </div>
              <div>
                <label className="font-ibm-mono text-[10px] text-[var(--portal-text-soft)] tracking-[2px] block mb-2">PRIORITY</label>
                <div className="flex gap-2">
                  {(["Low", "Medium", "High"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setForm({ ...form, priority: p })}
                      className="flex-1 py-2 font-ibm-mono text-[10px] tracking-[1px] border transition-colors cursor-pointer"
                      style={{
                        background: form.priority === p ? priorityColors[p] + "20" : "transparent",
                        borderColor: form.priority === p ? priorityColors[p] : "var(--portal-border-strong)",
                        color: form.priority === p ? priorityColors[p] : "var(--portal-text-dim)",
                      }}
                    >
                      {p.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowNew(false)}
                  className="flex-1 py-3 border border-[var(--portal-border-strong)] font-ibm-mono text-[10px] text-[var(--portal-text-muted)] tracking-[2px] hover:text-[var(--portal-text)] transition-colors cursor-pointer bg-transparent"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => setShowNew(false)}
                  className="flex-1 py-3 bg-[var(--portal-accent)] hover:bg-[var(--portal-accent-hover)] font-ibm-mono text-[10px] text-[var(--portal-accent-contrast)] tracking-[2px] transition-colors cursor-pointer border-none font-bold"
                >
                  SUBMIT REQUEST →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
