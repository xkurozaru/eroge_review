import { NextRequest, NextResponse } from "next/server";

import { CONSOLE_SESSION_COOKIE, verifySessionValueEdge } from "@/lib/authEdge";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const cookie = request.cookies.get(CONSOLE_SESSION_COOKIE)?.value;
  const loggedIn = await verifySessionValueEdge(cookie);

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(loggedIn ? "/dashboard" : "/login", request.url)
    );
  }

  if (pathname.startsWith("/dashboard")) {
    if (!loggedIn) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (pathname === "/login") {
    if (loggedIn) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"],
};
