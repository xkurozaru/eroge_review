import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { CONSOLE_SESSION_COOKIE, createSessionValue } from "@/lib/auth";
import { requireEnv } from "@/lib/env";

type LoginPayload = {
  id: string;
  password: string;
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<LoginPayload>;
  const id = body.id ?? "";
  const password = body.password ?? "";

  const expectedId = requireEnv("CONSOLE_ADMIN_ID");
  const expectedPassword = requireEnv("CONSOLE_ADMIN_PASSWORD");

  if (id !== expectedId || password !== expectedPassword) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const sessionValue = createSessionValue(id);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(CONSOLE_SESSION_COOKIE, sessionValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return res;
}
