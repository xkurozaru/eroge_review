import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { CONSOLE_SESSION_COOKIE } from "@/lib/auth";

export async function POST(_request: NextRequest) {
  void _request;
  const res = NextResponse.json({ ok: true });
  res.cookies.set(CONSOLE_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}
