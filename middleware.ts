import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { canUseLocalAdminAccess, resolveUserRole } from "@/lib/auth/resolve-role";
import { getPostLoginDestination, isHubRole } from "@/lib/auth/roles";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicRoutes = ["/", "/login", "/auth", "/work", "/services", "/privacy", "/terms", "/partner-programme"];
  const isPublic = publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"));
  if (isPublic) {
    return NextResponse.next({ request });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(new URL("/login?error=auth_unavailable", request.url));
  }

  let supabaseResponse = NextResponse.next({ request });

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const role = await resolveUserRole(supabase, user);

    if (pathname.startsWith("/workspace") && role !== "client") {
      return NextResponse.redirect(new URL(getPostLoginDestination(role), request.url));
    }

    if (pathname.startsWith("/hub") && !isHubRole(role)) {
      return NextResponse.redirect(new URL(getPostLoginDestination(role), request.url));
    }

    if (pathname.startsWith("/hub/admin") && role !== "admin" && !canUseLocalAdminAccess(user)) {
      return NextResponse.redirect(new URL("/hub", request.url));
    }

    if (pathname.startsWith("/partners") && role !== "partner") {
      return NextResponse.redirect(new URL(getPostLoginDestination(role), request.url));
    }
  } catch (error) {
    return NextResponse.redirect(new URL("/login?error=auth_unavailable", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon|public|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
