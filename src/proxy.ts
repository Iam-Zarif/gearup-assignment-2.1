import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/gear",
  "/category",
];

const AUTH_ROUTES = [
  "/login",
  "/register",
];

const ROLE_ROUTES = {
  ADMIN: "/dashboard/admin",
  PROVIDER: "/dashboard/provider",
  CUSTOMER: "/dashboard/customer",
};

function getUserRole(request: NextRequest) {
  const role = request.cookies.get("role")?.value;

  return role;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;

  const role = getUserRole(request);


  /**
   * Allow static files
   */
  if (
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }


  /**
   * Logged user trying login/register
   */
  if (
    AUTH_ROUTES.includes(pathname) &&
    accessToken
  ) {

    if (role && ROLE_ROUTES[role as keyof typeof ROLE_ROUTES]) {

      return NextResponse.redirect(
        new URL(
          ROLE_ROUTES[role as keyof typeof ROLE_ROUTES],
          request.url
        )
      );

    }

    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }


  /**
   * Protected dashboard routes
   */
  if (
    pathname.startsWith("/dashboard")
  ) {


    if (!accessToken) {

      return NextResponse.redirect(
        new URL("/login", request.url)
      );

    }



    if (
      pathname.startsWith("/dashboard/admin")
      &&
      role !== "ADMIN"
    ) {

      return NextResponse.redirect(
        new URL("/", request.url)
      );

    }


    /**
     * Provider protection
     */
    if (
      pathname.startsWith("/dashboard/provider")
      &&
      role !== "PROVIDER"
    ) {

      return NextResponse.redirect(
        new URL("/", request.url)
      );

    }


    /**
     * Customer protection
     */
    if (
      pathname.startsWith("/dashboard/customer")
      &&
      role !== "CUSTOMER"
    ) {

      return NextResponse.redirect(
        new URL("/", request.url)
      );

    }

  }


  /**
   * Public routes
   */
  if (
    PUBLIC_ROUTES.includes(pathname)
  ) {

    return NextResponse.next();

  }


  return NextResponse.next();
}



export const config = {

  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],

};