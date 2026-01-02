import crypto from "crypto";
import type { NextRequest } from "next/server";

import { requireEnv } from "@/lib/env";

export const CONSOLE_SESSION_COOKIE = "eroge_review_console_session";

function getSecret(): string {
  return requireEnv("CONSOLE_AUTH_SECRET");
}

function sign(value: string): string {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function createSessionValue(userId: string): string {
  const issuedAt = Date.now().toString(10);
  const payload = `v1.${userId}.${issuedAt}`;
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

export function verifySessionValue(value: string | undefined | null): boolean {
  if (!value) return false;
  const parts = value.split(".");
  if (parts.length !== 4) return false;
  const [v, userId, issuedAt, sig] = parts;
  if (v !== "v1") return false;
  if (!userId) return false;
  if (!issuedAt || Number.isNaN(Number(issuedAt))) return false;
  const payload = `${v}.${userId}.${issuedAt}`;
  const expected = sign(payload);
  if (sig.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

export function isLoggedInRequest(request: NextRequest): boolean {
  const cookie = request.cookies.get(CONSOLE_SESSION_COOKIE)?.value;
  return verifySessionValue(cookie);
}
