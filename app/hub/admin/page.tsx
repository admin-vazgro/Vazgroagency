import { redirect } from "next/navigation";
import { canUseLocalAdminAccess, resolveUserRole } from "@/lib/auth/resolve-role";
import { ALL_APP_ROLES, HUB_ROLES } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  assignStaffAction,
  createUserAction,
  deleteUserAction,
  removeAssignmentAction,
  updateSettingAction,
} from "./actions";

type SearchParams = Record<string, string | string[] | undefined>;

type HubSetting = {
  key: string;
  value: unknown;
  description: string | null;
};

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  role: string;
  created_at: string | null;
};

type Engagement = {
  id: string;
  title: string;
  pillar: string;
  status: string;
  pm_id: string | null;
};

type Assignment = {
  id: string;
  engagement_id: string;
  profile_id: string;
  role: string;
};

function displayName(profile: Profile) {
  const name = [profile.first_name, profile.last_name].filter(Boolean).join(" ").trim();
  return name || profile.email;
}

function stringifySettingValue(value: unknown) {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value, null, 2);
}

type SettingMeta = {
  label: string;
  hint?: string;
  inputType: "number" | "textarea" | "text";
  rows?: number;
  unit?: string;
};

const SETTING_META: Record<string, SettingMeta> = {
  sla_first_touch_hours: { label: "First-touch SLA", hint: "Hours from lead creation before breach", inputType: "number", unit: "hours" },
  sla_first_touch_warning_hours: { label: "First-touch warning", hint: "Hours from lead creation before warning shown", inputType: "number", unit: "hours" },
  sla_qualify_working_days: { label: "Qualify deadline", hint: "Working days to qualify a lead", inputType: "number", unit: "days" },
  sla_stale_deal_working_days: { label: "Stale deal deadline", hint: "Working days before deal is flagged stale", inputType: "number", unit: "days" },
  sla_stale_deal_warning_days: { label: "Stale deal warning", hint: "Working days before stale deal warning", inputType: "number", unit: "days" },
  claw_back_window_days: { label: "Claw-back window", hint: "Days before commission releases from hold", inputType: "number", unit: "days" },
  commission_tiers: { label: "Commission tiers", hint: "JSON array: tier, min_gbp, max_gbp, closer_rate, referrer_rate", inputType: "textarea", rows: 10 },
  grow_taper: { label: "GROW taper schedule", hint: "JSON array: months[] and multiplier per phase", inputType: "textarea", rows: 8 },
  partner_concurrent_leads_cap: { label: "Concurrent leads cap", hint: "JSON object: max open leads per tier { tier1, tier2, tier3 }", inputType: "textarea", rows: 3 },
  currencies: { label: "Supported currencies", hint: "JSON array of ISO currency codes", inputType: "textarea", rows: 2 },
  pipeline_stages_launch: { label: "LAUNCH pipeline stages", hint: "JSON array of stage slugs", inputType: "textarea", rows: 3 },
  pipeline_stages_grow: { label: "GROW pipeline stages", hint: "JSON array of stage slugs", inputType: "textarea", rows: 3 },
  pipeline_stages_build: { label: "BUILD pipeline stages", hint: "JSON array of stage slugs", inputType: "textarea", rows: 3 },
};

const SETTING_GROUPS: Array<{ heading: string; keys: string[] }> = [
  {
    heading: "SLA Thresholds",
    keys: ["sla_first_touch_hours", "sla_first_touch_warning_hours", "sla_qualify_working_days", "sla_stale_deal_working_days", "sla_stale_deal_warning_days"],
  },
  {
    heading: "Commission & Payouts",
    keys: ["commission_tiers", "grow_taper", "claw_back_window_days"],
  },
  {
    heading: "Partner Caps",
    keys: ["partner_concurrent_leads_cap"],
  },
  {
    heading: "Currencies & Pipeline",
    keys: ["currencies", "pipeline_stages_launch", "pipeline_stages_grow", "pipeline_stages_build"],
  },
];

