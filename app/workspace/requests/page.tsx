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

const initialRequests: Request[] = [
  {
    id: "REQ-004",
    title: "Update brand colour palette",
    description: "We'd like to explore a slightly warmer tone for the secondary colour — can we see a few options?",
    engagement: "Brand & Website Package",
    status: "In Review",
    priority: "Medium",
    date: "09 Apr 2026",
  },
  {
    id: "REQ-003",
    title: "Add Instagram Reel to deliverables",
    description: "We have a product launch next week and need a Reel for it. Can this be added to the month 2 scope?",
    engagement: "Social Media Management",
    status: "Open",
    priority: "High",
    date: "07 Apr 2026",
  },
  {
    id: "REQ-002",
    title: "Share Figma file access",
    description: "Please add our internal designer (john@company.com) as a viewer on the Figma project.",
    engagement: "Brand & Website Package",
    status: "Done",
    priority: "Low",
    date: "03 Apr 2026",
  },
  {
    id: "REQ-001",
    title: "Discovery call scheduling",
    description: "Can we set up the initial discovery call for next week?",
    engagement: "Brand & Website Package",
    status: "Done",
    priority: "Medium",
    date: "01 Apr 2026",
  },
];

const statusCols: Request["status"][] = ["Open", "In Review", "In Progress", "Done"];

const statusColors: Record<Request["status"], string> = {
  Open: "#888",
  "In Review": "#D6E264",
  "In Progress": "#FF6B35",
  Done: "#555",
};

const priorityColors: Record<Request["priority"], string> = {
  Low: "#555",
  Medium: "#D6E264",
  High: "#FF6B35",
};

