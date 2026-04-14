"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPartnerAdminClient, getPartnerCapSettings, getPartnerContext, getPartnerLeadCap } from "./lib";

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

const DEAL_STAGES = [
  "discovery",
  "proposal",
  "negotiating",
  "closed_won",
  "closed_lost",
] as const;

const ACTIVE_LEAD_STAGES = new Set(["new", "contacted", "qualified", "proposal_sent", "negotiating"]);
const TERMINAL_LEAD_STAGES = new Set(["closed_won", "closed_lost", "recycled"]);

function getField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function encodeMessage(path: string, key: string, value: string) {
  return `${path}?${key}=${encodeURIComponent(value)}`;
}

function redirectWithMessage(path: string, key: "status" | "error", value: string): never {
  redirect(encodeMessage(path, key, value));
}

function ensureAllowed<T extends readonly string[]>(value: string, allowed: T) {
  return allowed.includes(value as T[number]);
}

async function getScopedLead(
  admin: ReturnType<typeof getPartnerAdminClient>,
  userId: string,
  partnerId: string,
  leadId: string
) {
  const { data, error } = await admin
    .from("leads")
    .select("id, stage, owner_id, partner_id, referrer_id, company, first_name, last_name")
    .eq("id", leadId)
    .maybeSingle();

  if (error) throw error;
  if (!data || (data.owner_id !== userId && data.partner_id !== partnerId)) {
    return null;
  }

  return data;
}

async function getScopedDeal(
  admin: ReturnType<typeof getPartnerAdminClient>,
  partnerId: string,
  dealId: string
) {
  const { data, error } = await admin
    .from("deals")
    .select("id, stage, partner_id, referrer_id, title, pillar")
    .eq("id", dealId)
    .maybeSingle();

  if (error) throw error;
  if (!data || (data.partner_id !== partnerId && data.referrer_id !== partnerId)) {
    return null;
  }

  return data;
}

export async function submitLeadAction(formData: FormData) {
  const { user, admin, partner } = await getPartnerContext();

  if (partner.status !== "active") {
    redirectWithMessage("/partners/leads", "error", "Your partner account is not active.");
  }

  const firstName = getField(formData, "first_name");
  const email = getField(formData, "email").toLowerCase();
  const company = getField(formData, "company");
  const pillar = getField(formData, "pillar");
  const source = getField(formData, "source");
  const notes = getField(formData, "notes");
  const estimatedValueRaw = getField(formData, "estimated_value_gbp");
  const estimatedValue = estimatedValueRaw ? Number(estimatedValueRaw) || null : null;
  const servicesRaw = formData.getAll("services_interested");
  const services = servicesRaw.filter((v): v is string => typeof v === "string" && v.length > 0);

  if (!firstName || !email) {
    redirectWithMessage("/partners/leads", "error", "First name and email are required.");
  }

  const capSettings = await getPartnerCapSettings(admin);
  const cap = getPartnerLeadCap(partner, capSettings);
  const openCount = partner.open_leads_count ?? 0;
  if (openCount >= cap) {
    redirectWithMessage(
      "/partners/leads",
      "error",
      `You have reached your concurrent leads cap (${cap}). Release or close a lead before adding another.`
    );
  }

  const { error } = await admin.from("leads").insert({
    first_name: firstName,
    last_name: getField(formData, "last_name") || null,
    email,
    company: company || null,
    website: getField(formData, "website") || null,
    country: getField(formData, "country") || null,
    pillar: pillar || null,
    stage: "new",
    source: source || "partner_referral",
    notes: notes || null,
    estimated_value_gbp: estimatedValue,
    services_interested: services.length > 0 ? services : null,
    owner_id: user.id,
    partner_id: partner.id,
    referrer_id: partner.id,
    last_activity_at: new Date().toISOString(),
    sla_contacted_deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  });

  if (error) {
    redirectWithMessage("/partners/leads", "error", error.message);
  }

  await admin
    .from("partners")
    .update({ open_leads_count: openCount + 1 })
    .eq("id", partner.id);

  revalidatePath("/partners");
  revalidatePath("/partners/leads");
  redirectWithMessage("/partners/leads", "status", `Lead submitted: ${email}`);
}

