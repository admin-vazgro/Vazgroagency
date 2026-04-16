import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

    const body = await req.json();
    const { email, role = "member", project_ids = [] } = body;

    if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });

    const validRoles = ["owner", "member", "viewer"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: `role must be one of: ${validRoles.join(", ")}` }, { status: 400 });
    }

    const admin = createAdminClient();

    // Get the inviting user's account
    const { data: membership } = await admin
      .from("account_members")
      .select("account_id, role")
      .eq("profile_id", user.id)
      .maybeSingle();

    if (!membership) return NextResponse.json({ error: "No account linked" }, { status: 403 });

    // Only owners can invite
    // (We'll allow any member to invite for now, restrict with role check if needed)

    // Check if the invitee already has an account membership
    const { data: existingProfile } = await admin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    let inviteeProfileId: string;

    if (existingProfile) {
      inviteeProfileId = existingProfile.id;
      // Check if already in this account
      const { data: existingMembership } = await admin
        .from("account_members")
        .select("id")
        .eq("account_id", membership.account_id)
        .eq("profile_id", inviteeProfileId)
        .maybeSingle();

      if (existingMembership) {
        return NextResponse.json({ error: "This user is already in your team" }, { status: 409 });
      }
    } else {
      // Create a new auth user and invite them
      const { data: authData, error: authError } = await admin.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${APP_URL}/auth/callback?next=/workspace`,
        data: { role: "client" },
      });

      if (authError) throw authError;
      inviteeProfileId = authData.user.id;

      // Create profile
      await admin.from("profiles").upsert({
        id: inviteeProfileId,
        email,
        role: "client",
      });
    }

    // Add to account
    await admin.from("account_members").insert({
      account_id: membership.account_id,
      profile_id: inviteeProfileId,
      is_primary: false,
      workspace_role: role,
    });

    // Log activity
    await admin.from("activities").insert({
      type: "team_member_invited",
      subject: email,
      body: JSON.stringify({ invited_by: user.id, role, account_id: membership.account_id }),
    });

    return NextResponse.json({ ok: true, message: `Invitation sent to ${email}` }, { status: 201 });
  } catch (err) {
    console.error("[api/workspace/invite] error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
