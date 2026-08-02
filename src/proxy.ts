import { NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = new Set(["/login", "/register"]);

const ROLE_DASHBOARDS: Record<string, string> = {
  ADMIN: "/admin",
  PROVIDER: "/provider",
  CUSTOMER: "/customer",
};

function getRequestedRole(pathname: string) {
  const match = pathname.match(/^\/(admin|provider|customer)(?:\/|$)/);
  if (match) return match[1].toUpperCase();
  if (pathname === "/orders" || pathname === "/profile" || pathname === "/payment") return "CUSTOMER";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;

  const role = request.cookies.get("role")?.value;

  if (AUTH_ROUTES.has(pathname) && accessToken) {
    if (role && ROLE_DASHBOARDS[role]) {
      return NextResponse.redirect(new URL(ROLE_DASHBOARDS[role], request.url));
    }

    return NextResponse.redirect(new URL("/", request.url));
  }

  const requestedRole = getRequestedRole(pathname);

  if (requestedRole && !accessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (requestedRole && role && role !== requestedRole) {
    return NextResponse.redirect(new URL("/access-denied", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/provider/:path*", "/customer/:path*", "/orders/:path*", "/profile/:path*", "/payment/:path*", "/login", "/register"],
};
