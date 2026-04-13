"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getWorkspaceAdminClient } from "./lib";

function getField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return user;
}

export async function submitRequestAction(formData: FormData) {
  const user = await getAuthenticatedUser();
  const title = getField(formData, "title");
  const description = getField(formData, "description");
  const engagementId = getField(formData, "engagement_id");
  const priority = getField(formData, "priority") || "normal";

  if (!title) {
    redirect("/workspace/requests?error=" + encodeURIComponent("Title is required."));
  }
  if (!engagementId) {
    redirect("/workspace/requests?error=" + encodeURIComponent("Please select a project."));
  }

  const admin = getWorkspaceAdminClient();

  // Resolve account_id from the engagement row
  const { data: engagement } = await admin
    .from("engagements")
    .select("account_id")
    .eq("id", engagementId)
    .maybeSingle();

  const { error } = await admin.from("requests").insert({
    engagement_id: engagementId,
    account_id: engagement?.account_id ?? null,
    submitted_by: user.id,
    title,
    description: description || null,
    priority: priority as "low" | "normal" | "high" | "urgent",
    status: "submitted",
  });

  if (error) {
    redirect("/workspace/requests?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/workspace");
  revalidatePath("/workspace/requests");
  redirect("/workspace/requests?status=" + encodeURIComponent("Request submitted."));
}

export async function updateProfileAction(formData: FormData) {
  const user = await getAuthenticatedUser();
  const firstName = getField(formData, "first_name");
  const lastName = getField(formData, "last_name");
  const phone = getField(formData, "phone");
  const company = getField(formData, "company");
  const timezone = getField(formData, "timezone");

  const admin = getWorkspaceAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({
      first_name: firstName || null,
      last_name: lastName || null,
      phone: phone || null,
      company: company || null,
      timezone: timezone || "Europe/London",
    })
    .eq("id", user.id);

  if (error) {
    redirect("/workspace/settings?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/workspace");
  revalidatePath("/workspace/settings");
  redirect("/workspace/settings?status=" + encodeURIComponent("Profile updated."));
}

export async function approveDeliverableAction(deliverableId: string) {
  const user = await getAuthenticatedUser();
  const admin = getWorkspaceAdminClient();

  const { error } = await admin
    .from("deliverables")
    .update({
      approved_by: user.id,
      approved_at: new Date().toISOString(),
    })
    .eq("id", deliverableId);

  if (error) throw new Error(error.message);

  revalidatePath("/workspace");
  revalidatePath("/workspace/files");
}

export async function requestRevisionAction(deliverableId: string, notes: string) {
  await getAuthenticatedUser();
  const admin = getWorkspaceAdminClient();

  // Store notes on the deliverable and flag the linked request as revision_requested
  const { data: deliverable } = await admin
    .from("deliverables")
    .select("request_id")
    .eq("id", deliverableId)
    .maybeSingle();

  await admin
    .from("deliverables")
    .update({ sign_off_notes: notes || null })
    .eq("id", deliverableId);

  if (deliverable?.request_id) {
    await admin
      .from("requests")
      .update({ status: "revision_requested", revision_notes: notes || null })
      .eq("id", deliverable.request_id);
  }

  revalidatePath("/workspace");
  revalidatePath("/workspace/files");
}
