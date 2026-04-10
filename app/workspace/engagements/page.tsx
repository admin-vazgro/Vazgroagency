"use client";

import Link from "next/link";

const engagements = [
  {
    id: "eng-001",
    pillar: "LAUNCH",
    name: "Brand & Website Package",
    package: "Full Brand Identity + Website",
    status: "In Progress",
    progress: 65,
    startDate: "10 Mar 2026",
    expectedEnd: "10 May 2026",
    nextMilestone: "Logo concepts delivery",
    milestoneDue: "14 Apr 2026",
    color: "#D6E264",
    team: ["Rohith M.", "Priya K."],
    milestones: [
      { name: "Discovery & Strategy", status: "done", date: "18 Mar 2026" },
      { name: "Brand Guidelines", status: "done", date: "28 Mar 2026" },
      { name: "Logo Concepts", status: "active", date: "14 Apr 2026" },
      { name: "Website Design", status: "pending", date: "28 Apr 2026" },
      { name: "Website Development", status: "pending", date: "05 May 2026" },
      { name: "Launch", status: "pending", date: "10 May 2026" },
    ],
  },
  {
    id: "eng-002",
    pillar: "GROW",
    name: "Social Media Management",
    package: "Social Pro — £699/mo",
    status: "Active",
    progress: 40,
    startDate: "01 Mar 2026",
    expectedEnd: "28 Feb 2027",
    nextMilestone: "Month 2 content calendar",
    milestoneDue: "30 Apr 2026",
    color: "#FF6B35",
    team: ["Aisha B.", "Tom W."],
    milestones: [
      { name: "Onboarding & audit", status: "done", date: "07 Mar 2026" },
      { name: "Month 1 content", status: "done", date: "31 Mar 2026" },
      { name: "Month 2 content calendar", status: "active", date: "30 Apr 2026" },
      { name: "Month 3 content calendar", status: "pending", date: "31 May 2026" },
    ],
  },
];

export default function EngagementsPage() {
  return (
    <div className="p-8">
      <div className="mb-8 border-b border-[#1D1D1D] pb-6">
        <span className="font-ibm-mono text-[10px] text-[#D6E264] tracking-[3px]">// ENGAGEMENTS</span>
        <h1 className="font-grotesk text-[32px] font-bold text-[#F5F5F0] tracking-[-1px] mt-1">Your Projects</h1>
        <p className="font-ibm-mono text-[12px] text-[#888] tracking-[0.5px] mt-1">Track progress, milestones, and team across all active engagements.</p>
      </div>

      <div className="flex flex-col gap-6">
        {engagements.map((eng) => (
          <div key={eng.id} className="border border-[#1D1D1D] bg-[#0F0F0F]">
            {/* Header */}
            <div className="px-6 py-5 border-b border-[#1D1D1D] flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-ibm-mono text-[9px] tracking-[2px] px-2 py-1" style={{ background: eng.color + "20", color: eng.color }}>
                    {eng.pillar}
                  </span>
                  <span className="font-ibm-mono text-[9px] text-[#777] tracking-[1px]">{eng.id}</span>
                </div>
                <h2 className="font-grotesk text-[20px] font-bold text-[#F5F5F0]">{eng.name}</h2>
                <p className="font-ibm-mono text-[11px] text-[#888] mt-1">{eng.package}</p>
              </div>
              <div className="text-right">
                <p className="font-ibm-mono text-[10px] text-[#666] tracking-[1px]">TEAM</p>
                <div className="flex items-center gap-2 mt-1 justify-end">
                  {eng.team.map((name) => (
                    <span key={name} className="font-ibm-mono text-[10px] text-[#AAAAAA] bg-[#1A1A1A] px-2 py-1">{name}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 grid grid-cols-3 gap-6">
              {/* Progress */}
              <div className="col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-ibm-mono text-[10px] text-[#666] tracking-[1px]">OVERALL PROGRESS</p>
                  <p className="font-ibm-mono text-[12px] font-bold" style={{ color: eng.color }}>{eng.progress}%</p>
                </div>
                <div className="w-full bg-[#1D1D1D] h-2 mb-6">
                  <div className="h-2 transition-all" style={{ width: `${eng.progress}%`, background: eng.color }} />
                </div>

                {/* Milestones */}
                <p className="font-ibm-mono text-[10px] text-[#666] tracking-[1px] mb-3">MILESTONES</p>
                <div className="flex flex-col gap-2">
                  {eng.milestones.map((m, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 flex items-center justify-center text-[10px] shrink-0"
                        style={{
                          background: m.status === "done" ? eng.color : m.status === "active" ? eng.color + "30" : "#1D1D1D",
                          color: m.status === "done" ? "#0A0A0A" : eng.color,
                          border: m.status === "active" ? `1px solid ${eng.color}` : "none",
                        }}
                      >
                        {m.status === "done" ? "✓" : m.status === "active" ? "▶" : ""}
                      </div>
                      <span
                        className="font-ibm-mono text-[11px] flex-1"
                        style={{ color: m.status === "done" ? "#666" : m.status === "active" ? "#F5F5F0" : "#555" }}
                      >
                        {m.name}
                      </span>
                      <span className="font-ibm-mono text-[10px] text-[#555]">{m.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meta */}
              <div className="flex flex-col gap-4">
                <div className="border border-[#1D1D1D] p-4 bg-[#0A0A0A]">
                  <p className="font-ibm-mono text-[10px] text-[#666] tracking-[1px] mb-1">NEXT MILESTONE</p>
                  <p className="font-ibm-mono text-[12px] text-[#F5F5F0]">{eng.nextMilestone}</p>
                  <p className="font-ibm-mono text-[10px] mt-1" style={{ color: eng.color }}>Due {eng.milestoneDue}</p>
                </div>
                <div className="border border-[#1D1D1D] p-4 bg-[#0A0A0A]">
                  <p className="font-ibm-mono text-[10px] text-[#666] tracking-[1px] mb-2">TIMELINE</p>
                  <p className="font-ibm-mono text-[10px] text-[#888]">Started: <span className="text-[#CCCCCC]">{eng.startDate}</span></p>
                  <p className="font-ibm-mono text-[10px] text-[#888] mt-1">Expected: <span className="text-[#CCCCCC]">{eng.expectedEnd}</span></p>
                </div>
                <Link
                  href={`/workspace/requests?engagement=${eng.id}`}
                  className="border border-[#D6E264] px-4 py-2.5 text-center font-ibm-mono text-[10px] text-[#D6E264] tracking-[1px] hover:bg-[#D6E26415] transition-colors"
                >
                  RAISE A REQUEST →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
