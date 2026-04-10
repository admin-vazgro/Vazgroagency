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

const deliverables: Deliverable[] = [
  { id: "d-008", name: "Brand Strategy Document v2", type: "PDF", engagement: "Brand & Website Package", pillar: "LAUNCH", status: "Awaiting approval", uploadedBy: "Rohith M.", date: "08 Apr 2026", size: "2.4 MB" },
  { id: "d-007", name: "Moodboard v1", type: "Figma", engagement: "Brand & Website Package", pillar: "LAUNCH", status: "Approved", uploadedBy: "Priya K.", date: "06 Apr 2026", size: "—" },
  { id: "d-006", name: "Month 2 Content Plan", type: "PDF", engagement: "Social Media Management", pillar: "GROW", status: "Awaiting approval", uploadedBy: "Aisha B.", date: "05 Apr 2026", size: "1.1 MB" },
  { id: "d-005", name: "Discovery Call Notes", type: "Doc", engagement: "Brand & Website Package", pillar: "LAUNCH", status: "Approved", uploadedBy: "Rohith M.", date: "02 Apr 2026", size: "420 KB" },
  { id: "d-004", name: "Competitor Analysis", type: "PDF", engagement: "Brand & Website Package", pillar: "LAUNCH", status: "Approved", uploadedBy: "Priya K.", date: "28 Mar 2026", size: "3.2 MB" },
  { id: "d-003", name: "Month 1 Content Calendar", type: "Spreadsheet", engagement: "Social Media Management", pillar: "GROW", status: "Approved", uploadedBy: "Aisha B.", date: "25 Mar 2026", size: "890 KB" },
  { id: "d-002", name: "Social Audit Report", type: "PDF", engagement: "Social Media Management", pillar: "GROW", status: "Revision requested", uploadedBy: "Tom W.", date: "10 Mar 2026", size: "1.8 MB" },
  { id: "d-001", name: "Client Brief", type: "Doc", engagement: "Brand & Website Package", pillar: "LAUNCH", status: "Approved", uploadedBy: "Rohith M.", date: "10 Mar 2026", size: "210 KB" },
];

const statusColors = {
  "Awaiting approval": { bg: "#FF6B3520", text: "#FF6B35" },
  Approved: { bg: "#D6E26420", text: "#D6E264" },
  "Revision requested": { bg: "#FFFFFF10", text: "#888" },
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
      <div className="mb-8 border-b border-[#1D1D1D] pb-6">
        <span className="font-ibm-mono text-[10px] text-[#D6E264] tracking-[3px]">// FILES & DELIVERABLES</span>
        <h1 className="font-grotesk text-[32px] font-bold text-[#F5F5F0] tracking-[-1px] mt-1">Files</h1>
        {pending > 0 && (
          <p className="font-ibm-mono text-[12px] mt-1">
            <span className="text-[#FF6B35]">{pending} file{pending !== 1 ? "s" : ""} awaiting your approval.</span>{" "}
            <span className="text-[#666]">Review and approve or request revisions below.</span>
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex border border-[#1D1D1D]">
          {(["All", "Awaiting approval", "Approved", "Revision requested"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-2 font-ibm-mono text-[10px] tracking-[1px] transition-colors cursor-pointer border-none border-r border-[#1D1D1D] last:border-r-0"
              style={{ background: filter === f ? "#D6E264" : "#111", color: filter === f ? "#0A0A0A" : "#666" }}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex border border-[#1D1D1D]">
          {(["All", "LAUNCH", "GROW", "BUILD"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setPillarFilter(f)}
              className="px-4 py-2 font-ibm-mono text-[10px] tracking-[1px] transition-colors cursor-pointer border-none border-r border-[#1D1D1D] last:border-r-0"
              style={{ background: pillarFilter === f ? "#1A1A0A" : "#111", color: pillarFilter === f ? "#D6E264" : "#666" }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="border border-[#1D1D1D] bg-[#0F0F0F]">
        <div className="grid grid-cols-[32px_1fr_100px_160px_140px_100px_100px] gap-4 px-5 py-3 border-b border-[#1D1D1D]">
          {["", "Name", "Type", "Engagement", "Status", "Uploaded", "Actions"].map((h, i) => (
            <span key={i} className="font-ibm-mono text-[9px] text-[#555] tracking-[2px]">{h}</span>
          ))}
        </div>
        {filtered.map((d) => {
          const sc = statusColors[d.status];
          return (
            <div key={d.id} className="grid grid-cols-[32px_1fr_100px_160px_140px_100px_100px] gap-4 px-5 py-4 border-b border-[#1D1D1D] hover:bg-[#111] transition-colors items-center">
              <span className="font-ibm-mono text-[14px] text-[#444]">{typeIcons[d.type] ?? "◌"}</span>
              <div>
                <p className="font-ibm-mono text-[11px] text-[#CCCCCC]">{d.name}</p>
                <p className="font-ibm-mono text-[10px] text-[#555] mt-0.5">by {d.uploadedBy} · {d.size}</p>
              </div>
              <span className="font-ibm-mono text-[10px] text-[#777]">{d.type}</span>
              <span className="font-ibm-mono text-[10px] text-[#777]">{d.engagement}</span>
              <span className="font-ibm-mono text-[9px] tracking-[1px] px-2 py-1 w-fit" style={{ background: sc.bg, color: sc.text }}>
                {d.status.toUpperCase()}
              </span>
              <span className="font-ibm-mono text-[10px] text-[#555]">{d.date}</span>
              <div className="flex gap-2">
                {d.status === "Awaiting approval" && (
                  <>
                    <button className="font-ibm-mono text-[9px] text-[#D6E264] hover:opacity-80 cursor-pointer bg-transparent border-none tracking-[1px]">APPROVE</button>
                    <button className="font-ibm-mono text-[9px] text-[#888] hover:opacity-80 cursor-pointer bg-transparent border-none tracking-[1px]">REVISE</button>
                  </>
                )}
                {d.status !== "Awaiting approval" && (
                  <button className="font-ibm-mono text-[9px] text-[#555] hover:text-[#888] cursor-pointer bg-transparent border-none tracking-[1px]">VIEW</button>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center">
            <p className="font-ibm-mono text-[12px] text-[#444]">No files match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
