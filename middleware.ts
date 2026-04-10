import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { resolveUserRole } from "@/lib/auth/resolve-role";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  // Public routes — no auth needed
  const publicRoutes = ["/", "/login", "/auth", "/work", "/services", "/privacy", "/terms"];
  const isPublic = publicRoutes.some((r) => pathname === r || pathname.startsWith(r + "/"));
  if (isPublic) return supabaseResponse;

  // Not logged in — redirect to login
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Get role from profile
  const role = await resolveUserRole(supabase, user);

  // Route by role
  if (pathname.startsWith("/workspace") && role !== "client") {
    return NextResponse.redirect(new URL("/hub", request.url));
  }

  if (pathname.startsWith("/hub") && role === "client") {
    return NextResponse.redirect(new URL("/workspace", request.url));
  }

  // Admin-only routes
  if (pathname.startsWith("/hub/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/hub", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon|public|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
