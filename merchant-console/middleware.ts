import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  MERCHANT_ONBOARDING_COOKIE,
  MERCHANT_SESSION_COOKIE,
  MERCHANT_STORE_COOKIE,
} from "./src/shared/auth/merchant-session";

const AUTH_PATHS = new Set(["/login", "/onboarding"]);

function isStaticPath(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/public")
  );
}

function isStoreScopedPath(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  return segments.length >= 2 && segments[0] !== "login" && segments[0] !== "onboarding" && segments[0] !== "select-store";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isStaticPath(pathname)) {
    return NextResponse.next();
  }

  const session = request.cookies.get(MERCHANT_SESSION_COOKIE)?.value;
  const onboardingComplete =
    request.cookies.get(MERCHANT_ONBOARDING_COOKIE)?.value === "true";
  const selectedStore = request.cookies.get(MERCHANT_STORE_COOKIE)?.value;

  if (AUTH_PATHS.has(pathname)) {
    if (!session) {
      return NextResponse.next();
    }

    if (!onboardingComplete) {
      return pathname === "/onboarding"
          ? NextResponse.next()
          : NextResponse.redirect(new URL("/onboarding", request.url));
    }

    if (!selectedStore) {
      return NextResponse.redirect(new URL("/select-store", request.url));
    }

    return NextResponse.redirect(
      new URL(`/${selectedStore}/dashboard`, request.url),
    );
  }

  if (pathname === "/select-store") {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (!onboardingComplete) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    return NextResponse.next();
  }

  if (isStoreScopedPath(pathname)) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (!onboardingComplete) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    const storeId = pathname.split("/").filter(Boolean)[0];
    if (!selectedStore || selectedStore != storeId) {
      return NextResponse.redirect(new URL("/select-store", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api).*)"],
};
