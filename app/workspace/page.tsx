"use client";

import Link from "next/link";

const engagements = [
  {
    id: "eng-001",
    pillar: "LAUNCH",
    name: "Brand & Website Package",
    status: "In Progress",
    progress: 65,
    nextMilestone: "Logo concepts delivery",
    dueDate: "14 Apr 2026",
    color: "#D6E264",
  },
  {
    id: "eng-002",
    pillar: "GROW",
    name: "Social Media Management",
    status: "Active",
    progress: 40,
    nextMilestone: "Month 2 content calendar",
    dueDate: "30 Apr 2026",
    color: "#FF6B35",
  },
];

const recentDeliverables = [
  { name: "Brand Strategy Document", date: "08 Apr 2026", type: "PDF", status: "Awaiting approval" },
  { name: "Moodboard v1", date: "06 Apr 2026", type: "Figma", status: "Approved" },
  { name: "Discovery call notes", date: "02 Apr 2026", type: "Doc", status: "Approved" },
];

const recentRequests = [
  { id: "REQ-004", title: "Need to update brand colour palette", status: "In Review", date: "09 Apr 2026" },
  { id: "REQ-003", title: "Add Instagram Reel to deliverables", status: "Open", date: "07 Apr 2026" },
];

export default function WorkspaceDashboard() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 border-b border-[#1D1D1D] pb-6">
        <span className="font-ibm-mono text-[10px] text-[#D6E264] tracking-[3px]">// YOUR WORKSPACE</span>
        <h1 className="font-grotesk text-[32px] font-bold text-[#F5F5F0] tracking-[-1px] mt-1">Good morning.</h1>
        <p className="font-ibm-mono text-[12px] text-[#888] tracking-[0.5px] mt-1">
          You have <span className="text-[#F5F5F0]">2 active engagements</span> and <span className="text-[#FF6B35]">1 item awaiting your approval</span>.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Engagements", value: "2", note: "1 LAUNCH · 1 GROW" },
          { label: "Open Requests", value: "2", note: "0 urgent" },
          { label: "Pending Approvals", value: "1", note: "File awaiting sign-off" },
          { label: "Invoices Due", value: "£0", note: "All paid" },
        ].map(({ label, value, note }) => (
          <div key={label} className="border border-[#1D1D1D] bg-[#0F0F0F] p-5">
            <p className="font-ibm-mono text-[10px] text-[#666] tracking-[1px] mb-2">{label.toUpperCase()}</p>
            <p className="font-grotesk text-[28px] font-bold text-[#F5F5F0]">{value}</p>
            <p className="font-ibm-mono text-[10px] text-[#555] tracking-[0.5px] mt-1">{note}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Active Engagements */}
        <div className="border border-[#1D1D1D] bg-[#0F0F0F]">
          <div className="px-6 py-4 border-b border-[#1D1D1D] flex items-center justify-between">
            <span className="font-ibm-mono text-[10px] text-[#AAAAAA] tracking-[2px]">ACTIVE ENGAGEMENTS</span>
            <Link href="/workspace/engagements" className="font-ibm-mono text-[10px] text-[#D6E264] tracking-[1px] hover:opacity-80">VIEW ALL →</Link>
          </div>
          <div className="p-4 flex flex-col gap-3">
            {engagements.map((eng) => (
              <Link key={eng.id} href={`/workspace/engagements/${eng.id}`} className="block p-4 border border-[#1D1D1D] hover:border-[#2D2D2D] transition-colors bg-[#0A0A0A]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-ibm-mono text-[9px] tracking-[2px] px-2 py-1" style={{ background: eng.color + "20", color: eng.color }}>
                    {eng.pillar}
                  </span>
                  <span className="font-ibm-mono text-[9px] text-[#666] tracking-[1px]">{eng.status.toUpperCase()}</span>
                </div>
                <p className="font-grotesk text-[14px] font-bold text-[#F5F5F0] mb-3">{eng.name}</p>
                {/* Progress bar */}
                <div className="w-full bg-[#1D1D1D] h-1 mb-2">
                  <div className="h-1 transition-all" style={{ width: `${eng.progress}%`, background: eng.color }} />
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-ibm-mono text-[10px] text-[#777]">Next: {eng.nextMilestone}</p>
                  <p className="font-ibm-mono text-[10px] text-[#555]">{eng.dueDate}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="flex flex-col gap-6">
          {/* Recent deliverables */}
          <div className="border border-[#1D1D1D] bg-[#0F0F0F]">
            <div className="px-6 py-4 border-b border-[#1D1D1D] flex items-center justify-between">
              <span className="font-ibm-mono text-[10px] text-[#AAAAAA] tracking-[2px]">RECENT DELIVERABLES</span>
              <Link href="/workspace/files" className="font-ibm-mono text-[10px] text-[#D6E264] tracking-[1px] hover:opacity-80">VIEW ALL →</Link>
            </div>
            <div className="divide-y divide-[#1D1D1D]">
              {recentDeliverables.map((d) => (
                <div key={d.name} className="px-6 py-3 flex items-center justify-between">
                  <div>
                    <p className="font-ibm-mono text-[11px] text-[#CCCCCC]">{d.name}</p>
                    <p className="font-ibm-mono text-[10px] text-[#555] mt-0.5">{d.type} · {d.date}</p>
                  </div>
                  <span
                    className="font-ibm-mono text-[9px] tracking-[1px] px-2 py-1"
                    style={{
                      background: d.status === "Approved" ? "#D6E26420" : "#FF6B3520",
                      color: d.status === "Approved" ? "#D6E264" : "#FF6B35",
                    }}
                  >
                    {d.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent requests */}
          <div className="border border-[#1D1D1D] bg-[#0F0F0F]">
            <div className="px-6 py-4 border-b border-[#1D1D1D] flex items-center justify-between">
              <span className="font-ibm-mono text-[10px] text-[#AAAAAA] tracking-[2px]">RECENT REQUESTS</span>
              <Link href="/workspace/requests" className="font-ibm-mono text-[10px] text-[#D6E264] tracking-[1px] hover:opacity-80">VIEW ALL →</Link>
            </div>
            <div className="divide-y divide-[#1D1D1D]">
              {recentRequests.map((r) => (
                <div key={r.id} className="px-6 py-3 flex items-center justify-between">
                  <div>
                    <p className="font-ibm-mono text-[11px] text-[#CCCCCC]">{r.title}</p>
                    <p className="font-ibm-mono text-[10px] text-[#555] mt-0.5">{r.id} · {r.date}</p>
                  </div>
                  <span
                    className="font-ibm-mono text-[9px] tracking-[1px] px-2 py-1"
                    style={{
                      background: r.status === "In Review" ? "#D6E26420" : "#FFFFFF10",
                      color: r.status === "In Review" ? "#D6E264" : "#888",
                    }}
                  >
                    {r.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
