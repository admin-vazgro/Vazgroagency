"use client";

import { useState } from "react";

type LibraryItem = {
  id: string;
  name: string;
  type: string;
  category: string;
  access: "hub-only" | "partners" | "all";
  version: string;
  updatedBy: string;
  date: string;
  description?: string;
};

// Placeholder seeded items — replace with Supabase data when storage is configured
const SEED_ITEMS: LibraryItem[] = [
  { id: "LIB-001", name: "LAUNCH Proposal Template", type: "Template", category: "Sales", access: "hub-only", version: "v2.1", updatedBy: "Admin", date: "01/04/2026", description: "Standard LAUNCH proposal with pricing tables and scope sections" },
  { id: "LIB-002", name: "GROW Proposal Template", type: "Template", category: "Sales", access: "hub-only", version: "v1.4", updatedBy: "Admin", date: "01/04/2026", description: "Recurring retainer proposal with GROW taper explanation" },
  { id: "LIB-003", name: "BUILD Proposal Template", type: "Template", category: "Sales", access: "hub-only", version: "v1.0", updatedBy: "Admin", date: "01/04/2026", description: "Custom build scoping document and delivery timeline" },
  { id: "LIB-004", name: "Partner Commission Guide", type: "Reference", category: "Partners", access: "partners", version: "v1.2", updatedBy: "Admin", date: "10/03/2026", description: "Full breakdown of tier rates, taper rules, and payout schedule" },
  { id: "LIB-005", name: "Partner Onboarding Pack", type: "Marketing", category: "Partners", access: "partners", version: "v1.0", updatedBy: "Admin", date: "10/03/2026", description: "Welcome pack with brand assets, links, and talking points" },
  { id: "LIB-006", name: "Master Services Agreement", type: "Legal", category: "Legal", access: "hub-only", version: "v3.0", updatedBy: "Admin", date: "01/01/2026", description: "Standard MSA for all client engagements" },
  { id: "LIB-007", name: "NDA Template", type: "Legal", category: "Legal", access: "hub-only", version: "v2.0", updatedBy: "Admin", date: "01/01/2026", description: "Mutual NDA for prospect and partner conversations" },
  { id: "LIB-008", name: "Vazgro Pitch Deck", type: "Marketing", category: "Marketing", access: "hub-only", version: "v4.2", updatedBy: "Admin", date: "15/03/2026", description: "Main sales pitch deck — 18 slides" },
  { id: "LIB-009", name: "Case Study: E-commerce Redesign", type: "Reference", category: "LAUNCH", access: "all", version: "v1.0", updatedBy: "Admin", date: "20/03/2026", description: "Client anonymised. 3× conversion uplift." },
  { id: "LIB-010", name: "Case Study: SEO Growth", type: "Reference", category: "GROW", access: "all", version: "v1.0", updatedBy: "Admin", date: "20/03/2026", description: "6-month organic traffic growth case study" },
  { id: "LIB-011", name: "Objection Handling Guide", type: "Reference", category: "Sales", access: "hub-only", version: "v1.3", updatedBy: "Admin", date: "25/03/2026", description: "Top 12 objections and recommended responses" },
  { id: "LIB-012", name: "Statement of Work Template", type: "Template", category: "BUILD", access: "hub-only", version: "v2.1", updatedBy: "Admin", date: "01/04/2026", description: "SOW for custom development projects" },
];

const CATEGORY_DEFINITIONS = [
  { key: "Sales", icon: "◈", desc: "Proposal templates, pitch decks, objection guides", scope: "Hub only" },
  { key: "Partners", icon: "◎", desc: "Commission guides, onboarding packs, talking points", scope: "Partners" },
  { key: "LAUNCH", icon: "▲", desc: "Case studies and reference materials for launch projects", scope: "Public" },
  { key: "GROW", icon: "●", desc: "Retainer case studies and growth frameworks", scope: "Public" },
  { key: "BUILD", icon: "■", desc: "SOW templates and technical reference docs", scope: "Hub only" },
  { key: "Legal", icon: "⊞", desc: "MSA, NDAs, and contract templates", scope: "Hub only" },
  { key: "Marketing", icon: "◐", desc: "Pitch decks, one-pagers, and brand collateral", scope: "Hub only" },
  { key: "Internal", icon: "◫", desc: "Process docs, playbooks, and internal guides", scope: "Hub only" },
];

const ACCESS_LABELS: Record<string, { label: string; color: string }> = {
  "hub-only": { label: "HUB ONLY", color: "var(--portal-warning)" },
  partners: { label: "PARTNERS", color: "var(--portal-accent)" },
  all: { label: "PUBLIC", color: "var(--portal-text-soft)" },
};

const TYPE_COLORS: Record<string, string> = {
  Template: "var(--portal-accent)",
  Reference: "var(--portal-text-soft)",
  Legal: "var(--portal-warning)",
  Marketing: "var(--portal-accent)",
};

const ALL_CATEGORIES = ["All", ...CATEGORY_DEFINITIONS.map((c) => c.key)];