const inputCls = "w-full bg-[var(--portal-bg)] border border-[var(--portal-border-strong)] text-[var(--portal-text)] font-ibm-mono text-[14px] px-3 py-2 focus:outline-none focus:border-[var(--portal-accent)]";

function SettingField({ setting }: { setting: HubSetting }) {
  const meta = SETTING_META[setting.key] ?? { label: setting.key, inputType: "textarea" as const, rows: 3 };
  const displayValue = stringifySettingValue(setting.value);

  return (
    <form action={updateSettingAction} className="flex flex-col gap-2">
      <input type="hidden" name="key" value={setting.key} />
      <div className="flex items-center justify-between gap-2">
        <div>
          <label className="block font-ibm-mono text-[14px] tracking-[1px] text-[var(--portal-text-muted)]">
            {meta.label.toUpperCase()}
          </label>
          {meta.hint && (
            <p className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)] mt-0.5">{meta.hint}</p>
          )}
        </div>
        {meta.inputType === "number" && meta.unit && (
          <span className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)] shrink-0">{meta.unit}</span>
        )}
      </div>
      <div className="flex gap-2 items-start">
        {meta.inputType === "number" ? (
          <input
            type="number"
            name="value"
            defaultValue={displayValue}
            min={0}
            className={`${inputCls} w-32`}
          />
        ) : (
          <textarea
            name="value"
            defaultValue={displayValue}
            rows={meta.rows ?? 3}
            className={`${inputCls} resize-y flex-1`}
          />
        )}
        <button
          type="submit"
          className="shrink-0 px-4 py-2 bg-[var(--portal-accent)] hover:bg-[var(--portal-accent-hover)] font-ibm-mono text-[14px] text-[var(--portal-accent-contrast)] tracking-[1px] transition-colors cursor-pointer border-none"
        >
          SAVE
        </button>
      </div>
    </form>
  );
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message;
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message) return message;
  }
  return "Unable to load admin data.";
}

