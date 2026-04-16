"use client";

import { useState } from "react";

const messages: Array<{ id: string; from: string; company: string; subject: string; preview: string; time: string; read: boolean; type: string }> = [];

const typeColors: Record<string, { bg: string; text: string }> = {
  client: { bg: "var(--portal-accent-strong-soft)", text: "var(--portal-accent)" },
  partner: { bg: "var(--portal-warning-strong-soft)", text: "var(--portal-warning)" },
  internal: { bg: "var(--portal-muted-soft)", text: "var(--portal-text-soft)" },
};

export default function InboxPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");

  const filtered = messages.filter((m) => filter === "All" || m.type === filter.toLowerCase());
  const selectedMsg = messages.find((m) => m.id === selected);
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="px-8 py-6 border-b border-[var(--portal-border)] flex items-center justify-between shrink-0">
        <div>
          <span className="font-ibm-mono text-[14px] text-[var(--portal-accent)] tracking-[3px]">// INBOX</span>
          <h1 className="font-grotesk text-[24px] font-bold text-[var(--portal-text)] mt-0.5">Inbox {unread > 0 && <span className="font-ibm-mono text-[14px] text-[var(--portal-warning)] ml-2">{unread}</span>}</h1>
        </div>
        <button className="px-5 py-2 bg-[var(--portal-accent)] hover:bg-[var(--portal-accent-hover)] font-ibm-mono text-[14px] text-[var(--portal-accent-contrast)] tracking-[2px] transition-colors cursor-pointer border-none">
          + COMPOSE
        </button>
      </div>

      {/* Filter */}
      <div className="px-8 py-3 border-b border-[var(--portal-border)] flex gap-2 shrink-0">
        {["All", "Client", "Partner", "Internal"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 font-ibm-mono text-[14px] tracking-[1px] transition-colors cursor-pointer border border-[var(--portal-border)]"
            style={{ background: filter === f ? "var(--portal-accent)" : "transparent", color: filter === f ? "var(--portal-accent-contrast)" : "var(--portal-text-muted)" }}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Split pane */}
      <div className="flex flex-1 overflow-hidden">
        {/* Message list */}
        <div className="w-[320px] border-r border-[var(--portal-border)] overflow-y-auto shrink-0">
          {filtered.length ? filtered.map((msg) => (
            <button
              key={msg.id}
              onClick={() => setSelected(msg.id)}
              className="w-full text-left p-4 border-b border-[var(--portal-border)] hover:bg-[var(--portal-surface-alt)] transition-colors cursor-pointer border-l-2 block"
              style={{
                background: selected === msg.id ? "var(--portal-surface-alt)" : "transparent",
                borderLeftColor: selected === msg.id ? "var(--portal-accent)" : "transparent",
              }}
            >
              <div className="flex items-start justify-between mb-1">
                <span className="font-ibm-mono text-[14px] font-bold" style={{ color: msg.read ? "var(--portal-text-soft)" : "var(--portal-text)" }}>{msg.from}</span>
                <span className="font-ibm-mono text-[14px] text-[var(--portal-text-faint)]">{msg.time}</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-ibm-mono text-[14px] tracking-[1px] px-1.5 py-0.5" style={{ background: typeColors[msg.type].bg, color: typeColors[msg.type].text }}>
                  {msg.type.toUpperCase()}
                </span>
                <span className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)]">{msg.company}</span>
              </div>
              <p className="font-ibm-mono text-[14px] font-bold" style={{ color: msg.read ? "var(--portal-text-muted)" : "var(--portal-text-muted)" }}>{msg.subject}</p>
              <p className="font-ibm-mono text-[14px] text-[var(--portal-text-faint)] mt-1 leading-[1.5] line-clamp-2">{msg.preview}</p>
              {!msg.read && <div className="w-1.5 h-1.5 rounded-full bg-[var(--portal-warning)] mt-2" />}
            </button>
          )) : (
            <div className="p-6">
              <p className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">No messages yet.</p>
            </div>
          )}
        </div>

        {/* Message view */}
        <div className="flex-1 overflow-y-auto p-8">
          {selectedMsg ? (
            <div>
              <div className="border-b border-[var(--portal-border)] pb-5 mb-6">
                <h2 className="font-grotesk text-[22px] font-bold text-[var(--portal-text)] mb-3">{selectedMsg.subject}</h2>
                <div className="flex items-center gap-4">
                  <span className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)]">{selectedMsg.from}</span>
                  <span className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">{selectedMsg.company}</span>
                  <span className="font-ibm-mono text-[14px] text-[var(--portal-text-faint)]">{selectedMsg.time}</span>
                  <span className="font-ibm-mono text-[14px] tracking-[1px] px-2 py-0.5" style={{ background: typeColors[selectedMsg.type].bg, color: typeColors[selectedMsg.type].text }}>
                    {selectedMsg.type.toUpperCase()}
                  </span>
                </div>
              </div>
              <p className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)] leading-[1.8]">{selectedMsg.preview}</p>

              {/* Reply box */}
              <div className="mt-8 border border-[var(--portal-border)] bg-[var(--portal-surface)]">
                <div className="px-4 py-3 border-b border-[var(--portal-border)]">
                  <span className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)] tracking-[2px]">REPLY</span>
                </div>
                <textarea
                  placeholder="Write your reply..."
                  rows={5}
                  className="w-full bg-transparent text-[var(--portal-text-muted)] font-ibm-mono text-[14px] px-4 py-3 focus:outline-none resize-none placeholder:text-[#333]"
                />
                <div className="px-4 py-3 border-t border-[var(--portal-border)] flex justify-end">
                  <button className="px-5 py-2 bg-[var(--portal-accent)] hover:bg-[var(--portal-accent-hover)] font-ibm-mono text-[14px] text-[var(--portal-accent-contrast)] tracking-[2px] transition-colors cursor-pointer border-none">
                    SEND →
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)]">No message selected.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
