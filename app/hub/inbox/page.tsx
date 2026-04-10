"use client";

import { useState } from "react";

const messages = [
  { id: "msg-008", from: "Alex Chen", company: "Acme Corp", subject: "Logo colour feedback", preview: "We love the direction but wanted to ask about the secondary colour — could we try a warmer option?", time: "2h ago", read: false, type: "client" },
  { id: "msg-007", from: "James H.", company: "Partner", subject: "New lead: Brightly Studio", preview: "Hey, just referred a new potential client — Brightly Studio. They're looking for a full brand package, budget around £1,500.", time: "4h ago", read: false, type: "partner" },
  { id: "msg-006", from: "Sara M.", company: "Partner", subject: "Commission question", preview: "Just wanted to check on the commission for the Pixel & Co deal — should be in the next payout?", time: "6h ago", read: false, type: "partner" },
  { id: "msg-005", from: "Mark Liu", company: "UrbanNest", subject: "Month 2 content approval", preview: "Hi team, we've had a chance to review the Month 2 calendar. A couple of tweaks needed on the Tuesday posts.", time: "1d ago", read: true, type: "client" },
  { id: "msg-004", from: "Priya K.", company: "Internal", subject: "Logo concepts ready for client", preview: "Hey, just finished the 3 logo concepts for Acme. Ready to upload to the client workspace.", time: "1d ago", read: true, type: "internal" },
  { id: "msg-003", from: "Sophie Chen", company: "Nova Analytics", subject: "Project kick-off query", preview: "Looking forward to starting — could you confirm the kick-off meeting time?", time: "2d ago", read: true, type: "client" },
];

const typeColors: Record<string, { bg: string; text: string }> = {
  client: { bg: "#D6E26420", text: "#D6E264" },
  partner: { bg: "#FF6B3520", text: "#FF6B35" },
  internal: { bg: "#FFFFFF10", text: "#888" },
};

export default function InboxPage() {
  const [selected, setSelected] = useState<string | null>("msg-008");
  const [filter, setFilter] = useState("All");

  const filtered = messages.filter((m) => filter === "All" || m.type === filter.toLowerCase());
  const selectedMsg = messages.find((m) => m.id === selected);
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="px-8 py-6 border-b border-[#1D1D1D] flex items-center justify-between shrink-0">
        <div>
          <span className="font-ibm-mono text-[10px] text-[#D6E264] tracking-[3px]">// INBOX</span>
          <h1 className="font-grotesk text-[24px] font-bold text-[#F5F5F0] mt-0.5">Inbox {unread > 0 && <span className="font-ibm-mono text-[14px] text-[#FF6B35] ml-2">{unread}</span>}</h1>
        </div>
        <button className="px-5 py-2 bg-[#D6E264] hover:bg-[#c9d64f] font-ibm-mono text-[10px] text-[#0A0A0A] tracking-[2px] transition-colors cursor-pointer border-none">
          + COMPOSE
        </button>
      </div>

      {/* Filter */}
      <div className="px-8 py-3 border-b border-[#1D1D1D] flex gap-2 shrink-0">
        {["All", "Client", "Partner", "Internal"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 font-ibm-mono text-[9px] tracking-[1px] transition-colors cursor-pointer border border-[#1D1D1D]"
            style={{ background: filter === f ? "#D6E264" : "transparent", color: filter === f ? "#0A0A0A" : "#666" }}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Split pane */}
      <div className="flex flex-1 overflow-hidden">
        {/* Message list */}
        <div className="w-[320px] border-r border-[#1D1D1D] overflow-y-auto shrink-0">
          {filtered.map((msg) => (
            <button
              key={msg.id}
              onClick={() => setSelected(msg.id)}
              className="w-full text-left p-4 border-b border-[#1D1D1D] hover:bg-[#111] transition-colors cursor-pointer border-l-2 block"
              style={{
                background: selected === msg.id ? "#111" : "transparent",
                borderLeftColor: selected === msg.id ? "#D6E264" : "transparent",
              }}
            >
              <div className="flex items-start justify-between mb-1">
                <span className="font-ibm-mono text-[11px] font-bold" style={{ color: msg.read ? "#888" : "#F5F5F0" }}>{msg.from}</span>
                <span className="font-ibm-mono text-[9px] text-[#444]">{msg.time}</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-ibm-mono text-[9px] tracking-[1px] px-1.5 py-0.5" style={{ background: typeColors[msg.type].bg, color: typeColors[msg.type].text }}>
                  {msg.type.toUpperCase()}
                </span>
                <span className="font-ibm-mono text-[10px] text-[#666]">{msg.company}</span>
              </div>
              <p className="font-ibm-mono text-[10px] font-bold" style={{ color: msg.read ? "#666" : "#CCCCCC" }}>{msg.subject}</p>
              <p className="font-ibm-mono text-[10px] text-[#444] mt-1 leading-[1.5] line-clamp-2">{msg.preview}</p>
              {!msg.read && <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] mt-2" />}
            </button>
          ))}
        </div>

        {/* Message view */}
        <div className="flex-1 overflow-y-auto p-8">
          {selectedMsg ? (
            <div>
              <div className="border-b border-[#1D1D1D] pb-5 mb-6">
                <h2 className="font-grotesk text-[22px] font-bold text-[#F5F5F0] mb-3">{selectedMsg.subject}</h2>
                <div className="flex items-center gap-4">
                  <span className="font-ibm-mono text-[11px] text-[#CCCCCC]">{selectedMsg.from}</span>
                  <span className="font-ibm-mono text-[10px] text-[#555]">{selectedMsg.company}</span>
                  <span className="font-ibm-mono text-[10px] text-[#444]">{selectedMsg.time}</span>
                  <span className="font-ibm-mono text-[9px] tracking-[1px] px-2 py-0.5" style={{ background: typeColors[selectedMsg.type].bg, color: typeColors[selectedMsg.type].text }}>
                    {selectedMsg.type.toUpperCase()}
                  </span>
                </div>
              </div>
              <p className="font-ibm-mono text-[13px] text-[#CCCCCC] leading-[1.8]">{selectedMsg.preview}</p>

              {/* Reply box */}
              <div className="mt-8 border border-[#1D1D1D] bg-[#0F0F0F]">
                <div className="px-4 py-3 border-b border-[#1D1D1D]">
                  <span className="font-ibm-mono text-[9px] text-[#555] tracking-[2px]">REPLY</span>
                </div>
                <textarea
                  placeholder="Write your reply..."
                  rows={5}
                  className="w-full bg-transparent text-[#CCCCCC] font-ibm-mono text-[12px] px-4 py-3 focus:outline-none resize-none placeholder:text-[#333]"
                />
                <div className="px-4 py-3 border-t border-[#1D1D1D] flex justify-end">
                  <button className="px-5 py-2 bg-[#D6E264] hover:bg-[#c9d64f] font-ibm-mono text-[10px] text-[#0A0A0A] tracking-[2px] transition-colors cursor-pointer border-none">
                    SEND →
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="font-ibm-mono text-[12px] text-[#444]">Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