export default function LibraryPage() {
  const [catFilter, setCatFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = SEED_ITEMS.filter((i) => {
    const catOk = catFilter === "All" || i.category === catFilter;
    const searchOk = !search || i.name.toLowerCase().includes(search.toLowerCase()) || (i.description ?? "").toLowerCase().includes(search.toLowerCase());
    return catOk && searchOk;
  });

  const countByCategory = (key: string) => SEED_ITEMS.filter((i) => i.category === key).length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 border-b border-[var(--portal-border)] pb-6 flex items-end justify-between">
        <div>
          <span className="font-ibm-mono text-[14px] text-[var(--portal-accent)] tracking-[3px]">// SALES ENABLEMENT HUB</span>
          <h1 className="font-grotesk text-[32px] font-normal text-[var(--portal-text)] tracking-[-1px] mt-1">Library</h1>
          <p className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)] tracking-[0.5px] mt-1">
            Templates, proposals, case studies, and reference materials for your team and partners.
          </p>
        </div>
        <button className="px-5 py-2.5 bg-[var(--portal-accent)] hover:bg-[var(--portal-accent-hover)] font-ibm-mono text-[14px] text-[var(--portal-accent-contrast)] tracking-[2px] transition-colors cursor-pointer border-none">
          + UPLOAD ASSET
        </button>
      </div>

      {/* Category cards */}
      <div className="grid grid-cols-2 gap-3 mb-8 lg:grid-cols-4">
        {CATEGORY_DEFINITIONS.map((cat) => {
          const count = countByCategory(cat.key);
          const isActive = catFilter === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setCatFilter(isActive ? "All" : cat.key)}
              className="text-left border p-4 transition-colors cursor-pointer bg-[var(--portal-surface)]"
              style={{ borderColor: isActive ? "var(--portal-accent)" : "var(--portal-border)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-ibm-mono text-[16px]" style={{ color: isActive ? "var(--portal-accent)" : "var(--portal-text-dim)" }}>
                  {cat.icon}
                </span>
                <span className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">{count} items</span>
              </div>
              <p className="font-grotesk text-[14px] font-normal text-[var(--portal-text)]">{cat.key}</p>
              <p className="mt-1 font-ibm-mono text-[14px] text-[var(--portal-text-dim)] leading-[1.5]">{cat.desc}</p>
              <p className="mt-2 font-ibm-mono text-[14px]" style={{ color: isActive ? "var(--portal-accent)" : "var(--portal-text-dim)" }}>
                {cat.scope.toUpperCase()}
              </p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search assets..."
          className="bg-[var(--portal-surface)] border border-[var(--portal-border-strong)] text-[var(--portal-text)] font-ibm-mono text-[14px] px-4 py-2 focus:outline-none focus:border-[var(--portal-accent)] transition-colors placeholder:text-[var(--portal-text-dim)] w-56"
        />
        <div className="flex border border-[var(--portal-border)] overflow-hidden">
          {ALL_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className="px-3 py-2 font-ibm-mono text-[14px] tracking-[1px] transition-colors cursor-pointer border-none border-r border-[var(--portal-border)] last:border-r-0"
              style={{
                background: catFilter === c ? "var(--portal-accent)" : "var(--portal-surface-alt)",
                color: catFilter === c ? "var(--portal-accent-contrast)" : "var(--portal-text-muted)",
              }}
            >
              {c.toUpperCase()}
            </button>
          ))}
        </div>
        {(catFilter !== "All" || search) && (
          <button
            onClick={() => { setCatFilter("All"); setSearch(""); }}
            className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)] hover:text-[var(--portal-text-soft)] cursor-pointer bg-transparent border-none"
          >
            CLEAR FILTERS ×
          </button>
        )}
      </div>

      {/* Assets table */}
      <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
        <div className="grid grid-cols-[72px_1fr_90px_90px_80px_72px_80px] gap-3 px-5 py-3 border-b border-[var(--portal-border)]">
          {["ID", "Name", "Type", "Category", "Access", "Ver.", ""].map((h) => (
            <span key={h} className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)] tracking-[2px]">{h}</span>
          ))}
        </div>
        {filtered.map((item) => {
          const access = ACCESS_LABELS[item.access] ?? { label: item.access.toUpperCase(), color: "var(--portal-text-soft)" };
          return (
            <div
              key={item.id}
              className="grid grid-cols-[72px_1fr_90px_90px_80px_72px_80px] gap-3 px-5 py-4 border-b border-[var(--portal-border)] hover:bg-[var(--portal-surface-alt)] transition-colors items-start last:border-b-0"
            >
              <span className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)] pt-0.5">{item.id}</span>
              <div>
                <p className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)]">{item.name}</p>
                {item.description && (
                  <p className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)] mt-0.5 leading-[1.5]">{item.description}</p>
                )}
              </div>
              <span className="font-ibm-mono text-[14px] pt-0.5" style={{ color: TYPE_COLORS[item.type] ?? "var(--portal-text-soft)" }}>
                {item.type.toUpperCase()}
              </span>
              <span className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)] pt-0.5">{item.category.toUpperCase()}</span>
              <span className="font-ibm-mono text-[14px] pt-0.5" style={{ color: access.color }}>{access.label}</span>
              <span className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)] pt-0.5">{item.version}</span>
              <button className="font-ibm-mono text-[14px] text-[var(--portal-accent)] hover:opacity-80 cursor-pointer bg-transparent border-none tracking-[1px] text-left pt-0.5">
                ↓ USE
              </button>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="px-5 py-12">
            <p className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">
              {search ? `No assets matching "${search}".` : "No assets in this category."}
            </p>
            <p className="mt-1 font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">
              Upload assets using the button above or adjust your filters.
            </p>
          </div>
        )}
      </div>

      {/* Access scope legend */}
      <div className="mt-6 border border-[var(--portal-border)] bg-[var(--portal-surface)] px-5 py-4">
        <p className="font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-dim)] mb-3">ACCESS SCOPE</p>
        <div className="flex flex-wrap gap-6">
          {Object.entries(ACCESS_LABELS).map(([, { label, color }]) => (
            <div key={label} className="flex items-center gap-2">
              <span className="font-ibm-mono text-[14px]" style={{ color }}>{label}</span>
              <span className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">
                {label === "HUB ONLY" ? "Visible only to Vazgro hub staff" : label === "PARTNERS" ? "Visible to hub staff and active partners" : "Visible to all (clients and public)"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