export default function RequestsPage() {
  const [requests] = useState<Request[]>(initialRequests);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", engagement: "", priority: "Medium" });
  const [view, setView] = useState<"kanban" | "list">("kanban");

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 border-b border-[#1D1D1D] pb-6 flex items-end justify-between">
        <div>
          <span className="font-ibm-mono text-[10px] text-[#D6E264] tracking-[3px]">// REQUESTS</span>
          <h1 className="font-grotesk text-[32px] font-bold text-[#F5F5F0] tracking-[-1px] mt-1">Requests</h1>
          <p className="font-ibm-mono text-[12px] text-[#888] tracking-[0.5px] mt-1">Raise changes, questions, or additions to your engagement scope.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex border border-[#1D1D1D]">
            {(["kanban", "list"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className="px-4 py-2 font-ibm-mono text-[10px] tracking-[1px] transition-colors cursor-pointer border-none"
                style={{ background: view === v ? "#D6E264" : "#111", color: view === v ? "#0A0A0A" : "#666" }}
              >
                {v.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowNew(true)}
            className="px-5 py-2 bg-[#D6E264] hover:bg-[#c9d64f] font-ibm-mono text-[10px] text-[#0A0A0A] tracking-[2px] transition-colors cursor-pointer border-none"
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
                  <span className="font-ibm-mono text-[10px] text-[#444]">{colItems.length}</span>
                </div>
                <div className="flex flex-col gap-3">
                  {colItems.map((r) => (
                    <div key={r.id} className="border border-[#1D1D1D] bg-[#0F0F0F] p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-ibm-mono text-[9px] text-[#555]">{r.id}</span>
                        <span className="font-ibm-mono text-[9px] tracking-[1px]" style={{ color: priorityColors[r.priority] }}>
                          {r.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="font-ibm-mono text-[11px] text-[#CCCCCC] leading-[1.5] mb-2">{r.title}</p>
                      <p className="font-ibm-mono text-[10px] text-[#555] leading-[1.6] mb-3">{r.description}</p>
                      <p className="font-ibm-mono text-[9px] text-[#444]">{r.engagement}</p>
                      <p className="font-ibm-mono text-[9px] text-[#333] mt-1">{r.date}</p>
                    </div>
                  ))}
                  {colItems.length === 0 && (
                    <div className="border border-dashed border-[#1D1D1D] p-6 text-center">
                      <p className="font-ibm-mono text-[10px] text-[#333]">No items</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="border border-[#1D1D1D] bg-[#0F0F0F]">
          <div className="grid grid-cols-[60px_1fr_160px_80px_80px_100px] gap-4 px-5 py-3 border-b border-[#1D1D1D]">
            {["ID", "Title", "Engagement", "Priority", "Status", "Date"].map((h) => (
              <span key={h} className="font-ibm-mono text-[9px] text-[#555] tracking-[2px]">{h.toUpperCase()}</span>
            ))}
          </div>
          {requests.map((r) => (
            <div key={r.id} className="grid grid-cols-[60px_1fr_160px_80px_80px_100px] gap-4 px-5 py-4 border-b border-[#1D1D1D] hover:bg-[#111] transition-colors">
              <span className="font-ibm-mono text-[10px] text-[#555]">{r.id}</span>
              <div>
                <p className="font-ibm-mono text-[11px] text-[#CCCCCC]">{r.title}</p>
                <p className="font-ibm-mono text-[10px] text-[#555] mt-0.5 leading-[1.5]">{r.description}</p>
              </div>
              <span className="font-ibm-mono text-[10px] text-[#777]">{r.engagement}</span>
              <span className="font-ibm-mono text-[10px]" style={{ color: priorityColors[r.priority] }}>{r.priority}</span>
              <span className="font-ibm-mono text-[10px]" style={{ color: statusColors[r.status] }}>{r.status}</span>
              <span className="font-ibm-mono text-[10px] text-[#555]">{r.date}</span>
            </div>
          ))}
        </div>
      )}

      {/* New Request Modal */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowNew(false)}>
          <div className="bg-[#0F0F0F] border border-[#2D2D2D] w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-[#1D1D1D]">
              <span className="font-ibm-mono text-[10px] text-[#D6E264] tracking-[3px]">// NEW REQUEST</span>
              <h2 className="font-grotesk text-[20px] font-bold text-[#F5F5F0] mt-1">Raise a Request</h2>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="font-ibm-mono text-[10px] text-[#888] tracking-[2px] block mb-2">TITLE *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Briefly describe your request"
                  className="w-full bg-[#0A0A0A] border border-[#2D2D2D] text-[#F5F5F0] font-ibm-mono text-[12px] px-4 py-3 focus:outline-none focus:border-[#D6E264] transition-colors placeholder:text-[#444]"
                />
              </div>
              <div>
                <label className="font-ibm-mono text-[10px] text-[#888] tracking-[2px] block mb-2">DETAILS *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Provide as much detail as possible..."
                  rows={4}
                  className="w-full bg-[#0A0A0A] border border-[#2D2D2D] text-[#F5F5F0] font-ibm-mono text-[12px] px-4 py-3 focus:outline-none focus:border-[#D6E264] transition-colors placeholder:text-[#444] resize-none"
                />
              </div>
              <div>
                <label className="font-ibm-mono text-[10px] text-[#888] tracking-[2px] block mb-2">RELATED ENGAGEMENT</label>
                <select
                  value={form.engagement}
                  onChange={(e) => setForm({ ...form, engagement: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-[#2D2D2D] text-[#F5F5F0] font-ibm-mono text-[12px] px-4 py-3 focus:outline-none focus:border-[#D6E264] transition-colors"
                >
                  <option value="">Select engagement</option>
                  <option>Brand & Website Package</option>
                  <option>Social Media Management</option>
                </select>
              </div>
              <div>
                <label className="font-ibm-mono text-[10px] text-[#888] tracking-[2px] block mb-2">PRIORITY</label>
                <div className="flex gap-2">
                  {(["Low", "Medium", "High"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setForm({ ...form, priority: p })}
                      className="flex-1 py-2 font-ibm-mono text-[10px] tracking-[1px] border transition-colors cursor-pointer"
                      style={{
                        background: form.priority === p ? priorityColors[p] + "20" : "transparent",
                        borderColor: form.priority === p ? priorityColors[p] : "#2D2D2D",
                        color: form.priority === p ? priorityColors[p] : "#555",
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
                  className="flex-1 py-3 border border-[#2D2D2D] font-ibm-mono text-[10px] text-[#666] tracking-[2px] hover:text-[#AAAAAA] transition-colors cursor-pointer bg-transparent"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => setShowNew(false)}
                  className="flex-1 py-3 bg-[#D6E264] hover:bg-[#c9d64f] font-ibm-mono text-[10px] text-[#0A0A0A] tracking-[2px] transition-colors cursor-pointer border-none font-bold"
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
