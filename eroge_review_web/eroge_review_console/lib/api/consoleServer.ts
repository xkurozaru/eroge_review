import { requireEnv } from "@/lib/env";

export function getConsoleServerBaseUrl(): string {
  return requireEnv("CONSOLE_SERVER_BASE_URL");
}

export function getConsoleApiToken(): string {
  return requireEnv("CONSOLE_API_TOKEN");
}

function buildHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  headers["X-Console-Token"] = getConsoleApiToken();
  return headers;
}

export async function consoleFetch(
  path: string,
  init?: RequestInit
): Promise<Response> {
  const baseUrl = getConsoleServerBaseUrl();
  const url = `${baseUrl}${path}`;
  return fetch(url, {
    ...init,
    headers: {
      ...buildHeaders(),
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
}
