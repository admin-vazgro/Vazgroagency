"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import type { AppRole } from "@/lib/auth/roles";
import { getHubAdminClient, requireHubAccess } from "./lib";

const LEAD_STAGES = [
  "new",
  "contacted",
  "qualified",
  "proposal_sent",
  "negotiating",
  "closed_won",
  "closed_lost",
  "recycled",
] as const;

const PILLARS = ["LAUNCH", "GROW", "BUILD"] as const;
const ENGAGEMENT_STATUSES = ["active", "paused", "completed", "cancelled"] as const;
const PARTNER_TIERS = ["tier1", "tier2", "tier3", "white_label"] as const;
const PARTNER_TYPES = ["referral", "commission_sdr", "white_label"] as const;
const PARTNER_STATUSES = ["pending", "active", "suspended", "rejected"] as const;

function getField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getOptionalNumber(formData: FormData, key: string) {
  const value = getField(formData, key);
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getOptionalDate(formData: FormData, key: string) {
  const value = getField(formData, key);
  return value || null;
}

function isAllowedValue<T extends readonly string[]>(value: string, allowed: T): value is T[number] {
  return allowed.includes(value as T[number]);
}

function toPageMessage(path: string, key: string, value: string) {
  return `${path}?${key}=${encodeURIComponent(value)}`;
}

function getAdminClientOrRedirect(path: string) {
  try {
    return getHubAdminClient();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Supabase admin client is not configured.";
    redirect(toPageMessage(path, "error", message));
  }
}

async function ensureProfileRecord(
  admin: ReturnType<typeof getHubAdminClient>,
  user: User,
  role: AppRole
) {
  const { data: existingProfile, error: lookupError } = await admin
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (lookupError) {
    throw lookupError;
  }

  if (existingProfile?.id) {
    return user.id;
  }

  const firstName =
    typeof user.user_metadata?.first_name === "string" ? user.user_metadata.first_name.trim() : null;
  const lastName =
    typeof user.user_metadata?.last_name === "string" ? user.user_metadata.last_name.trim() : null;

  const { error: upsertError } = await admin.from("profiles").upsert({
    id: user.id,
    email: user.email ?? "",
    first_name: firstName || null,
    last_name: lastName || null,
    role,
  });

  if (upsertError) {
    throw upsertError;
  }

  return user.id;
}

export async function createLeadAction(formData: FormData) {
  const { user, role } = await requireHubAccess();
  const firstName = getField(formData, "first_name");
  const lastName = getField(formData, "last_name");
  const email = getField(formData, "email").toLowerCase();
  const company = getField(formData, "company");
  const website = getField(formData, "website");
  const country = getField(formData, "country");
  const pillar = getField(formData, "pillar");
  const stage = getField(formData, "stage");
  const source = getField(formData, "source");
  const notes = getField(formData, "notes");

  if (!firstName || !email) {
    redirect(toPageMessage("/hub/leads", "error", "First name and email are required."));
  }

  if (pillar && !isAllowedValue(pillar, PILLARS)) {
    redirect(toPageMessage("/hub/leads", "error", "Invalid service pillar."));
  }

  if (stage && !isAllowedValue(stage, LEAD_STAGES)) {
    redirect(toPageMessage("/hub/leads", "error", "Invalid lead stage."));
  }

  const admin = getAdminClientOrRedirect("/hub/leads");
  let ownerId: string | null = null;
  try {
    ownerId = await ensureProfileRecord(admin, user, role);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to prepare the user profile for lead ownership.";
    redirect(toPageMessage("/hub/leads", "error", message));
  }

  const { error } = await admin.from("leads").insert({
    first_name: firstName,
    last_name: lastName || null,
    email,
    company: company || null,
    website: website || null,
    country: country || null,
    pillar: pillar || null,
    stage: stage || "new",
    source: source || null,
    notes: notes || null,
    owner_id: ownerId,
    sla_contacted_deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  });

  if (error) {
    redirect(toPageMessage("/hub/leads", "error", error.message));
  }

  revalidatePath("/hub");
  revalidatePath("/hub/leads");
  redirect(toPageMessage("/hub/leads", "status", `Lead created: ${email}`));
}

export async function createAccountAction(formData: FormData) {
  await requireHubAccess();
  const name = getField(formData, "name");
  const website = getField(formData, "website");
  const industry = getField(formData, "industry");
  const country = getField(formData, "country");
  const notes = getField(formData, "notes");
  const mrr = getOptionalNumber(formData, "mrr_gbp");

  if (!name) {
    redirect(toPageMessage("/hub/accounts", "error", "Account name is required."));
  }

  const admin = getAdminClientOrRedirect("/hub/accounts");
  const { error } = await admin.from("accounts").insert({
    name,
    website: website || null,
    industry: industry || null,
    country: country || "GB",
    notes: notes || null,
    mrr_gbp: mrr ?? 0,
  });

  if (error) {
    redirect(toPageMessage("/hub/accounts", "error", error.message));
  }

  revalidatePath("/hub");
  revalidatePath("/hub/accounts");
  redirect(toPageMessage("/hub/accounts", "status", `Account created: ${name}`));
}

export async function createEngagementAction(formData: FormData) {
  const { user, role } = await requireHubAccess();
  const accountId = getField(formData, "account_id");
  const title = getField(formData, "title");
  const pillar = getField(formData, "pillar");
  const status = getField(formData, "status");
  const brief = getField(formData, "brief");
  const startDate = getOptionalDate(formData, "start_date");
  const endDate = getOptionalDate(formData, "end_date");
  const monthlyValue = getOptionalNumber(formData, "monthly_value_gbp");

  if (!title || !pillar) {
    redirect(toPageMessage("/hub/engagements", "error", "Title and pillar are required."));
  }

  if (!isAllowedValue(pillar, PILLARS)) {
    redirect(toPageMessage("/hub/engagements", "error", "Invalid service pillar."));
  }

  if (status && !isAllowedValue(status, ENGAGEMENT_STATUSES)) {
    redirect(toPageMessage("/hub/engagements", "error", "Invalid engagement status."));
  }

  const admin = getAdminClientOrRedirect("/hub/engagements");
  let projectManagerId: string | null = null;
  try {
    projectManagerId = await ensureProfileRecord(admin, user, role);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to prepare the user profile for project assignment.";
    redirect(toPageMessage("/hub/engagements", "error", message));
  }

  const { error } = await admin.from("engagements").insert({
    account_id: accountId || null,
    pillar,
    title,
    status: status || "active",
    pm_id: projectManagerId,
    brief: brief || null,
    start_date: startDate,
    end_date: endDate,
    monthly_value_gbp: monthlyValue,
  });

  if (error) {
    redirect(toPageMessage("/hub/engagements", "error", error.message));
  }

  revalidatePath("/hub");
  revalidatePath("/hub/engagements");
  revalidatePath("/hub/admin");
  redirect(toPageMessage("/hub/engagements", "status", `Engagement created: ${title}`));
}

export async function createPartnerAction(formData: FormData) {
  await requireHubAccess();
  const email = getField(formData, "email").toLowerCase();
  const password = getField(formData, "password");
  const firstName = getField(formData, "first_name");
  const lastName = getField(formData, "last_name");
  const companyName = getField(formData, "company_name");
  const tier = getField(formData, "tier");
  const type = getField(formData, "type");
  const status = getField(formData, "status");

  if (!email || !password || !companyName) {
    redirect(toPageMessage("/hub/partners", "error", "Email, temporary password, and company name are required."));
  }

  if (!isAllowedValue(tier || "tier1", PARTNER_TIERS)) {
    redirect(toPageMessage("/hub/partners", "error", "Invalid partner tier."));
  }

  if (!isAllowedValue(type || "referral", PARTNER_TYPES)) {
    redirect(toPageMessage("/hub/partners", "error", "Invalid partner type."));
  }

  if (!isAllowedValue(status || "pending", PARTNER_STATUSES)) {
    redirect(toPageMessage("/hub/partners", "error", "Invalid partner status."));
  }

  const admin = getAdminClientOrRedirect("/hub/partners");
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { role: "partner" },
    user_metadata: {
      first_name: firstName,
      last_name: lastName,
      role: "partner",
    },
  });

  if (error || !data.user) {
    redirect(toPageMessage("/hub/partners", "error", error?.message ?? "Unable to create partner login."));
  }

  const { error: profileError } = await admin.from("profiles").upsert({
    id: data.user.id,
    email,
    first_name: firstName || null,
    last_name: lastName || null,
    role: "partner",
    company: companyName,
  });

  if (profileError) {
    // Clean up the auth user so the invite can be retried without a duplicate-email error.
    await admin.auth.admin.deleteUser(data.user.id);
    redirect(toPageMessage("/hub/partners", "error", profileError.message));
  }

  const { error: partnerError } = await admin.from("partners").insert({
    profile_id: data.user.id,
    company_name: companyName,
    tier: tier || "tier1",
    type: type || "referral",
    status: status || "pending",
  });

  if (partnerError) {
    // Clean up both auth user and profile so the invite can be retried cleanly.
    await admin.from("profiles").delete().eq("id", data.user.id);
    await admin.auth.admin.deleteUser(data.user.id);
    redirect(toPageMessage("/hub/partners", "error", partnerError.message));
  }

  revalidatePath("/hub");
  revalidatePath("/hub/partners");
  revalidatePath("/hub/admin");
  redirect(toPageMessage("/hub/partners", "status", `Partner invited: ${email}`));
}
