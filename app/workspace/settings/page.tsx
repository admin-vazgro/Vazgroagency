import {
  requireWorkspaceAccess,
  getWorkspaceAdminClient,
  firstParam,
  type WorkspaceSearchParams,
} from "@/app/workspace/lib";
import { updateProfileAction } from "@/app/workspace/actions";

type ProfileRow = {
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  company: string | null;
  timezone: string | null;
  notification_email: boolean | null;
};

const inputClass =
  "w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[14px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none";
const labelClass = "mb-2 block font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-soft)]";

export default async function SettingsPage(props: {
  searchParams?: Promise<WorkspaceSearchParams>;
}) {
  const { user } = await requireWorkspaceAccess();
  const admin = getWorkspaceAdminClient();

  const searchParams = props.searchParams ? await props.searchParams : {};
  const statusMessage = firstParam(searchParams.status);
  const errorMessage = firstParam(searchParams.error);

  const { data: profile } = await admin
    .from("profiles")
    .select("first_name, last_name, email, phone, company, timezone, notification_email")
    .eq("id", user.id)
    .maybeSingle();

  const p = (profile ?? {}) as ProfileRow;

  return (
    <div className="p-8">
      <div className="mb-8 border-b border-[var(--portal-border)] pb-6">
        <span className="font-ibm-mono text-[14px] tracking-[3px] text-[var(--portal-accent)]">// SETTINGS</span>
        <h1 className="mt-1 font-grotesk text-[32px] font-normal tracking-[-1px] text-[var(--portal-text)]">
          Account Settings
        </h1>
        <p className="mt-1 font-ibm-mono text-[14px] tracking-[0.5px] text-[var(--portal-text-soft)]">
          Manage your profile and notification preferences.
        </p>
      </div>

      {statusMessage && (
        <div className="mb-6 border border-[var(--portal-accent)] bg-[var(--portal-accent-soft)] px-4 py-3">
          <p className="font-ibm-mono text-[14px] text-[var(--portal-accent)]">{statusMessage}</p>
        </div>
      )}
      {errorMessage && (
        <div className="mb-6 border border-[var(--portal-warning)] bg-[var(--portal-warning-soft)] px-4 py-3">
          <p className="font-ibm-mono text-[14px] text-[var(--portal-warning)]">{errorMessage}</p>
        </div>
      )}

      {/* Profile form */}
      <form action={updateProfileAction} className="mb-8 border border-[var(--portal-border)] bg-[var(--portal-surface)] p-6">
        <h2 className="mb-6 font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text)]">PROFILE</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div>
            <label className={labelClass}>FIRST NAME</label>
            <input name="first_name" defaultValue={p.first_name ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>LAST NAME</label>
            <input name="last_name" defaultValue={p.last_name ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>EMAIL</label>
            <input
              type="email"
              defaultValue={p.email ?? ""}
              disabled
              className={`${inputClass} cursor-not-allowed opacity-60`}
              title="Email changes must be made via account security settings"
            />
          </div>
          <div>
            <label className={labelClass}>PHONE</label>
            <input name="phone" defaultValue={p.phone ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>COMPANY</label>
            <input name="company" defaultValue={p.company ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>TIMEZONE</label>
            <select name="timezone" defaultValue={p.timezone ?? "Europe/London"} className={inputClass}>
              <option value="Europe/London">Europe/London (GMT/BST)</option>
              <option value="Europe/Paris">Europe/Paris (CET/CEST)</option>
              <option value="America/New_York">America/New_York (EST/EDT)</option>
              <option value="America/Los_Angeles">America/Los_Angeles (PST/PDT)</option>
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="Asia/Dubai">Asia/Dubai (GST)</option>
              <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
              <option value="Australia/Sydney">Australia/Sydney (AEST)</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="bg-[var(--portal-accent)] px-6 py-3 font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-accent-contrast)] transition-colors hover:bg-[var(--portal-accent-hover)] border-none cursor-pointer"
          >
            SAVE CHANGES
          </button>
        </div>
      </form>

      {/* Notification preferences (display only — future: wire to DB) */}
      <div className="mb-8 border border-[var(--portal-border)] bg-[var(--portal-surface)] p-6">
        <h2 className="mb-6 font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text)]">EMAIL NOTIFICATIONS</h2>
        <div className="flex flex-col gap-4">
          {[
            { key: "new_deliverable", label: "New deliverable uploaded", description: "When your team uploads a file for your review" },
            { key: "request_update", label: "Request status changes", description: "When a request moves to a new stage" },
            { key: "invoice_due", label: "Invoice due reminders", description: "3 days before an invoice is due" },
            { key: "milestone_complete", label: "Milestone completed", description: "When a milestone is marked as done" },
            { key: "weekly_digest", label: "Weekly digest", description: "A summary of activity every Monday morning" },
          ].map(({ key, label, description }) => (
            <div key={key} className="flex items-start justify-between gap-4">
              <div>
                <p className="font-ibm-mono text-[14px] text-[var(--portal-text)]">{label}</p>
                <p className="mt-0.5 font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">{description}</p>
              </div>
              <div
                className="relative h-5 w-9 flex-shrink-0 cursor-not-allowed rounded-full transition-colors"
                style={{
                  background: key === "invoice_due" || key === "weekly_digest" ? "var(--portal-accent)" : "var(--portal-border-strong)",
                  opacity: 0.6,
                }}
                title="Notification settings coming soon"
              >
                <div
                  className="absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform"
                  style={{
                    left: key === "invoice_due" || key === "weekly_digest" ? "18px" : "2px",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">
          Granular notification controls coming soon.
        </p>
      </div>

      {/* Security */}
      <div className="mb-8 border border-[var(--portal-border)] bg-[var(--portal-surface)] p-6">
        <h2 className="mb-6 font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text)]">SECURITY</h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="/login?action=magic_link"
            className="border border-[var(--portal-border-strong)] px-5 py-3 font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-soft)] transition-colors hover:text-[var(--portal-text)]"
          >
            SEND MAGIC LINK
          </a>
          <a
            href="/login?action=reset_password"
            className="border border-[var(--portal-border-strong)] px-5 py-3 font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-soft)] transition-colors hover:text-[var(--portal-text)]"
          >
            CHANGE PASSWORD
          </a>
        </div>
      </div>

      {/* Danger zone */}
      <div className="border border-[var(--portal-warning)] bg-[var(--portal-warning-soft)] p-6">
        <h2 className="mb-2 font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-warning)]">DANGER ZONE</h2>
        <p className="mb-4 font-ibm-mono text-[14px] text-[var(--portal-text-muted)]">
          Deleting your account will notify your Vazgro team to begin offboarding. Your data is retained for 90 days.
        </p>
        <a
          href="mailto:hello@vazgro.com?subject=Account deletion request"
          className="inline-block border border-[var(--portal-warning)] px-5 py-3 font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-warning)] transition-opacity hover:opacity-80"
        >
          REQUEST ACCOUNT DELETION
        </a>
      </div>
    </div>
  );
}
