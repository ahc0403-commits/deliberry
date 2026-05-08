import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  ADMIN_PATHNAME_HEADER,
  isAdminRole,
  isAdminRoleAllowed,
  isProtectedPlatformPath,
  isStaticPath,
  resolveAdminHomePath,
} from "./shared/auth/admin-access";

const ADMIN_SESSION_COOKIE = "admin_session";
const ADMIN_ROLE_COOKIE = "admin_role";

function withQuery(pathname: string, key: string, value: string) {
  const separator = pathname.includes("?") ? "&" : "?";
  return `${pathname}${separator}${key}=${encodeURIComponent(value)}`;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const reason = request.nextUrl.searchParams.get("reason");
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(ADMIN_PATHNAME_HEADER, pathname);

  if (isStaticPath(pathname)) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const role = request.cookies.get(ADMIN_ROLE_COOKIE)?.value;

  if (pathname === "/login") {
    if (!session) {
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    return NextResponse.redirect(
      new URL(
        isAdminRole(role)
            ? resolveAdminHomePath(role)
            : withQuery("/access-boundary", "reason", "role_required"),
        request.url,
      ),
    );
  }

  if (pathname === "/access-boundary") {
    if (!session) {
      return NextResponse.redirect(
        new URL(withQuery("/login", "error", "session_required"), request.url),
      );
    }

    if (isAdminRole(role) && reason !== "access_denied") {
      return NextResponse.redirect(
        new URL(resolveAdminHomePath(role), request.url),
      );
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  if (isProtectedPlatformPath(pathname)) {
    if (!session) {
      return NextResponse.redirect(
        new URL(withQuery("/login", "error", "session_required"), request.url),
      );
    }

    if (!isAdminRole(role)) {
      return NextResponse.redirect(
        new URL(withQuery("/access-boundary", "reason", "role_required"), request.url),
      );
    }

    if (!isAdminRoleAllowed(role, pathname)) {
      return NextResponse.redirect(
        new URL(withQuery("/access-boundary", "reason", "access_denied"), request.url),
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
