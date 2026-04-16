import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      first_name,
      last_name,
      email,
      phone,
      company,
      website,
      pillar = "LAUNCH",
      source = "website",
      notes,
      requirements,
      package_id,
      package_name,
      package_price,
    } = body;

    if (!first_name || !email) {
      return NextResponse.json({ error: "first_name and email are required" }, { status: 400 });
    }

    const admin = createAdminClient();

    const notesText = [
      notes,
      package_id ? `Package: ${package_name} (${package_id}) — £${package_price}` : null,
      requirements
        ? `Requirements:\n${Object.entries(requirements)
            .map(([k, v]) => `${k}: ${v}`)
            .join("\n")}`
        : null,
    ]
      .filter(Boolean)
      .join("\n\n");

    const slaDeadline = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();

    const { data, error } = await admin
      .from("leads")
      .insert({
        first_name,
        last_name: last_name || null,
        email,
        phone: phone || null,
        company: company || null,
        website: website || null,
        pillar,
        stage: "new",
        source,
        notes: notesText || null,
        sla_contacted_deadline: slaDeadline,
      })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch (err) {
    console.error("[api/leads] error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const body = await req.json();
    const admin = createAdminClient();

    const { error } = await admin
      .from("leads")
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/leads PATCH] error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