export default async function AdminPage(props: {
  searchParams?: Promise<SearchParams>;
}) {
  const searchParams = (props.searchParams ? await props.searchParams : {}) as SearchParams;
  const statusMessage = firstParam(searchParams?.status);
  const errorMessage = firstParam(searchParams?.error);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const role = await resolveUserRole(supabase, user);
  const localAdminAccess = canUseLocalAdminAccess(user);
  if (role !== "admin" && !localAdminAccess) redirect("/hub");

  let settings: HubSetting[] = [];
  let profiles: Profile[] = [];
  let engagements: Engagement[] = [];
  let assignments: Assignment[] = [];
  let adminDataError = "";

  try {
    const admin = createAdminClient();
    const [
      settingsResult,
      profilesResult,
      engagementsResult,
      assignmentsResult,
    ] = await Promise.all([
      admin.from("hub_settings").select("key, value, description").order("key"),
      admin.from("profiles").select("id, first_name, last_name, email, role, created_at").order("created_at", { ascending: false }),
      admin.from("engagements").select("id, title, pillar, status, pm_id").order("created_at", { ascending: false }),
      admin.from("engagement_team").select("id, engagement_id, profile_id, role").order("created_at", { ascending: false }),
    ]);

    if (settingsResult.error) throw settingsResult.error;
    if (profilesResult.error) throw profilesResult.error;
    if (engagementsResult.error) throw engagementsResult.error;
    if (assignmentsResult.error) throw assignmentsResult.error;

    settings = settingsResult.data ?? [];
    profiles = profilesResult.data ?? [];
    engagements = engagementsResult.data ?? [];
    assignments = assignmentsResult.data ?? [];
  } catch (error) {
    adminDataError = getErrorMessage(error);
  }

  const profileById = new Map(profiles.map((profile) => [profile.id, profile]));
  const hubUsers = profiles.filter((profile) => HUB_ROLES.includes(profile.role as (typeof HUB_ROLES)[number]));
  const clientUsers = profiles.filter((profile) => profile.role === "client");

  return (
    <div className="p-8">
      <div className="mb-8 border-b border-[var(--portal-border)] pb-6">
        <span className="font-ibm-mono text-[14px] text-[var(--portal-accent)] tracking-[3px]">// ADMIN</span>
        <h1 className="font-grotesk text-[32px] font-bold text-[var(--portal-text)] tracking-[-1px] mt-1">Settings & Users</h1>
        <p className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)] tracking-[0.5px] mt-1">
          Hub settings, user management, staff allocation, and system status.
        </p>
      </div>

      {localAdminAccess && role !== "admin" ? (
        <div className="mb-6 border border-[var(--portal-accent)] bg-[var(--portal-accent-soft)] px-4 py-3">
          <p className="font-ibm-mono text-[14px] text-[var(--portal-accent)] tracking-[0.5px]">
            Local development admin access is enabled for your internal Vazgro account.
          </p>
        </div>
      ) : null}

      {statusMessage ? (
        <div className="mb-6 border border-[var(--portal-accent)] bg-[var(--portal-accent-soft)] px-4 py-3">
          <p className="font-ibm-mono text-[14px] text-[var(--portal-accent)] tracking-[0.5px]">{statusMessage}</p>
        </div>
      ) : null}

      {errorMessage ? (
        <div className="mb-6 border border-[var(--portal-warning)] bg-[var(--portal-warning-soft)] px-4 py-3">
          <p className="font-ibm-mono text-[14px] text-[var(--portal-warning)] tracking-[0.5px]">{errorMessage}</p>
        </div>
      ) : null}

      {adminDataError ? (
        <div className="mb-6 border border-[var(--portal-warning)] bg-[var(--portal-warning-soft)] px-4 py-3">
          <p className="font-ibm-mono text-[14px] text-[var(--portal-warning)] tracking-[0.5px]">
            Admin data is unavailable: {adminDataError}
          </p>
        </div>
      ) : null}

      <div className="grid grid-cols-[1.2fr_0.8fr] gap-8 items-start">
        <div className="flex flex-col gap-6">
          <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
            <div className="px-6 py-4 border-b border-[var(--portal-border)]">
              <p className="font-ibm-mono text-[14px] text-[var(--portal-text)] tracking-[2px]">HUB SETTINGS</p>
              <p className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)] mt-1">
                Persisted in Supabase. Update values inline and save.
              </p>
            </div>
            {!settings.length && !adminDataError ? (
              <div className="px-6 py-5">
                <p className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)]">No hub settings found.</p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--portal-border)]">
                {SETTING_GROUPS.map((group) => {
                  const groupSettings = group.keys
                    .map((k) => settings.find((s) => s.key === k))
                    .filter((s): s is HubSetting => s != null);
                  if (!groupSettings.length) return null;
                  return (
                    <div key={group.heading} className="px-6 py-5">
                      <p className="font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-accent)] mb-4">{group.heading.toUpperCase()}</p>
                      <div className="flex flex-col gap-5">
                        {groupSettings.map((s) => (
                          <SettingField key={s.key} setting={s} />
                        ))}
                      </div>
                    </div>
                  );
                })}
                {/* Ungrouped settings fallback */}
                {settings
                  .filter((s) => !SETTING_GROUPS.flatMap((g) => g.keys).includes(s.key))
                  .map((s) => (
                    <div key={s.key} className="px-6 py-4">
                      <SettingField setting={s} />
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
            <div className="px-6 py-4 border-b border-[var(--portal-border)]">
              <p className="font-ibm-mono text-[14px] text-[var(--portal-text)] tracking-[2px]">ALLOCATE STAFF TO PROJECTS</p>
              <p className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)] mt-1">
                Assign delivery and management staff to active engagements.
              </p>
            </div>

            <form action={assignStaffAction} className="p-6 grid grid-cols-[1fr_1fr_1fr_auto] gap-3 border-b border-[var(--portal-border)]">
              <select
                name="engagement_id"
                defaultValue=""
                className="bg-[var(--portal-bg)] border border-[var(--portal-border-strong)] text-[var(--portal-text)] font-ibm-mono text-[14px] px-3 py-3 focus:outline-none focus:border-[var(--portal-accent)]"
              >
                <option value="" disabled>Select engagement</option>
                {engagements.map((engagement) => (
                  <option key={engagement.id} value={engagement.id}>
                    {engagement.title} · {engagement.pillar}
                  </option>
                ))}
              </select>

              <select
                name="profile_id"
                defaultValue=""
                className="bg-[var(--portal-bg)] border border-[var(--portal-border-strong)] text-[var(--portal-text)] font-ibm-mono text-[14px] px-3 py-3 focus:outline-none focus:border-[var(--portal-accent)]"
              >
                <option value="" disabled>Select staff member</option>
                {hubUsers.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {displayName(profile)} · {profile.role}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="assignment_role"
                placeholder="Role on project"
                className="bg-[var(--portal-bg)] border border-[var(--portal-border-strong)] text-[var(--portal-text)] font-ibm-mono text-[14px] px-3 py-3 focus:outline-none focus:border-[var(--portal-accent)] placeholder:text-[var(--portal-text-dim)]"
              />

              <button
                type="submit"
                className="px-4 py-3 bg-[var(--portal-accent)] hover:bg-[var(--portal-accent-hover)] font-ibm-mono text-[14px] text-[var(--portal-accent-contrast)] tracking-[1px] transition-colors cursor-pointer border-none"
              >
                ASSIGN
              </button>
            </form>

            <div className="divide-y divide-[var(--portal-border)]">
              {engagements.map((engagement) => {
                const engagementAssignments = assignments.filter(
                  (assignment) => assignment.engagement_id === engagement.id
                );

                return (
                  <div key={engagement.id} className="px-6 py-4">
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <div>
                        <p className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)]">{engagement.title}</p>
                        <p className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)] mt-1">
                          {engagement.pillar} · {engagement.status}
                        </p>
                      </div>
                      <span className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">{engagement.id}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {engagementAssignments.length ? (
                        engagementAssignments.map((assignment) => {
                          const profile = profileById.get(assignment.profile_id);
                          return (
                            <form
                              key={assignment.id}
                              action={removeAssignmentAction}
                              className="flex items-center gap-2 border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-3 py-2"
                            >
                              <input type="hidden" name="assignment_id" value={assignment.id} />
                              <input type="hidden" name="engagement_id" value={engagement.id} />
                              <div>
                                <p className="font-ibm-mono text-[14px] text-[var(--portal-text)]">
                                  {profile ? displayName(profile) : assignment.profile_id}
                                </p>
                                <p className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)]">{assignment.role}</p>
                              </div>
                              <button
                                type="submit"
                                className="font-ibm-mono text-[14px] text-[var(--portal-warning)] tracking-[1px] cursor-pointer bg-transparent border-none"
                              >
                                REMOVE
                              </button>
                            </form>
                          );
                        })
                      ) : (
                        <p className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">No staff assigned yet.</p>
                      )}
                    </div>
                  </div>
                );
              })}
              {!engagements.length && !adminDataError ? (
                <div className="px-6 py-5">
                  <p className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)]">No engagements found for staff allocation.</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
            <div className="px-5 py-4 border-b border-[var(--portal-border)]">
              <p className="font-ibm-mono text-[14px] text-[var(--portal-text)] tracking-[2px]">ADD NEW USER</p>
              <p className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)] mt-1">
                Create a login and set the user role immediately.
              </p>
            </div>
            <form action={createUserAction} className="p-5 flex flex-col gap-3">
              <input
                type="email"
                name="email"
                placeholder="name@company.com"
                className="bg-[var(--portal-bg)] border border-[var(--portal-border-strong)] text-[var(--portal-text)] font-ibm-mono text-[14px] px-3 py-3 focus:outline-none focus:border-[var(--portal-accent)] placeholder:text-[var(--portal-text-dim)]"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="first_name"
                  placeholder="First name"
                  className="bg-[var(--portal-bg)] border border-[var(--portal-border-strong)] text-[var(--portal-text)] font-ibm-mono text-[14px] px-3 py-3 focus:outline-none focus:border-[var(--portal-accent)] placeholder:text-[var(--portal-text-dim)]"
                />
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last name"
                  className="bg-[var(--portal-bg)] border border-[var(--portal-border-strong)] text-[var(--portal-text)] font-ibm-mono text-[14px] px-3 py-3 focus:outline-none focus:border-[var(--portal-accent)] placeholder:text-[var(--portal-text-dim)]"
                />
              </div>
              <input
                type="password"
                name="password"
                placeholder="Temporary password"
                className="bg-[var(--portal-bg)] border border-[var(--portal-border-strong)] text-[var(--portal-text)] font-ibm-mono text-[14px] px-3 py-3 focus:outline-none focus:border-[var(--portal-accent)] placeholder:text-[var(--portal-text-dim)]"
              />
              <select
                name="role"
                defaultValue="client"
                className="bg-[var(--portal-bg)] border border-[var(--portal-border-strong)] text-[var(--portal-text)] font-ibm-mono text-[14px] px-3 py-3 focus:outline-none focus:border-[var(--portal-accent)]"
              >
                {ALL_APP_ROLES.map((roleOption) => (
                  <option key={roleOption} value={roleOption}>
                    {roleOption}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full px-4 py-3 bg-[var(--portal-accent)] hover:bg-[var(--portal-accent-hover)] font-ibm-mono text-[14px] text-[var(--portal-accent-contrast)] tracking-[1px] transition-colors cursor-pointer border-none"
              >
                CREATE USER
              </button>
            </form>
          </div>

          <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
            <div className="px-5 py-4 border-b border-[var(--portal-border)] flex items-center justify-between">
              <span className="font-ibm-mono text-[14px] text-[var(--portal-text)] tracking-[2px]">USER DIRECTORY</span>
              <span className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">
                {hubUsers.length} hub users · {clientUsers.length} clients
              </span>
            </div>
            <div className="divide-y divide-[var(--portal-border)] max-h-[480px] overflow-y-auto">
              {profiles.map((profile) => (
                <div key={profile.id} className="px-5 py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)]">{displayName(profile)}</p>
                    <p className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)] mt-1">{profile.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="font-ibm-mono text-[14px] tracking-[1px] px-2 py-1"
                      style={{
                        background: profile.role === "admin" ? "var(--portal-accent-strong-soft)" : "var(--portal-muted-soft)",
                        color: profile.role === "admin" ? "var(--portal-accent)" : "var(--portal-text)",
                      }}
                    >
                      {profile.role.toUpperCase()}
                    </span>
                    <form action={deleteUserAction}>
                      <input type="hidden" name="user_id" value={profile.id} />
                      <input type="hidden" name="email" value={profile.email} />
                      <button
                        type="submit"
                        className="font-ibm-mono text-[14px] text-[var(--portal-warning)] tracking-[1px] cursor-pointer bg-transparent border-none"
                      >
                        DELETE
                      </button>
                    </form>
                  </div>
                </div>
              ))}
              {!profiles.length && !adminDataError ? (
                <div className="px-5 py-5">
                  <p className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)]">No users found.</p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
            <p className="font-ibm-mono text-[14px] text-[var(--portal-text)] tracking-[2px] mb-4">SYSTEM STATUS</p>
            <div className="flex flex-col gap-2">
              {[
                { label: "Hub Role Gate", status: "Enabled" },
                { label: "Admin Controls", status: "Live" },
                { label: "Workspace Access", status: "Client only" },
                { label: "Service Role Key", status: process.env.SUPABASE_SERVICE_ROLE_KEY ? "Configured" : "Missing" },
              ].map(({ label, status }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">{label}</span>
                  <span className="font-ibm-mono text-[14px] text-[var(--portal-accent)]">{status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
