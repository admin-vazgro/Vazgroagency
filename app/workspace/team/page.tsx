import { requireWorkspaceAccess, getWorkspaceAdminClient, displayName, firstParam, type WorkspaceSearchParams } from "@/app/workspace/lib";
import TeamInviteForm from "./TeamInviteForm";

type ProfileRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  role: string;
  timezone: string | null;
};

type MemberRow = {
  account_id: string;
  profile_id: string;
  is_primary: boolean;
  workspace_role: string | null;
  created_at: string;
};

const roleColors: Record<string, string> = {
  admin: "var(--portal-accent)",
  ops: "var(--portal-warning)",
  delivery: "var(--portal-text-soft)",
  sales_manager: "var(--portal-accent)",
  internal_sales: "var(--portal-text-soft)",
};

const workspaceRoleColors: Record<string, string> = {
  owner: "var(--portal-accent)",
  member: "var(--portal-text-soft)",
  viewer: "var(--portal-text-dim)",
};

function getInitials(profile: ProfileRow) {
  const first = profile.first_name?.[0] ?? "";
  const last = profile.last_name?.[0] ?? "";
  return (first + last).toUpperCase() || profile.email[0].toUpperCase();
}

const avatarColors = ["var(--portal-accent)", "var(--portal-warning)", "var(--portal-text-soft)"];

