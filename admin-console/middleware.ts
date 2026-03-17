import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  ADMIN_PATHNAME_HEADER,
  isAdminRole,
  isAdminRoleAllowed,
  isProtectedPlatformPath,
  isStaticPath,
  resolveAdminHomePath,
} from "./src/shared/auth/admin-access";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_ROLE_COOKIE,
} from "./src/shared/auth/admin-session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
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
        isAdminRole(role) ? resolveAdminHomePath(role) : "/access-boundary",
        request.url,
      ),
    );
  }

  if (pathname === "/access-boundary") {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isAdminRole(role)) {
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
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (!isAdminRole(role)) {
      return NextResponse.redirect(new URL("/access-boundary", request.url));
    }

    if (!isAdminRoleAllowed(role, pathname)) {
      return NextResponse.redirect(
        new URL(resolveAdminHomePath(role), request.url),
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
