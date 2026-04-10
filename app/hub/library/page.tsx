"use client";

import { useState } from "react";

const items = [
  { id: "LIB-012", name: "Proposal Template — LAUNCH", type: "Template", category: "Sales", access: "All", updatedBy: "Rohith M.", date: "07 Apr 2026" },
  { id: "LIB-011", name: "Proposal Template — GROW", type: "Template", category: "Sales", access: "All", updatedBy: "Rohith M.", date: "07 Apr 2026" },
  { id: "LIB-010", name: "Proposal Template — BUILD", type: "Template", category: "Sales", access: "All", updatedBy: "Rohith M.", date: "06 Apr 2026" },
  { id: "LIB-009", name: "Partner Commission Rate Card", type: "Reference", category: "Partners", access: "Partners", updatedBy: "Rohith M.", date: "01 Apr 2026" },
  { id: "LIB-008", name: "Brand Questionnaire", type: "Form", category: "LAUNCH", access: "All", updatedBy: "Priya K.", date: "28 Mar 2026" },
  { id: "LIB-007", name: "Social Media Audit Template", type: "Template", category: "GROW", access: "All", updatedBy: "Aisha B.", date: "25 Mar 2026" },
  { id: "LIB-006", name: "Technical Discovery Questions", type: "Form", category: "BUILD", access: "All", updatedBy: "Rohith M.", date: "20 Mar 2026" },
  { id: "LIB-005", name: "NDA Template", type: "Legal", category: "Legal", access: "Admin", updatedBy: "Rohith M.", date: "10 Mar 2026" },
  { id: "LIB-004", name: "SoW Template — Retainer", type: "Legal", category: "Legal", access: "Admin", updatedBy: "Rohith M.", date: "05 Mar 2026" },
  { id: "LIB-003", name: "Case Study — Progrize", type: "Marketing", category: "Marketing", access: "All", updatedBy: "Priya K.", date: "01 Mar 2026" },
  { id: "LIB-002", name: "Case Study — Track Taxi", type: "Marketing", category: "Marketing", access: "All", updatedBy: "Priya K.", date: "01 Mar 2026" },
  { id: "LIB-001", name: "Brand Guidelines — Vazgro", type: "Brand", category: "Internal", access: "Internal", updatedBy: "Priya K.", date: "01 Feb 2026" },
];

const categories = ["All", "Sales", "LAUNCH", "GROW", "BUILD", "Partners", "Legal", "Marketing", "Internal"];

const typeColors: Record<string, string> = {
  Template: "#D6E264",
  Reference: "#888",
  Form: "#FF6B35",
  Legal: "#FFFFFF",
  Marketing: "#D6E264",
  Brand: "#D6E264",
};

export default function LibraryPage() {
  const [catFilter, setCatFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = items.filter((i) => {
    const catOk = catFilter === "All" || i.category === catFilter;
    const searchOk = !search || i.name.toLowerCase().includes(search.toLowerCase());
    return catOk && searchOk;
  });

  return (
    <div className="p-8">
      <div className="mb-8 border-b border-[#1D1D1D] pb-6 flex items-end justify-between">
        <div>
          <span className="font-ibm-mono text-[10px] text-[#D6E264] tracking-[3px]">// LIBRARY</span>
          <h1 className="font-grotesk text-[32px] font-bold text-[#F5F5F0] tracking-[-1px] mt-1">Asset Library</h1>
          <p className="font-ibm-mono text-[12px] text-[#888] tracking-[0.5px] mt-1">Templates, forms, legal docs, and case studies.</p>
        </div>
        <button className="px-5 py-2.5 bg-[#D6E264] hover:bg-[#c9d64f] font-ibm-mono text-[10px] text-[#0A0A0A] tracking-[2px] transition-colors cursor-pointer border-none">
          + UPLOAD ASSET
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search library..."
          className="bg-[#0F0F0F] border border-[#2D2D2D] text-[#F5F5F0] font-ibm-mono text-[12px] px-4 py-2 focus:outline-none focus:border-[#D6E264] transition-colors placeholder:text-[#444] w-64"
        />
        <div className="flex border border-[#1D1D1D] flex-wrap">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className="px-3 py-2 font-ibm-mono text-[9px] tracking-[1px] transition-colors cursor-pointer border-none border-r border-[#1D1D1D] last:border-r-0"
              style={{ background: catFilter === c ? "#D6E264" : "#111", color: catFilter === c ? "#0A0A0A" : "#666" }}
            >
              {c.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-[#1D1D1D] bg-[#0F0F0F]">
        <div className="grid grid-cols-[80px_1fr_100px_100px_80px_100px_80px] gap-4 px-5 py-3 border-b border-[#1D1D1D]">
          {["ID", "Name", "Type", "Category", "Access", "Updated", ""].map((h) => (
            <span key={h} className="font-ibm-mono text-[9px] text-[#555] tracking-[2px]">{h}</span>
          ))}
        </div>
        {filtered.map((item) => (
          <div key={item.id} className="grid grid-cols-[80px_1fr_100px_100px_80px_100px_80px] gap-4 px-5 py-4 border-b border-[#1D1D1D] hover:bg-[#111] transition-colors items-center">
            <span className="font-ibm-mono text-[10px] text-[#555]">{item.id}</span>
            <span className="font-ibm-mono text-[11px] text-[#CCCCCC]">{item.name}</span>
            <span className="font-ibm-mono text-[10px]" style={{ color: typeColors[item.type] ?? "#888" }}>{item.type}</span>
            <span className="font-ibm-mono text-[10px] text-[#777]">{item.category}</span>
            <span className="font-ibm-mono text-[10px] text-[#666]">{item.access}</span>
            <div>
              <p className="font-ibm-mono text-[10px] text-[#666]">{item.date}</p>
              <p className="font-ibm-mono text-[9px] text-[#444] mt-0.5">{item.updatedBy}</p>
            </div>
            <button className="font-ibm-mono text-[9px] text-[#D6E264] hover:opacity-80 cursor-pointer bg-transparent border-none tracking-[1px]">
              ↓ USE
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