export default async function TeamPage(props: { searchParams?: Promise<WorkspaceSearchParams> }) {
  const { user } = await requireWorkspaceAccess();
  const admin = getWorkspaceAdminClient();
  const searchParams = props.searchParams ? await props.searchParams : {};
  const activeTab = firstParam(searchParams.tab) || "your-team";
  const statusMessage = firstParam(searchParams.status);
  const errorMessage = firstParam(searchParams.error);

  const { data: membership } = await admin
    .from("account_members")
    .select("account_id, workspace_role")
    .eq("profile_id", user.id)
    .maybeSingle();

  const accountId = membership?.account_id ?? null;

  let clientMembers: MemberRow[] = [];
  let clientProfiles = new Map<string, ProfileRow>();
  let teamMembers: Array<{ profile_id: string; role: string; engagement_id: string }> = [];
  let hubProfiles = new Map<string, ProfileRow>();
  let dataError = "";

  if (accountId) {
    try {
      // Client team members
      const { data: membersData, error: membersError } = await admin
        .from("account_members")
        .select("account_id, profile_id, is_primary, workspace_role, created_at")
        .eq("account_id", accountId)
        .order("created_at");
      if (membersError) throw membersError;
      clientMembers = (membersData ?? []) as MemberRow[];

      const clientProfileIds = clientMembers.map((m) => m.profile_id);
      if (clientProfileIds.length) {
        const { data: profilesData } = await admin
          .from("profiles")
          .select("id, first_name, last_name, email, role, timezone")
          .in("id", clientProfileIds);
        clientProfiles = new Map((profilesData ?? []).map((p: ProfileRow) => [p.id, p]));
      }

      // Vazgro team members
      const { data: engData } = await admin
        .from("engagements")
        .select("id")
        .eq("account_id", accountId)
        .in("status", ["active", "paused"]);

      const engIds = (engData ?? []).map((e: { id: string }) => e.id);
      if (engIds.length) {
        const { data: teamData } = await admin
          .from("engagement_team")
          .select("profile_id, role, engagement_id")
          .in("engagement_id", engIds);
        teamMembers = (teamData ?? []) as typeof teamMembers;

        const hubProfileIds = [...new Set(teamMembers.map((t) => t.profile_id))];
        if (hubProfileIds.length) {
          const { data: hubProfileData } = await admin
            .from("profiles")
            .select("id, first_name, last_name, email, role, timezone")
            .in("id", hubProfileIds);
          hubProfiles = new Map((hubProfileData ?? []).map((p: ProfileRow) => [p.id, p]));
        }
      }
    } catch (err) {
      dataError = err instanceof Error ? err.message : "Unable to load team.";
    }
  }

  const uniqueHubMembers = [...hubProfiles.values()];

  return (
    <div className="p-8">
      <div className="mb-6 border-b border-[var(--portal-border)] pb-6">
        <span className="font-ibm-mono text-[10px] tracking-[3px] text-[var(--portal-accent)]">// TEAM</span>
        <h1 className="mt-1 font-grotesk text-[32px] font-normal tracking-[-1px] text-[var(--portal-text)]">Team</h1>
        <p className="mt-1 font-ibm-mono text-[12px] tracking-[0.5px] text-[var(--portal-text-soft)]">
          Manage your team and view your Vazgro contacts.
        </p>
      </div>

      {/* Tab navigation */}
      <div className="mb-6 flex gap-0 border-b border-[var(--portal-border)]">
        {[
          { key: "your-team", label: `Your Team (${clientMembers.length})` },
          { key: "vazgro-team", label: `Your Vazgro Team (${uniqueHubMembers.length})` },
        ].map((tab) => (
          <a
            key={tab.key}
            href={`?tab=${tab.key}`}
            className="px-6 py-3 font-ibm-mono text-[10px] tracking-[1px] transition-colors border-b-2"
            style={{
              color: activeTab === tab.key ? "var(--portal-accent)" : "var(--portal-text-muted)",
              borderColor: activeTab === tab.key ? "var(--portal-accent)" : "transparent",
            }}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {statusMessage && (
        <div className="mb-6 border border-[var(--portal-accent)] bg-[var(--portal-accent-soft)] px-4 py-3">
          <p className="font-ibm-mono text-[11px] text-[var(--portal-accent)]">{statusMessage}</p>
        </div>
      )}
      {(errorMessage || dataError) && (
        <div className="mb-6 border border-[var(--portal-warning)] bg-[var(--portal-warning-soft)] px-4 py-3">
          <p className="font-ibm-mono text-[11px] text-[var(--portal-warning)]">{errorMessage || dataError}</p>
        </div>
      )}

      {/* ── YOUR TEAM TAB ── */}
      {activeTab === "your-team" && (
        <div className="flex flex-col gap-6">
          {/* Invite form */}
          <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-6">
            <p className="mb-4 font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-muted)]">INVITE A TEAM MEMBER</p>
            <TeamInviteForm />
          </div>

          {/* Team table */}
          {clientMembers.length > 0 && (
            <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
              <div className="grid grid-cols-[1fr_120px_100px_120px] gap-4 border-b border-[var(--portal-border)] px-5 py-3">
                {["Name", "Role", "Status", "Joined"].map((h) => (
                  <span key={h} className="font-ibm-mono text-[9px] tracking-[2px] text-[var(--portal-text-dim)]">{h}</span>
                ))}
              </div>
              {clientMembers.map((member) => {
                const profile = clientProfiles.get(member.profile_id);
                if (!profile) return null;
                const isCurrentUser = member.profile_id === user.id;
                const wsRole = member.workspace_role || (member.is_primary ? "owner" : "member");
                return (
                  <div
                    key={member.profile_id}
                    className="grid grid-cols-[1fr_120px_100px_120px] gap-4 border-b border-[var(--portal-border)] px-5 py-4 hover:bg-[var(--portal-surface-alt)] items-center last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center font-ibm-mono text-[11px]"
                        style={{ background: "var(--portal-border)", color: "var(--portal-text-soft)" }}
                      >
                        {getInitials(profile)}
                      </div>
                      <div>
                        <p className="font-ibm-mono text-[11px] text-[var(--portal-text)]">
                          {displayName(profile)}{isCurrentUser && <span className="ml-2 font-ibm-mono text-[9px] text-[var(--portal-text-dim)]">(you)</span>}
                        </p>
                        <p className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">{profile.email}</p>
                      </div>
                    </div>
                    <span
                      className="font-ibm-mono text-[9px] tracking-[1px] px-2 py-1 w-fit"
                      style={{ background: "var(--portal-border)", color: workspaceRoleColors[wsRole] ?? "var(--portal-text-soft)" }}
                    >
                      {wsRole.toUpperCase()}
                    </span>
                    <span className="font-ibm-mono text-[10px] text-[var(--portal-accent)]">ACTIVE</span>
                    <span className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">
                      {new Date(member.created_at).toLocaleDateString("en-GB")}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {clientMembers.length === 0 && (
            <div className="border border-dashed border-[var(--portal-border-strong)] p-8 text-center">
              <p className="font-ibm-mono text-[11px] text-[var(--portal-text-soft)]">No team members yet.</p>
              <p className="mt-2 font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">Invite colleagues above to give them access to your workspace.</p>
            </div>
          )}

          <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
            <p className="font-ibm-mono text-[10px] tracking-[1.5px] text-[var(--portal-text-muted)] mb-2">ROLES EXPLAINED</p>
            <div className="flex flex-col gap-2">
              {[
                ["OWNER", "Full access including billing and team management"],
                ["MEMBER", "Can create requests, approve deliverables, upload to Brand Hub, comment"],
                ["VIEWER", "Read-only access — cannot submit requests or upload files"],
              ].map(([role, desc]) => (
                <div key={role} className="flex gap-3">
                  <span className="font-ibm-mono text-[9px] tracking-[1px] text-[var(--portal-accent)] shrink-0 mt-0.5 w-[52px]">{role}</span>
                  <span className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── VAZGRO TEAM TAB ── */}
      {activeTab === "vazgro-team" && (
        <div className="flex flex-col gap-4">
          {uniqueHubMembers.length === 0 && (
            <div className="border border-dashed border-[var(--portal-border-strong)] p-8">
              <p className="font-ibm-mono text-[11px] text-[var(--portal-text-soft)]">No team members assigned yet.</p>
              <p className="mt-2 font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">
                Your Vazgro project manager will be assigned when your project kicks off.
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {uniqueHubMembers.map((member, i) => {
              const initials = getInitials(member);
              const color = avatarColors[i % avatarColors.length];
              const roleColor = roleColors[member.role] ?? "var(--portal-text-soft)";
              return (
                <div key={member.id} className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-6">
                  <div className="flex items-start gap-4">
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
                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[var(--portal-border)] pt-4">
                    <div>
                      <p className="font-ibm-mono text-[9px] tracking-[1px] text-[var(--portal-text-dim)]">TIMEZONE</p>
                      <p className="mt-1 font-ibm-mono text-[10px] text-[var(--portal-text-muted)]">{member.timezone || "Europe/London"}</p>
                    </div>
                    <div>
                      <p className="font-ibm-mono text-[9px] tracking-[1px] text-[var(--portal-text-dim)]">RESPONSE TIME</p>
                      <p className="mt-1 font-ibm-mono text-[10px] text-[var(--portal-text-muted)]">Within 1 business day</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
            <p className="font-ibm-mono text-[10px] tracking-[1px] text-[var(--portal-text-dim)]">GENERAL CONTACT</p>
            <p className="mt-2 font-ibm-mono text-[11px] text-[var(--portal-text-muted)]">
              For general queries:{" "}
              <a href="mailto:hello@vazgro.com" className="text-[var(--portal-accent)] hover:opacity-80">hello@vazgro.com</a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