export async function claimLeadFromPoolAction(formData: FormData) {
  const { user, admin, partner } = await getPartnerContext();

  if (partner.status !== "active") {
    redirectWithMessage("/partners/leads", "error", "Your partner account must be active to claim pool leads.");
  }
  if (!partner.kyc_verified) {
    redirectWithMessage("/partners/leads", "error", "Complete KYC verification before claiming pool leads.");
  }

  const capSettings = await getPartnerCapSettings(admin);
  const cap = getPartnerLeadCap(partner, capSettings);
  const openCount = partner.open_leads_count ?? 0;
  if (openCount >= cap) {
    redirectWithMessage("/partners/leads", "error", `Lead cap reached (${cap}).`);
  }

  const leadId = getField(formData, "lead_id");
  if (!leadId) {
    redirectWithMessage("/partners/leads", "error", "Select a lead to claim.");
  }

  const { data: lead, error: lookupError } = await admin
    .from("leads")
    .select("id, company, first_name, last_name, owner_id, partner_id, stage")
    .eq("id", leadId)
    .is("owner_id", null)
    .is("partner_id", null)
    .maybeSingle();

  if (lookupError) {
    redirectWithMessage("/partners/leads", "error", lookupError.message);
  }
  if (!lead) {
    redirectWithMessage("/partners/leads", "error", "That lead is no longer available in the pool.");
  }

  const { error } = await admin
    .from("leads")
    .update({
      owner_id: user.id,
      partner_id: partner.id,
      last_activity_at: new Date().toISOString(),
      sla_contacted_deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    })
    .eq("id", leadId)
    .is("owner_id", null)
    .is("partner_id", null);

  if (error) {
    redirectWithMessage("/partners/leads", "error", error.message);
  }

  await admin
    .from("partners")
    .update({ open_leads_count: openCount + 1 })
    .eq("id", partner.id);

  await admin.from("activities").insert({
    lead_id: leadId,
    performed_by: user.id,
    type: "claim",
    subject: "Lead claimed from pool",
    metadata: { via: "partner_portal" },
  });

  const leadName = lead.company || [lead.first_name, lead.last_name].filter(Boolean).join(" ") || leadId.slice(0, 8);
  revalidatePath("/partners");
  revalidatePath("/partners/leads");
  redirectWithMessage("/partners/leads", "status", `Claimed lead: ${leadName}`);
}

export async function advanceLeadStageAction(formData: FormData) {
  const { user, admin, partner } = await getPartnerContext();
  const leadId = getField(formData, "lead_id");
  const newStage = getField(formData, "stage");
  const redirectTo = getField(formData, "redirect_to") || "/partners/leads";

  if (!ensureAllowed(newStage, LEAD_STAGES)) {
    redirectWithMessage(redirectTo, "error", "Invalid lead stage.");
  }

  const lead = await getScopedLead(admin, user.id, partner.id, leadId);
  if (!lead) {
    redirectWithMessage("/partners/leads", "error", "Lead not found or access denied.");
  }

  const { error } = await admin
    .from("leads")
    .update({
      stage: newStage,
      last_activity_at: new Date().toISOString(),
      recycled_at: newStage === "recycled" ? new Date().toISOString() : null,
    })
    .eq("id", leadId);

  if (error) {
    redirectWithMessage(redirectTo, "error", error.message);
  }

  const wasActive = ACTIVE_LEAD_STAGES.has(lead.stage);
  const isActive = ACTIVE_LEAD_STAGES.has(newStage);
  const currentOpen = partner.open_leads_count ?? 0;
  if (wasActive && !isActive) {
    await admin.from("partners").update({ open_leads_count: Math.max(0, currentOpen - 1) }).eq("id", partner.id);
  }
  if (!wasActive && isActive) {
    await admin.from("partners").update({ open_leads_count: currentOpen + 1 }).eq("id", partner.id);
  }

  await admin.from("activities").insert({
    lead_id: leadId,
    performed_by: user.id,
    type: "stage_change",
    subject: `Lead stage changed to ${newStage}`,
    metadata: { from: lead.stage, to: newStage },
  });

  revalidatePath("/partners");
  revalidatePath("/partners/leads");
  redirectWithMessage(redirectTo, "status", "Lead updated.");
}

export async function releaseLeadAction(formData: FormData) {
  const { user, admin, partner } = await getPartnerContext();
  const leadId = getField(formData, "lead_id");
  const reason = getField(formData, "reason");

  if (!reason) {
    redirectWithMessage("/partners/leads", "error", "Give a reason before releasing the lead.");
  }

  const lead = await getScopedLead(admin, user.id, partner.id, leadId);
  if (!lead) {
    redirectWithMessage("/partners/leads", "error", "Lead not found or access denied.");
  }

  const { error } = await admin
    .from("leads")
    .update({
      owner_id: null,
      stage: "recycled",
      recycled_at: new Date().toISOString(),
      last_activity_at: new Date().toISOString(),
    })
    .eq("id", leadId);

  if (error) {
    redirectWithMessage("/partners/leads", "error", error.message);
  }

  await admin.from("activities").insert({
    lead_id: leadId,
    performed_by: user.id,
    type: "reassignment_request",
    subject: "Lead released back to pool",
    body: reason,
    metadata: { previous_partner_id: partner.id },
  });

  const currentOpen = partner.open_leads_count ?? 0;
  await admin
    .from("partners")
    .update({ open_leads_count: Math.max(0, currentOpen - 1) })
    .eq("id", partner.id);

  revalidatePath("/partners");
  revalidatePath("/partners/leads");
  redirectWithMessage("/partners/leads", "status", "Lead released back to the pool.");
}

