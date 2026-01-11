import { redirect } from "next/navigation";

import { GameReviewForm } from "@/components/feature/game_review/game-review-form";
import { PageHeader } from "@/components/ui/page-header";
import { createGameReview } from "@/lib/api/gameReviewApi";

type SearchParams = {
  game_spec_id?: string;
};

function toNullable(value: FormDataEntryValue | null): string | null {
  const s = String(value || "").trim();
  return s ? s : null;
}

function toNullableInt(value: FormDataEntryValue | null): number | null {
  const s = String(value || "").trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

function toRequiredInt(value: FormDataEntryValue | null, name: string): number {
  const n = toNullableInt(value);
  if (n == null) throw new Error(`${name} is required`);
  return n;
}

export default async function GameReviewCreatePage(
  props: PageProps<"/dashboard/game-reviews/create">
) {
  const searchParams = (await props.searchParams) as SearchParams;
  const gameSpecId = (searchParams.game_spec_id || "").trim();

  async function createAction(formData: FormData) {
    "use server";

    if (!gameSpecId) {
      throw new Error("game_spec_id is required");
    }

    const title = String(formData.get("title") || "").trim();
    const potential = toRequiredInt(
      formData.get("potential_score"),
      "potential_score"
    );
    const rating = toNullableInt(formData.get("rating_score"));
    const startedAt = toNullable(formData.get("started_at"));
    const endedAt = toNullable(formData.get("ended_at"));
    const body = toNullable(formData.get("body"));

    await createGameReview({
      game_spec_id: gameSpecId,
      title,
      potential_score: potential,
      rating_score: rating,
      started_at: startedAt,
      ended_at: endedAt,
      body,
      is_published: false,
    });

    redirect("/dashboard/game-reviews");
  }

  return (
    <div className="space-y-6">
      <PageHeader>Game Review 新規作成</PageHeader>

      <GameReviewForm
        action={createAction}
        submitLabel="新規作成"
        showBodyEditor={false}
      />
    </div>
  );
}
