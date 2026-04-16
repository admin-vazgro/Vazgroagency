"use client";

import { useState } from "react";

export default function TeamInviteForm() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    setSuccess(null);
    setError(null);

    try {
      const res = await fetch("/api/workspace/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send invitation");
      setSuccess(data.message || `Invitation sent to ${email}`);
      setEmail("");
      setRole("member");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_140px_auto]">
        <div>
          <label className="block font-ibm-mono text-[14px] tracking-[1.5px] text-[var(--portal-text-dim)] mb-1.5">EMAIL ADDRESS</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="colleague@company.com"
            required
            className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[14px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none placeholder:text-[var(--portal-text-dim)]"
          />
        </div>
        <div>
          <label className="block font-ibm-mono text-[14px] tracking-[1.5px] text-[var(--portal-text-dim)] mb-1.5">ROLE</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[14px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none"
          >
            <option value="owner">Owner</option>
            <option value="member">Member</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={submitting || !email.trim()}
            className="h-[48px] px-6 border-none bg-[var(--portal-accent)] hover:bg-[var(--portal-accent-hover)] font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-accent-contrast)] transition-colors cursor-pointer disabled:opacity-40 whitespace-nowrap"
          >
            {submitting ? "SENDING..." : "SEND INVITE"}
          </button>
        </div>
      </div>
      {success && (
        <div className="border border-[var(--portal-accent)] bg-[var(--portal-accent-soft)] px-4 py-2">
          <p className="font-ibm-mono text-[14px] text-[var(--portal-accent)]">{success}</p>
        </div>
      )}
      {error && (
        <div className="border border-[var(--portal-warning)] bg-[var(--portal-warning-soft)] px-4 py-2">
          <p className="font-ibm-mono text-[14px] text-[var(--portal-warning)]">{error}</p>
        </div>
      )}
      <p className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">
        They&apos;ll receive an email with a magic link to access the workspace. Team membership is free and unlimited.
      </p>
    </form>
  );
}
