"use client";

import { useState } from "react";

const items: Array<{ id: string; name: string; type: string; category: string; access: string; updatedBy: string; date: string }> = [];

const categories = ["All", "Sales", "LAUNCH", "GROW", "BUILD", "Partners", "Legal", "Marketing", "Internal"];

const typeColors: Record<string, string> = {
  Template: "var(--portal-accent)",
  Reference: "var(--portal-text-soft)",
  Form: "var(--portal-warning)",
  Legal: "var(--portal-text)",
  Marketing: "var(--portal-accent)",
  Brand: "var(--portal-accent)",
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
      <div className="mb-8 border-b border-[var(--portal-border)] pb-6 flex items-end justify-between">
        <div>
          <span className="font-ibm-mono text-[10px] text-[var(--portal-accent)] tracking-[3px]">// LIBRARY</span>
          <h1 className="font-grotesk text-[32px] font-bold text-[var(--portal-text)] tracking-[-1px] mt-1">Asset Library</h1>
          <p className="font-ibm-mono text-[12px] text-[var(--portal-text-soft)] tracking-[0.5px] mt-1">Templates, forms, legal docs, and case studies.</p>
        </div>
        <button className="px-5 py-2.5 bg-[var(--portal-accent)] hover:bg-[var(--portal-accent-hover)] font-ibm-mono text-[10px] text-[var(--portal-accent-contrast)] tracking-[2px] transition-colors cursor-pointer border-none">
          + UPLOAD ASSET
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search library..."
          className="bg-[var(--portal-surface)] border border-[var(--portal-border-strong)] text-[var(--portal-text)] font-ibm-mono text-[12px] px-4 py-2 focus:outline-none focus:border-[var(--portal-accent)] transition-colors placeholder:text-[var(--portal-text-faint)] w-64"
        />
        <div className="flex border border-[var(--portal-border)] flex-wrap">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className="px-3 py-2 font-ibm-mono text-[9px] tracking-[1px] transition-colors cursor-pointer border-none border-r border-[var(--portal-border)] last:border-r-0"
              style={{ background: catFilter === c ? "var(--portal-accent)" : "var(--portal-surface-alt)", color: catFilter === c ? "var(--portal-accent-contrast)" : "var(--portal-text-muted)" }}
            >
              {c.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
        <div className="grid grid-cols-[80px_1fr_100px_100px_80px_100px_80px] gap-4 px-5 py-3 border-b border-[var(--portal-border)]">
          {["ID", "Name", "Type", "Category", "Access", "Updated", ""].map((h) => (
            <span key={h} className="font-ibm-mono text-[9px] text-[var(--portal-text-dim)] tracking-[2px]">{h}</span>
          ))}
        </div>
        {filtered.map((item) => (
          <div key={item.id} className="grid grid-cols-[80px_1fr_100px_100px_80px_100px_80px] gap-4 px-5 py-4 border-b border-[var(--portal-border)] hover:bg-[var(--portal-surface-alt)] transition-colors items-center">
            <span className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">{item.id}</span>
            <span className="font-ibm-mono text-[11px] text-[var(--portal-text-muted)]">{item.name}</span>
            <span className="font-ibm-mono text-[10px]" style={{ color: typeColors[item.type] ?? "var(--portal-text-soft)" }}>{item.type}</span>
            <span className="font-ibm-mono text-[10px] text-[var(--portal-text-soft)]">{item.category}</span>
            <span className="font-ibm-mono text-[10px] text-[var(--portal-text-muted)]">{item.access}</span>
            <div>
              <p className="font-ibm-mono text-[10px] text-[var(--portal-text-muted)]">{item.date}</p>
              <p className="font-ibm-mono text-[9px] text-[var(--portal-text-faint)] mt-0.5">{item.updatedBy}</p>
            </div>
            <button className="font-ibm-mono text-[9px] text-[var(--portal-accent)] hover:opacity-80 cursor-pointer bg-transparent border-none tracking-[1px]">
              ↓ USE
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="px-5 py-12">
            <p className="font-ibm-mono text-[11px] text-[var(--portal-text-soft)]">No library assets yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
