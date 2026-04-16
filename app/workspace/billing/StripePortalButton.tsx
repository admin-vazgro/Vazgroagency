"use client";

import { useState } from "react";

interface Props {
  label?: string;
}

export default function StripePortalButton({ label = "MANAGE BILLING →" }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ return_url: window.location.href }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to open portal");
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className="border-none bg-[var(--portal-accent)] hover:bg-[var(--portal-accent-hover)] px-6 py-3 font-ibm-mono text-[11px] tracking-[2px] text-[var(--portal-accent-contrast)] transition-colors cursor-pointer disabled:opacity-50"
      >
        {loading ? "OPENING PORTAL..." : label}
      </button>
      {error && (
        <p className="mt-2 font-ibm-mono text-[10px] text-[var(--portal-warning)]">{error}</p>
      )}
    </div>
  );
}
