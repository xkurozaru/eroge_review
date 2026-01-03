import { redirect } from "next/navigation";

import { GameReviewForm } from "@/components/feature/game_review/game-review-form";
import { Button } from "@/components/ui/button";
import {
  deleteGameReview,
  getGameReview,
  updateGameReview,
} from "@/lib/api/gameReviewApi";

type Params = {
  id: string;
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

function toBool(value: FormDataEntryValue | null): boolean {
  // For checkbox: present => "on".
  return value != null;
}

function toDatetimeLocal(value: string | null): string | null {
  if (!value) return null;
  // datetime-local expects "YYYY-MM-DDTHH:mm".
  // Server accepts ISO string; we pass through trimmed value.
  return value;
}

function fromServerDatetime(value: string | null | undefined): string | null {
  if (!value) return null;
  // Convert ISO like "2026-01-03T12:34:56+09:00" to "2026-01-03T12:34".
  const m = value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/);
  return m ? m[0] : value;
}

export default async function GameReviewDetailPage(
  props: PageProps<"/dashboard/game-reviews/[id]">
) {
  const params = (await props.params) as Params;
  const data = await getGameReview(params.id);

  async function updateAction(formData: FormData) {
    "use server";

    const title = String(formData.get("title") || "").trim();
    const potential = toRequiredInt(
      formData.get("potential_score"),
      "potential_score"
    );
    const rating = toNullableInt(formData.get("rating_score"));
    const startedAt = toDatetimeLocal(toNullable(formData.get("started_at")));
    const endedAt = toDatetimeLocal(toNullable(formData.get("ended_at")));
    const body = toNullable(formData.get("body"));
    const isPublished = toBool(formData.get("is_published"));

    await updateGameReview(params.id, {
      game_spec_id: data.game_spec_id,
      title,
      potential_score: potential,
      rating_score: rating,
      started_at: startedAt,
      ended_at: endedAt,
      body,
      is_published: isPublished,
    });

    redirect("/dashboard/game-reviews");
  }

  async function deleteAction() {
    "use server";
    await deleteGameReview(params.id);
    redirect("/dashboard/game-reviews");
  }

  const review = data.game_review;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Game Review 詳細・編集</h1>
        <form action={deleteAction}>
          <Button type="submit" variant="destructive">
            削除
          </Button>
        </form>
      </header>

      <GameReviewForm
        action={updateAction}
        submitLabel="更新"
        showPublicToggle
        defaultValues={{
          title: review.title,
          potential_score: review.potential_score,
          rating_score: review.rating_score,
          started_at: fromServerDatetime(review.started_at),
          ended_at: fromServerDatetime(review.ended_at),
          body: review.body,
          is_published: review.is_published,
        }}
      />
    </div>
  );
}
