"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

function field(formData: FormData, key: string) {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export async function submitApplicationAction(formData: FormData) {
  const firstName = field(formData, "first_name");
  const lastName = field(formData, "last_name");
  const email = field(formData, "email").toLowerCase();
  const phone = field(formData, "phone");
  const companyName = field(formData, "company_name");
  const website = field(formData, "website");
  const linkedinUrl = field(formData, "linkedin_url");
  const description = field(formData, "description");
  const howHeard = field(formData, "how_heard");

  if (!firstName || !email) {
    redirect("/apply?error=Name+and+email+are+required.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    redirect("/apply?error=Please+enter+a+valid+email+address.");
  }

  const admin = createAdminClient();

  const { error } = await admin.from("partner_applications").insert({
    first_name: firstName,
    last_name: lastName || null,
    email,
    phone: phone || null,
    company_name: companyName || null,
    website: website || null,
    linkedin_url: linkedinUrl || null,
    description: description || null,
    how_heard: howHeard || null,
    status: "pending",
  });

  if (error) {
    redirect(`/apply?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/apply?submitted=1");
}
