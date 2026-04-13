import { requireWorkspaceAccess, getWorkspaceAdminClient, displayName } from "@/app/workspace/lib";

type TeamMemberRow = {
  profile_id: string;
  role: string | null;
  engagement_id: string;
};

type ProfileRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  role: string;
  timezone: string | null;
};

type EngagementRow = {
  id: string;
  title: string;
  pillar: string;
};

const roleColors: Record<string, string> = {
  admin: "var(--portal-accent)",
  ops: "var(--portal-warning)",
  delivery: "var(--portal-text-soft)",
  sales_manager: "var(--portal-accent)",
  internal_sales: "var(--portal-text-soft)",
};

function getInitials(profile: ProfileRow) {
  const first = profile.first_name?.[0] ?? "";
  const last = profile.last_name?.[0] ?? "";
  return (first + last).toUpperCase() || profile.email[0].toUpperCase();
}

const avatarColors = [
  "var(--portal-accent)",
  "var(--portal-warning)",
  "var(--portal-text-soft)",
];

export default async function TeamPage() {
  const { user } = await requireWorkspaceAccess();
  const admin = getWorkspaceAdminClient();

  const { data: membership } = await admin
    .from("account_members")
    .select("account_id")
    .eq("profile_id", user.id)
    .maybeSingle();

  const accountId = membership?.account_id ?? null;

  let teamMembers: TeamMemberRow[] = [];
  let profiles = new Map<string, ProfileRow>();
  let engagements = new Map<string, EngagementRow>();
  let dataError = "";

  if (accountId) {
    try {
      // Get all engagements for this account
      const { data: engData, error: engError } = await admin
        .from("engagements")
        .select("id, title, pillar")
        .eq("account_id", accountId)
        .in("status", ["active", "paused"]);

      if (engError) throw engError;
      engagements = new Map((engData ?? []).map((e: EngagementRow) => [e.id, e]));

      const engIds = [...engagements.keys()];

      if (engIds.length) {
        // Get engagement team members
        const { data: teamData, error: teamError } = await admin
          .from("engagement_team")
          .select("profile_id, role, engagement_id")
          .in("engagement_id", engIds);

        if (teamError) throw teamError;
        teamMembers = (teamData ?? []) as TeamMemberRow[];

        // Also include PM ids from engagements
        const { data: engWithPm } = await admin
          .from("engagements")
          .select("pm_id")
          .eq("account_id", accountId)
          .in("status", ["active", "paused"])
          .not("pm_id", "is", null);

        const pmIds = (engWithPm ?? []).map((e: { pm_id: string }) => e.pm_id);
        const teamProfileIds = [...new Set([...teamMembers.map((t) => t.profile_id), ...pmIds])];

        if (teamProfileIds.length) {
          const { data: profileData, error: profileError } = await admin
            .from("profiles")
            .select("id, first_name, last_name, email, role, timezone")
            .in("id", teamProfileIds);

          if (profileError) throw profileError;
          profiles = new Map((profileData ?? []).map((p: ProfileRow) => [p.id, p]));
        }
      }
    } catch (err) {
      dataError = err instanceof Error ? err.message : "Unable to load team.";
    }
  }

  // Build a deduplicated list of team members with their engagements
  const memberEngagements = new Map<string, string[]>();
  for (const tm of teamMembers) {
    const existing = memberEngagements.get(tm.profile_id) ?? [];
    memberEngagements.set(tm.profile_id, [...existing, tm.engagement_id]);
  }

  const uniqueMembers = [...profiles.values()];

  return (
    <div className="p-8">
      <div className="mb-8 border-b border-[var(--portal-border)] pb-6">
        <span className="font-ibm-mono text-[10px] tracking-[3px] text-[var(--portal-accent)]">// TEAM</span>
        <h1 className="mt-1 font-grotesk text-[32px] font-normal tracking-[-1px] text-[var(--portal-text)]">Your Vazgro Team</h1>
        <p className="mt-1 font-ibm-mono text-[12px] tracking-[0.5px] text-[var(--portal-text-soft)]">
          {uniqueMembers.length} team member{uniqueMembers.length !== 1 ? "s" : ""} assigned to your account
        </p>
      </div>

      {dataError && (
        <div className="mb-6 border border-[var(--portal-warning)] bg-[var(--portal-warning-soft)] px-4 py-3">
          <p className="font-ibm-mono text-[11px] text-[var(--portal-warning)]">{dataError}</p>
        </div>
      )}

      {!accountId && !dataError && (
        <div className="border border-dashed border-[var(--portal-border-strong)] p-8">
          <p className="font-ibm-mono text-[11px] text-[var(--portal-text-soft)]">No account linked yet.</p>
          <p className="mt-2 font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">
            Your Vazgro team will be shown here once your account is set up.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {uniqueMembers.map((member, i) => {
          const initials = getInitials(member);
          const color = avatarColors[i % avatarColors.length];
          const memberEngList = (memberEngagements.get(member.id) ?? [])
            .map((eid) => engagements.get(eid))
            .filter(Boolean) as EngagementRow[];
          const roleColor = roleColors[member.role] ?? "var(--portal-text-soft)";

          return (
            <div key={member.id} className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-6">
              <div className="mb-4 flex items-start gap-4">
                {/* Avatar */}
                <div
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center font-grotesk text-[16px] font-normal"
                  style={{ background: `${color}20`, color }}
                >
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-grotesk text-[16px] font-normal text-[var(--portal-text)]">{displayName(member)}</p>
                  <p className="mt-0.5 font-ibm-mono text-[10px]" style={{ color: roleColor }}>
                    {member.role.replace(/_/g, " ").toUpperCase()}
                  </p>
                  <a
                    href={`mailto:${member.email}`}
                    className="mt-1 block font-ibm-mono text-[10px] text-[var(--portal-text-soft)] transition-colors hover:text-[var(--portal-accent)]"
                  >
                    {member.email}
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-[var(--portal-border)] pt-4">
                <div>
                  <p className="font-ibm-mono text-[9px] tracking-[1px] text-[var(--portal-text-dim)]">TIMEZONE</p>
                  <p className="mt-1 font-ibm-mono text-[10px] text-[var(--portal-text-muted)]">
                    {member.timezone || "Europe/London"}
                  </p>
                </div>
                <div>
                  <p className="font-ibm-mono text-[9px] tracking-[1px] text-[var(--portal-text-dim)]">RESPONSE TIME</p>
                  <p className="mt-1 font-ibm-mono text-[10px] text-[var(--portal-text-muted)]">Within 1 business day</p>
                </div>
              </div>

              {memberEngList.length > 0 && (
                <div className="mt-4 border-t border-[var(--portal-border)] pt-4">
                  <p className="mb-2 font-ibm-mono text-[9px] tracking-[1px] text-[var(--portal-text-dim)]">PROJECTS</p>
                  <div className="flex flex-wrap gap-1.5">
                    {memberEngList.map((eng) => (
                      <span
                        key={eng.id}
                        className="px-2 py-1 font-ibm-mono text-[9px] tracking-[1px] text-[var(--portal-text-soft)]"
                        style={{ background: "var(--portal-surface-alt)", border: "1px solid var(--portal-border)" }}
                      >
                        {eng.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {uniqueMembers.length === 0 && accountId && !dataError && (
          <div className="col-span-full border border-[var(--portal-border)] bg-[var(--portal-surface)] p-8">
            <p className="font-ibm-mono text-[11px] text-[var(--portal-text-soft)]">No team members assigned yet.</p>
            <p className="mt-2 font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">
              Your Vazgro project manager will be assigned when your project kicks off.
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
        <p className="font-ibm-mono text-[10px] tracking-[1px] text-[var(--portal-text-dim)]">GENERAL CONTACT</p>
        <p className="mt-2 font-ibm-mono text-[11px] text-[var(--portal-text-muted)]">
          For general queries not related to a specific project:{" "}
          <a href="mailto:hello@vazgro.com" className="text-[var(--portal-accent)] hover:opacity-80">
            hello@vazgro.com
          </a>
        </p>
      </div>
    </div>
  );
}
