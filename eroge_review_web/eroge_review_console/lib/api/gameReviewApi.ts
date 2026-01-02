import {
  getConsoleApiToken,
  getConsoleServerBaseUrl,
} from "@/lib/api/consoleServer";

import type { paths } from "@/lib/api";

export type GameReviewListResponse =
  paths["/game-reviews"]["get"]["responses"]["200"]["content"]["application/json"];

export type GameReviewListItem = GameReviewListResponse["items"][number];

export type GameReviewCreate =
  paths["/game-reviews"]["post"]["requestBody"]["content"]["application/json"];

export type GameReviewUpdate =
  paths["/game-reviews/{game_review_id}"]["put"]["requestBody"]["content"]["application/json"];

export type GameReviewGetResponse =
  paths["/game-reviews/{game_review_id}"]["get"]["responses"]["200"]["content"]["application/json"];

export type GameReview = GameReviewGetResponse["game_review"];

type GameReviewListQuery = NonNullable<
  paths["/game-reviews"]["get"]["parameters"]["query"]
>;

export type GameReviewStatus = GameReviewListQuery["status"];

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

export async function listGameReviews(params: {
  title?: string;
  brand?: string;
  status?: GameReviewStatus;
  page: number;
  pageSize: number;
}): Promise<GameReviewListResponse> {
  const qs = new URLSearchParams();
  if (params.title) qs.set("title", params.title);
  if (params.brand) qs.set("brand", params.brand);
  if (params.status) qs.set("status", String(params.status));
  qs.set("page", String(params.page));
  qs.set("page_size", String(params.pageSize));

  const res = await consoleFetch(`/game-reviews?${qs.toString()}`, {
    method: "GET",
  });
  if (!res.ok) throw new Error(`Failed to list game reviews: ${res.status}`);
  return (await res.json()) as GameReviewListResponse;
}

export async function createGameReview(
  payload: GameReviewCreate
): Promise<GameReview> {
  const res = await consoleFetch("/game-reviews", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (res.status === 409) throw new Error("Already exists");
  if (res.status === 404) throw new Error("GameSpec not found");
  if (!res.ok) throw new Error(`Failed to create game review: ${res.status}`);
  return (await res.json()) as GameReview;
}

export async function getGameReview(
  id: string
): Promise<GameReviewGetResponse> {
  const res = await consoleFetch(`/game-reviews/${encodeURIComponent(id)}`, {
    method: "GET",
  });
  if (res.status === 404) throw new Error("Not found");
  if (!res.ok) throw new Error(`Failed to get game review: ${res.status}`);
  return (await res.json()) as GameReviewGetResponse;
}

export async function updateGameReview(
  id: string,
  payload: GameReviewUpdate
): Promise<GameReview> {
  const res = await consoleFetch(`/game-reviews/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  if (res.status === 404) throw new Error("Not found");
  if (!res.ok) throw new Error(`Failed to update game review: ${res.status}`);
  return (await res.json()) as GameReview;
}

export async function deleteGameReview(id: string): Promise<void> {
  const res = await consoleFetch(`/game-reviews/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (res.status === 404) throw new Error("Not found");
  if (!res.ok) throw new Error(`Failed to delete game review: ${res.status}`);
}
