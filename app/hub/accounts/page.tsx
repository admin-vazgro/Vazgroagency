import Link from "next/link";
import { createAccountAction } from "@/app/hub/actions";
import { firstParam, getHubAdminClient, type HubSearchParams, requireHubAccess } from "@/app/hub/lib";

type AccountRow = {
  id: string;
  name: string;
  website: string | null;
  industry: string | null;
  country: string | null;
  mrr_gbp: number | string | null;
  ltv_gbp: number | string | null;
  created_at: string;
};

type EngagementRow = {
  account_id: string | null;
  status: string;
};

const statusColors = {
  Active: { bg: "var(--portal-accent-strong-soft)", text: "var(--portal-accent)" },
  Prospect: { bg: "var(--portal-muted-soft)", text: "var(--portal-text-soft)" },
};

function toNumber(value: number | string | null | undefined) {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value) || 0;
  return 0;
}

export default async function AccountsPage(props: {
  searchParams?: Promise<HubSearchParams>;
}) {
  await requireHubAccess();

  const searchParams = props.searchParams ? await props.searchParams : {};
  const showNew = firstParam(searchParams.new) === "1";
  const statusMessage = firstParam(searchParams.status);
  const errorMessage = firstParam(searchParams.error);

  let accounts: AccountRow[] = [];
  let engagements: EngagementRow[] = [];
  let dataError = "";

  try {
    const admin = getHubAdminClient();
    const [accountsResult, engagementsResult] = await Promise.all([
      admin.from("accounts").select("id, name, website, industry, country, mrr_gbp, ltv_gbp, created_at").order("created_at", { ascending: false }),
      admin.from("engagements").select("account_id, status"),
    ]);

    if (accountsResult.error) throw accountsResult.error;
    if (engagementsResult.error) throw engagementsResult.error;

    accounts = (accountsResult.data ?? []) as AccountRow[];
    engagements = (engagementsResult.data ?? []) as EngagementRow[];
  } catch (error) {
    dataError = error instanceof Error ? error.message : "Unable to load accounts.";
  }

  const activeEngagementCounts = new Map<string, number>();
  for (const engagement of engagements) {
    if (!engagement.account_id) continue;
    const current = activeEngagementCounts.get(engagement.account_id) ?? 0;
    if (engagement.status !== "completed" && engagement.status !== "cancelled") {
      activeEngagementCounts.set(engagement.account_id, current + 1);
    }
  }

  const totalMrr = accounts.reduce((sum, account) => sum + toNumber(account.mrr_gbp), 0);
  const totalActiveEngagements = [...activeEngagementCounts.values()].reduce((sum, count) => sum + count, 0);
  const activeClientCount = accounts.filter((a) => (activeEngagementCounts.get(a.id) ?? 0) > 0).length;

  return (
    <div className="p-8">
      <div className="mb-8 flex items-end justify-between border-b border-[var(--portal-border)] pb-6">
        <div>
          <span className="font-ibm-mono text-[10px] tracking-[3px] text-[var(--portal-accent)]">// ACCOUNTS</span>
          <h1 className="mt-1 font-grotesk text-[32px] font-normal tracking-[-1px] text-[var(--portal-text)]">Accounts</h1>
          <p className="mt-1 font-ibm-mono text-[12px] tracking-[0.5px] text-[var(--portal-text-soft)]">
            {accounts.length} accounts · {activeClientCount} active clients
          </p>
        </div>
        <Link
          href={showNew ? "/hub/accounts" : "/hub/accounts?new=1"}
          className="bg-[var(--portal-accent)] px-5 py-2.5 font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-accent-contrast)] transition-colors hover:bg-[var(--portal-accent-hover)]"
        >
          {showNew ? "CLOSE" : "+ NEW ACCOUNT"}
        </Link>
      </div>

      {statusMessage ? (
        <div className="mb-6 border border-[var(--portal-accent)] bg-[var(--portal-accent-soft)] px-4 py-3">
          <p className="font-ibm-mono text-[11px] text-[var(--portal-accent)]">{statusMessage}</p>
        </div>
      ) : null}

      {errorMessage || dataError ? (
        <div className="mb-6 border border-[var(--portal-warning)] bg-[var(--portal-warning-soft)] px-4 py-3">
          <p className="font-ibm-mono text-[11px] text-[var(--portal-warning)]">{errorMessage || dataError}</p>
        </div>
      ) : null}

      {showNew ? (
        <form action={createAccountAction} className="mb-8 grid grid-cols-1 gap-4 border border-[var(--portal-border)] bg-[var(--portal-surface)] p-6 lg:grid-cols-2">
          <div>
            <label className="mb-2 block font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)]">ACCOUNT NAME *</label>
            <input name="name" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[12px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)]">WEBSITE</label>
            <input name="website" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[12px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)]">INDUSTRY</label>
            <input name="industry" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[12px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)]">COUNTRY</label>
            <input name="country" defaultValue="GB" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[12px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)]">MONTHLY REVENUE (GBP)</label>
            <input type="number" min="0" step="0.01" name="mrr_gbp" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[12px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none" />
          </div>
          <div className="lg:col-span-2">
            <label className="mb-2 block font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)]">NOTES</label>
            <textarea name="notes" rows={4} className="w-full resize-y border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[12px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none" />
          </div>
          <div className="lg:col-span-2 flex gap-3">
            <button type="submit" className="bg-[var(--portal-accent)] px-5 py-3 font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-accent-contrast)] transition-colors hover:bg-[var(--portal-accent-hover)]">
              SAVE ACCOUNT
            </button>
            <Link href="/hub/accounts" className="border border-[var(--portal-border-strong)] px-5 py-3 font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)] transition-colors hover:text-[var(--portal-text)]">
              CANCEL
            </Link>
          </div>
        </form>
      ) : null}

      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
          <p className="mb-2 font-ibm-mono text-[10px] tracking-[1px] text-[var(--portal-text-muted)]">TOTAL MRR</p>
          <p className="font-grotesk text-[28px] font-normal text-[var(--portal-accent)]">£{totalMrr.toLocaleString()}</p>
        </div>
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
          <p className="mb-2 font-ibm-mono text-[10px] tracking-[1px] text-[var(--portal-text-muted)]">ACTIVE CLIENTS</p>
          <p className="font-grotesk text-[28px] font-normal text-[var(--portal-text)]">{activeClientCount}</p>
        </div>
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
          <p className="mb-2 font-ibm-mono text-[10px] tracking-[1px] text-[var(--portal-text-muted)]">ACTIVE ENGAGEMENTS</p>
          <p className="font-grotesk text-[28px] font-normal text-[var(--portal-text)]">{totalActiveEngagements}</p>
        </div>
      </div>

      <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
        <div className="grid grid-cols-[1.2fr_100px_1fr_1fr_110px_90px] gap-4 border-b border-[var(--portal-border)] px-5 py-3">
          {["Account", "Country", "Industry", "Website", "Engagements", "Status"].map((heading) => (
            <span key={heading} className="font-ibm-mono text-[9px] tracking-[2px] text-[var(--portal-text-dim)]">{heading}</span>
          ))}
        </div>
        {accounts.map((account) => {
          const activeEngagements = activeEngagementCounts.get(account.id) ?? 0;
          const status = activeEngagements > 0 ? "Active" : "Prospect";
          const statusColor = statusColors[status];
          return (
            <div key={account.id} className="grid grid-cols-[1.2fr_100px_1fr_1fr_110px_90px] gap-4 border-b border-[var(--portal-border)] px-5 py-4 transition-colors hover:bg-[var(--portal-surface-alt)]">
              <div>
                <p className="font-ibm-mono text-[11px] text-[var(--portal-text)]">{account.name}</p>
                <p className="mt-0.5 font-ibm-mono text-[10px] text-[var(--portal-text-muted)]">MRR £{toNumber(account.mrr_gbp).toLocaleString()}</p>
              </div>
              <span className="font-ibm-mono text-[10px] text-[var(--portal-text-soft)]">{account.country || "—"}</span>
              <span className="font-ibm-mono text-[10px] text-[var(--portal-text-soft)]">{account.industry || "—"}</span>
              <span className="truncate font-ibm-mono text-[10px] text-[var(--portal-text-soft)]">{account.website || "—"}</span>
              <span className="font-ibm-mono text-[10px] text-[var(--portal-text-soft)]">{activeEngagements}</span>
              <span className="w-fit px-2 py-1 font-ibm-mono text-[9px] tracking-[1px]" style={{ background: statusColor.bg, color: statusColor.text }}>
                {status.toUpperCase()}
              </span>
            </div>
          );
        })}
        {!accounts.length ? (
          <div className="px-5 py-12">
            <p className="font-ibm-mono text-[11px] text-[var(--portal-text-soft)]">No account records yet.</p>
            <p className="mt-2 font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">Use the new account action to add your first client company.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
