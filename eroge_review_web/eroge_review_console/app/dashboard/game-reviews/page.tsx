import { GameReviewListTable } from "@/components/feature/game_review/game-review-list-table";
import { GameReviewPagination } from "@/components/feature/game_review/game-review-pagination";
import {
  GameReviewSearchForm,
  type GameReviewSearchParams,
} from "@/components/feature/game_review/game-review-search-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  listGameReviews,
  type GameReviewStatus,
} from "@/lib/api/gameReviewApi";

export default async function GameReviewsPage(
  props: PageProps<"/dashboard/game-reviews">
) {
  const searchParams = (await props.searchParams) as GameReviewSearchParams;
  const title = (searchParams.title || "").trim();
  const brand = (searchParams.brand || "").trim();
  const status = (searchParams.status || "").trim();
  const page = Math.max(1, Number(searchParams.page || "1") || 1);
  const pageSize = 20;

  const data = await listGameReviews({
    title: title || undefined,
    brand: brand || undefined,
    status: (status || undefined) as GameReviewStatus | undefined,
    page,
    pageSize,
  });

  const totalPages = Math.max(1, Math.ceil(data.total / data.page_size));
  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < totalPages ? page + 1 : null;

  const buildQuery = (next: Partial<GameReviewSearchParams>) => {
    const qs = new URLSearchParams();
    if (title) qs.set("title", title);
    if (brand) qs.set("brand", brand);
    if (status) qs.set("status", status);
    if (next.page) qs.set("page", next.page);
    return `?${qs.toString()}`;
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Game Review 管理</h1>
      </header>

      <Card>
        <CardContent>
          <GameReviewSearchForm title={title} brand={brand} status={status} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Game Review 一覧</CardTitle>
        </CardHeader>
        <GameReviewListTable items={data.items} />
      </Card>

      <GameReviewPagination
        page={page}
        totalPages={totalPages}
        total={data.total}
        prevPage={prevPage}
        nextPage={nextPage}
        buildQuery={buildQuery}
      />
    </div>
  );
}
