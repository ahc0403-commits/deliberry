import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  MERCHANT_ONBOARDING_COOKIE,
  MERCHANT_PATHNAME_HEADER,
  MERCHANT_SESSION_COOKIE,
  MERCHANT_STORE_COOKIE,
} from "./src/shared/auth/merchant-session";
import { readMerchantAuthAuthority } from "./src/shared/supabase/config";

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
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(MERCHANT_PATHNAME_HEADER, pathname);

  if (isStaticPath(pathname)) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Supabase-backed merchant access is resolved server-side through access helpers.
  // Keep middleware permissive there so cookie-only demo guards do not override it.
  if (readMerchantAuthAuthority() === "supabase") {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  const session = request.cookies.get(MERCHANT_SESSION_COOKIE)?.value;
  const onboardingComplete =
    request.cookies.get(MERCHANT_ONBOARDING_COOKIE)?.value === "true";
  const selectedStore = request.cookies.get(MERCHANT_STORE_COOKIE)?.value;

  if (AUTH_PATHS.has(pathname)) {
    if (!session) {
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    if (!onboardingComplete) {
      return pathname === "/onboarding"
          ? NextResponse.next({
              request: {
                headers: requestHeaders,
              },
            })
          : NextResponse.redirect(new URL("/onboarding", request.url));
    }

    if (!selectedStore) {
      return NextResponse.redirect(
        new URL("/select-store?reason=no_store_selected", request.url),
      );
    }

    return NextResponse.redirect(
      new URL(`/${selectedStore}/dashboard`, request.url),
    );
  }

  if (pathname === "/select-store") {
    if (!session) {
      return NextResponse.redirect(
        new URL("/login?error=session_required", request.url),
      );
    }

    if (!onboardingComplete) {
      return NextResponse.redirect(
        new URL("/onboarding?reason=onboarding_required", request.url),
      );
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  if (isStoreScopedPath(pathname)) {
    if (!session) {
      return NextResponse.redirect(
        new URL("/login?error=session_required", request.url),
      );
    }

    if (!onboardingComplete) {
      return NextResponse.redirect(
        new URL("/onboarding?reason=onboarding_required", request.url),
      );
    }

    const storeId = pathname.split("/").filter(Boolean)[0];
    if (!selectedStore || selectedStore != storeId) {
      return NextResponse.redirect(
        new URL(
          `/select-store?reason=${
            selectedStore ? "store_scope_mismatch" : "no_store_selected"
          }`,
          request.url,
        ),
      );
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!api).*)"],
};
