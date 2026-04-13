"use client";

import { useState, useTransition } from "react";
import { approveDeliverableAction, requestRevisionAction } from "@/app/workspace/actions";

export default function DeliverableActions({ deliverableId }: { deliverableId: string }) {
  const [showRevision, setShowRevision] = useState(false);
  const [notes, setNotes] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleApprove() {
    startTransition(async () => {
      await approveDeliverableAction(deliverableId);
    });
  }

  function handleRevision() {
    startTransition(async () => {
      await requestRevisionAction(deliverableId, notes);
      setShowRevision(false);
      setNotes("");
    });
  }

  if (showRevision) {
    return (
      <div className="flex flex-col gap-1.5">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Describe what needs to change..."
          rows={2}
          className="w-full resize-none border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-2 py-1.5 font-ibm-mono text-[10px] text-[var(--portal-text)] placeholder:text-[var(--portal-text-faint)] focus:border-[var(--portal-accent)] focus:outline-none"
        />
        <div className="flex gap-1">
          <button
            onClick={handleRevision}
            disabled={isPending}
            className="flex-1 border-none bg-[var(--portal-warning)] py-1.5 font-ibm-mono text-[9px] tracking-[1px] text-white transition-opacity hover:opacity-80 disabled:opacity-50 cursor-pointer"
          >
            {isPending ? "…" : "SEND"}
          </button>
          <button
            onClick={() => setShowRevision(false)}
            className="flex-1 border border-[var(--portal-border-strong)] bg-transparent py-1.5 font-ibm-mono text-[9px] tracking-[1px] text-[var(--portal-text-dim)] transition-colors hover:text-[var(--portal-text)] cursor-pointer"
          >
            CANCEL
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-1">
      <button
        onClick={handleApprove}
        disabled={isPending}
        className="flex-1 border-none bg-[var(--portal-accent)] py-1.5 font-ibm-mono text-[9px] tracking-[1px] text-[var(--portal-accent-contrast)] transition-opacity hover:opacity-80 disabled:opacity-50 cursor-pointer"
      >
        {isPending ? "…" : "APPROVE"}
      </button>
      <button
        onClick={() => setShowRevision(true)}
        disabled={isPending}
        className="flex-1 border border-[var(--portal-border-strong)] bg-transparent py-1.5 font-ibm-mono text-[9px] tracking-[1px] text-[var(--portal-text-dim)] transition-colors hover:text-[var(--portal-text)] cursor-pointer"
      >
        REVISE
      </button>
    </div>
  );
}
