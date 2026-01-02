import Link from "next/link";

import { GameSpecListTable } from "@/components/feature/game_spec/game-spec-list-table";
import { GameSpecPagination } from "@/components/feature/game_spec/game-spec-pagination";
import {
  GameSpecSearchForm,
  type GameSpecSearchParams,
} from "@/components/feature/game_spec/game-spec-search-form";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listGameSpecs } from "@/lib/api/gameSpecApi";

export default async function GameSpecsPage(
  props: PageProps<"/dashboard/game-specs">
) {
  const searchParams = (await props.searchParams) as GameSpecSearchParams;
  const title = (searchParams.title || "").trim();
  const brand = (searchParams.brand || "").trim();
  const page = Math.max(1, Number(searchParams.page || "1") || 1);
  const pageSize = 20;

  const data = await listGameSpecs({
    title: title || undefined,
    brand: brand || undefined,
    page,
    pageSize,
  });

  const totalPages = Math.max(1, Math.ceil(data.total / data.page_size));
  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < totalPages ? page + 1 : null;

  const buildQuery = (next: Partial<GameSpecSearchParams>) => {
    const qs = new URLSearchParams();
    if (title) qs.set("title", title);
    if (brand) qs.set("brand", brand);
    if (next.page) qs.set("page", next.page);
    return `?${qs.toString()}`;
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Game Spec 管理</h1>
        <Link
          href="/dashboard/game-specs/create"
          className={buttonVariants({ variant: "default" })}
        >
          新規作成
        </Link>
      </header>

      <Card>
        <CardContent>
          <GameSpecSearchForm title={title} brand={brand} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Game Spec 一覧</CardTitle>
        </CardHeader>
        <GameSpecListTable items={data.items} />
      </Card>

      <GameSpecPagination
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
