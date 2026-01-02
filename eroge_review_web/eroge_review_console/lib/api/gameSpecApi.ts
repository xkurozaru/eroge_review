import {
  getConsoleApiToken,
  getConsoleServerBaseUrl,
} from "@/lib/api/consoleServer";

import type { paths } from "@/lib/api";

export type GameSpec =
  paths["/game-specs/{game_spec_id}"]["get"]["responses"]["200"]["content"]["application/json"];

export type GameSpecListResponse =
  paths["/game-specs"]["get"]["responses"]["200"]["content"]["application/json"];

type GameSpecCreate =
  paths["/game-specs"]["post"]["requestBody"]["content"]["application/json"];

type GameSpecUpdate =
  paths["/game-specs/{game_spec_id}"]["put"]["requestBody"]["content"]["application/json"];

function buildHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  headers["X-Console-Token"] = getConsoleApiToken();
  return headers;
}

async function consoleFetch(
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

export async function listGameSpecs(params: {
  title?: string;
  brand?: string;
  page: number;
  pageSize: number;
}): Promise<GameSpecListResponse> {
  const qs = new URLSearchParams();
  if (params.title) qs.set("title", params.title);
  if (params.brand) qs.set("brand", params.brand);
  qs.set("page", String(params.page));
  qs.set("page_size", String(params.pageSize));

  const res = await consoleFetch(`/game-specs?${qs.toString()}`, {
    method: "GET",
  });
  if (!res.ok) throw new Error(`Failed to list game specs: ${res.status}`);
  return (await res.json()) as GameSpecListResponse;
}

export async function getGameSpec(id: string): Promise<GameSpec> {
  const res = await consoleFetch(`/game-specs/${encodeURIComponent(id)}`, {
    method: "GET",
  });
  if (res.status === 404) throw new Error("Not found");
  if (!res.ok) throw new Error(`Failed to get game spec: ${res.status}`);
  return (await res.json()) as GameSpec;
}

export async function createGameSpec(payload: {
  title: string;
  brand: string;
  release_date: string;
}): Promise<GameSpec> {
  const body: GameSpecCreate = payload;
  const res = await consoleFetch("/game-specs", {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Failed to create game spec: ${res.status}`);
  return (await res.json()) as GameSpec;
}

export async function updateGameSpec(
  id: string,
  payload: {
    title: string;
    brand: string;
    release_date: string;
  }
): Promise<GameSpec> {
  const body: GameSpecUpdate = payload;
  const res = await consoleFetch(`/game-specs/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Failed to update game spec: ${res.status}`);
  return (await res.json()) as GameSpec;
}

export async function deleteGameSpec(id: string): Promise<void> {
  const res = await consoleFetch(`/game-specs/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Failed to delete game spec: ${res.status}`);
}
