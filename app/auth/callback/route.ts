import { createClient } from "@/lib/supabase/server";
import { getPostLoginDestination, resolveUserRole } from "@/lib/auth/resolve-role";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      const role = await resolveUserRole(supabase, data.user);
      const dest = getPostLoginDestination(role);
      return NextResponse.redirect(`${origin}${dest}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
