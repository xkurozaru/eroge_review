import { consoleFetch } from "@/lib/api/consoleServer";

import type { paths } from "@/lib/api";

export type ReviewScoreStatsDaily =
  paths["/review-score-stats/daily"]["get"]["responses"]["200"]["content"]["application/json"][number];

export async function listReviewScoreStatsDaily(
  since: string,
  until: string
): Promise<ReviewScoreStatsDaily[]> {
  const qs = new URLSearchParams();
  qs.set("since", since);
  qs.set("until", until);

  const res = await consoleFetch(`/review-score-stats/daily?${qs.toString()}`, {
    method: "GET",
  });
  if (!res.ok)
    throw new Error(`Failed to fetch review score stats: ${res.status}`);
  return (await res.json()) as ReviewScoreStatsDaily[];
}
