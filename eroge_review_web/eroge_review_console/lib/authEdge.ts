import { requireEnv } from "@/lib/env";

export const CONSOLE_SESSION_COOKIE = "eroge_review_console_session";

function getSecret(): string {
  return requireEnv("CONSOLE_AUTH_SECRET");
}

function toHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(value: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(value));
  return toHex(sig);
}

export async function verifySessionValueEdge(
  value: string | undefined | null
): Promise<boolean> {
  if (!value) return false;
  const parts = value.split(".");
  if (parts.length !== 4) return false;
  const [v, userId, issuedAt, sig] = parts;
  if (v !== "v1") return false;
  if (!userId) return false;
  if (!issuedAt || Number.isNaN(Number(issuedAt))) return false;

  const payload = `${v}.${userId}.${issuedAt}`;
  const expected = await sign(payload);
  return sig === expected;
}
