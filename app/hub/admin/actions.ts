"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { canUseLocalAdminAccess, resolveUserRole } from "@/lib/auth/resolve-role";
import { ALL_APP_ROLES } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function getField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function toQueryMessage(key: string, value: string) {
  return `/hub/admin?${key}=${encodeURIComponent(value)}`;
}

async function requireAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const role = await resolveUserRole(supabase, user);
  if (role !== "admin" && !canUseLocalAdminAccess(user)) redirect("/hub");

  return user;
}

function getAdminClientOrRedirect() {
  try {
    return createAdminClient();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Supabase admin client is not configured.";
    redirect(toQueryMessage("error", message));
  }
}

function parseSettingValue(value: string) {
  if (!value) return "";

  try {
    return JSON.parse(value);
  } catch {
    if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  }
}

export async function createUserAction(formData: FormData) {
  const currentUser = await requireAdminUser();
  const email = getField(formData, "email").toLowerCase();
  const password = getField(formData, "password");
  const firstName = getField(formData, "first_name");
  const lastName = getField(formData, "last_name");
  const role = getField(formData, "role");

  if (!email || !password || !role) {
    redirect(toQueryMessage("error", "Email, password, and role are required."));
  }

  if (!(ALL_APP_ROLES as readonly string[]).includes(role)) {
    redirect(toQueryMessage("error", "Role is invalid."));
  }

  const admin = getAdminClientOrRedirect();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { role },
    user_metadata: {
      first_name: firstName,
      last_name: lastName,
      role,
    },
  });

  if (error || !data.user) {
    redirect(toQueryMessage("error", error?.message ?? "Unable to create user."));
  }

  const { error: profileError } = await admin.from("profiles").upsert({
    id: data.user.id,
    email,
    first_name: firstName || null,
    last_name: lastName || null,
    role,
  });

  if (profileError) {
    // Clean up the auth user so creation can be retried without a duplicate-email error.
    await admin.auth.admin.deleteUser(data.user.id);
    redirect(toQueryMessage("error", profileError.message));
  }

  revalidatePath("/hub/admin");
  redirect(toQueryMessage("status", `User created: ${email}`));
}

export async function deleteUserAction(formData: FormData) {
  const currentUser = await requireAdminUser();
  const userId = getField(formData, "user_id");
  const email = getField(formData, "email");

  if (!userId) {
    redirect(toQueryMessage("error", "User id is required."));
  }

  if (userId === currentUser.id) {
    redirect(toQueryMessage("error", "You cannot delete your own admin account."));
  }

  const admin = getAdminClientOrRedirect();

  // Delete the profile row first so no orphaned record remains if auth deletion fails.
  await admin.from("profiles").delete().eq("id", userId);

  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) {
    redirect(toQueryMessage("error", error.message));
  }

  revalidatePath("/hub/admin");
  redirect(toQueryMessage("status", `Deleted user: ${email || userId}`));
}

export async function updateSettingAction(formData: FormData) {
  const currentUser = await requireAdminUser();
  const key = getField(formData, "key");
  const rawValue = getField(formData, "value");

  if (!key) {
    redirect(toQueryMessage("error", "Setting key is required."));
  }

  const admin = getAdminClientOrRedirect();
  const { error } = await admin
    .from("hub_settings")
    .update({
      value: parseSettingValue(rawValue),
      updated_by: currentUser.id,
      updated_at: new Date().toISOString(),
    })
    .eq("key", key);

  if (error) {
    redirect(toQueryMessage("error", error.message));
  }

  revalidatePath("/hub/admin");
  redirect(toQueryMessage("status", `Updated setting: ${key}`));
}

export async function assignStaffAction(formData: FormData) {
  await requireAdminUser();
  const engagementId = getField(formData, "engagement_id");
  const profileId = getField(formData, "profile_id");
  const role = getField(formData, "assignment_role");

  if (!engagementId || !profileId || !role) {
    redirect(toQueryMessage("error", "Engagement, staff member, and assignment role are required."));
  }

  const admin = getAdminClientOrRedirect();
  const { data: existingAssignment } = await admin
    .from("engagement_team")
    .select("id")
    .eq("engagement_id", engagementId)
    .eq("profile_id", profileId)
    .eq("role", role)
    .maybeSingle();

  if (!existingAssignment) {
    const { error } = await admin.from("engagement_team").insert({
      engagement_id: engagementId,
      profile_id: profileId,
      role,
    });

    if (error) {
      redirect(toQueryMessage("error", error.message));
    }
  }

  if (role.toLowerCase().includes("project manager") || role.toLowerCase() === "pm") {
    const { error: pmError } = await admin
      .from("engagements")
      .update({ pm_id: profileId })
      .eq("id", engagementId);

    if (pmError) {
      redirect(toQueryMessage("error", pmError.message));
    }
  }

  revalidatePath("/hub/admin");
  revalidatePath("/hub/engagements");
  redirect(toQueryMessage("status", "Staff assigned to engagement."));
}

export async function removeAssignmentAction(formData: FormData) {
  await requireAdminUser();
  const assignmentId = getField(formData, "assignment_id");
  const engagementId = getField(formData, "engagement_id");

  if (!assignmentId || !engagementId) {
    redirect(toQueryMessage("error", "Assignment id is required."));
  }

  const admin = getAdminClientOrRedirect();
  const { data: assignment } = await admin
    .from("engagement_team")
    .select("profile_id")
    .eq("id", assignmentId)
    .maybeSingle();

  const { error } = await admin
    .from("engagement_team")
    .delete()
    .eq("id", assignmentId);

  if (error) {
    redirect(toQueryMessage("error", error.message));
  }

  if (assignment?.profile_id) {
    const { data: engagement } = await admin
      .from("engagements")
      .select("pm_id")
      .eq("id", engagementId)
      .maybeSingle();

    if (engagement?.pm_id === assignment.profile_id) {
      await admin.from("engagements").update({ pm_id: null }).eq("id", engagementId);
    }
  }

  revalidatePath("/hub/admin");
  revalidatePath("/hub/engagements");
  redirect(toQueryMessage("status", "Assignment removed."));
}
