import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/profile", "/courses"];
const ADMIN_PREFIXES = ["/admin"];
const AUTH_PAGES = ["/login", "/register", "/reset-password"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase is not configured, let public pages through; protect admin
  if (!url || !key || url.includes("placeholder")) {
    if (ADMIN_PREFIXES.some((p) => pathname.startsWith(p))) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect unauthenticated users away from protected routes
  const isProtected =
    PROTECTED_PREFIXES.some((p) => pathname.startsWith(p)) ||
    ADMIN_PREFIXES.some((p) => pathname.startsWith(p));

  if (isProtected && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  // Exception: /reset-password/confirm — user must be authenticated to set new password
  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));
  const isConfirmPage = pathname.startsWith("/reset-password/confirm");
  if (user && isAuthPage && !isConfirmPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Check admin role for /admin routes
  if (user && ADMIN_PREFIXES.some((p) => pathname.startsWith(p))) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api/payments).*)"],
};
