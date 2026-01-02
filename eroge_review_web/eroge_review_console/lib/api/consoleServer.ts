import { requireEnv } from "@/lib/env";

export function getConsoleServerBaseUrl(): string {
  return requireEnv("CONSOLE_SERVER_BASE_URL");
}

export function getConsoleApiToken(): string {
  return requireEnv("CONSOLE_API_TOKEN");
}