export async function logActivityAction(formData: FormData) {
  const { user, admin, partner } = await getPartnerContext();

  const leadId = getField(formData, "lead_id");
  const dealId = getField(formData, "deal_id");
  const redirectTo = getField(formData, "redirect_to") || (dealId ? "/partners/deals" : "/partners/leads");
  const activityType = getField(formData, "type") || "note";
  const subject = getField(formData, "subject");
  const body = getField(formData, "body");

  if (!subject || (!leadId && !dealId)) {
    redirectWithMessage(redirectTo, "error", "Pick a record and enter a subject.");
  }

  if (leadId) {
    const lead = await getScopedLead(admin, user.id, partner.id, leadId);
    if (!lead) {
      redirectWithMessage(redirectTo, "error", "Lead not found or access denied.");
    }
  }

  if (dealId) {
    const deal = await getScopedDeal(admin, partner.id, dealId);
    if (!deal) {
      redirectWithMessage(redirectTo, "error", "Deal not found or access denied.");
    }
  }

  const { error } = await admin.from("activities").insert({
    lead_id: leadId || null,
    deal_id: dealId || null,
    performed_by: user.id,
    type: activityType,
    subject,
    body: body || null,
  });

  if (error) {
    redirectWithMessage(redirectTo, "error", error.message);
  }

  if (leadId) {
    await admin.from("leads").update({ last_activity_at: new Date().toISOString() }).eq("id", leadId);
    revalidatePath("/partners/leads");
  }
  if (dealId) {
    await admin.from("deals").update({ last_activity_at: new Date().toISOString() }).eq("id", dealId);
    revalidatePath("/partners/deals");
  }

  revalidatePath("/partners");
  redirectWithMessage(redirectTo, "status", "Activity logged.");
}

export async function saveTaxFormAction(formData: FormData) {
  const { admin, partner } = await getPartnerContext();

  const taxFormUrl = getField(formData, "tax_form_url");
  const companyName = getField(formData, "company_name");
  const companyNumber = getField(formData, "company_number");
  const vatNumber = getField(formData, "vat_number");
  const bankAccountName = getField(formData, "bank_account_name");
  const bankSortCode = getField(formData, "bank_sort_code");
  const bankAccountNumber = getField(formData, "bank_account_number");

  const updatePayload: Record<string, string | null> = {};

  if (companyName) updatePayload.company_name = companyName;

  const metadata: Record<string, string> = {};
  if (companyNumber) metadata.company_number = companyNumber;
  if (vatNumber) metadata.vat_number = vatNumber;
  if (bankAccountName) metadata.bank_account_name = bankAccountName;
  if (bankSortCode) metadata.bank_sort_code = bankSortCode;
  if (bankAccountNumber) metadata.bank_account_number = bankAccountNumber;
  if (taxFormUrl) updatePayload.tax_form_url = taxFormUrl;

  const { error } = await admin
    .from("partners")
    .update(updatePayload)
    .eq("id", partner.id);

  if (error) {
    redirectWithMessage("/partners/onboarding", "error", error.message);
  }

  revalidatePath("/partners");
  revalidatePath("/partners/onboarding");
  redirectWithMessage("/partners/onboarding", "status", "Details saved. Vazgro will review and verify your account.");
}

export async function advanceDealStageAction(formData: FormData) {
  const { user, admin, partner } = await getPartnerContext();
  const dealId = getField(formData, "deal_id");
  const newStage = getField(formData, "stage");
  const paymentReference = getField(formData, "payment_reference");
  const redirectTo = getField(formData, "redirect_to") || "/partners/deals";

  if (!ensureAllowed(newStage, DEAL_STAGES)) {
    redirectWithMessage(redirectTo, "error", "Invalid deal stage.");
  }

  const deal = await getScopedDeal(admin, partner.id, dealId);
  if (!deal) {
    redirectWithMessage("/partners/deals", "error", "Deal not found or access denied.");
  }

  if (newStage === "closed_won" && !paymentReference) {
    redirectWithMessage(redirectTo, "error", "Payment or invoice reference is required before closing won.");
  }

  const { error } = await admin
    .from("deals")
    .update({
      stage: newStage,
      closed_at: newStage === "closed_won" ? new Date().toISOString() : null,
      last_activity_at: new Date().toISOString(),
    })
    .eq("id", dealId);

  if (error) {
    redirectWithMessage(redirectTo, "error", error.message);
  }

  await admin.from("activities").insert({
    deal_id: dealId,
    performed_by: user.id,
    type: "stage_change",
    subject: `Deal stage changed to ${newStage}`,
    metadata: {
      from: deal.stage,
      to: newStage,
      payment_reference: paymentReference || null,
      updated_via: "partner_portal",
    },
  });

  revalidatePath("/partners");
  revalidatePath("/partners/deals");
  redirectWithMessage(redirectTo, "status", "Deal updated.");
}
