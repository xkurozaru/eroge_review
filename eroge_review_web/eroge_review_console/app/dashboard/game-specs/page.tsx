import Link from "next/link";

import { listGameSpecs } from "@/lib/api/gameSpecApi";

type SearchParams = {
  title?: string;
  brand?: string;
  page?: string;
};

export default async function GameSpecsPage(
  props: PageProps<"/dashboard/game-specs">
) {
  const searchParams = (await props.searchParams) as SearchParams;
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

  const buildQuery = (next: Partial<SearchParams>) => {
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
          className="inline-flex h-10 items-center justify-center rounded-md bg-foreground px-4 text-sm font-medium text-background"
        >
          新規作成
        </Link>
      </header>

      <section className="rounded-lg border bg-background p-4">
        <form
          className="flex flex-col gap-3 md:flex-row md:items-end"
          method="get"
        >
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">タイトル（部分一致）</label>
            <input
              name="title"
              defaultValue={title}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>

          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">
              ブランド名（部分一致）
            </label>
            <input
              name="brand"
              defaultValue={brand}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>

          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-md bg-foreground px-4 text-sm font-medium text-background"
          >
            検索
          </button>
        </form>
      </section>

      <section className="rounded-lg border bg-background">
        <div className="border-b px-4 py-3 text-sm font-medium">
          Game Spec 一覧
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr className="text-left">
                <th className="px-4 py-2">タイトル</th>
                <th className="px-4 py-2">ブランド</th>
                <th className="px-4 py-2">リリース日</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((it) => (
                <tr key={it.id} className="border-b">
                  <td className="px-4 py-2">
                    <Link
                      href={`/dashboard/game-specs/${it.id}`}
                      className="underline"
                    >
                      {it.title}
                    </Link>
                  </td>
                  <td className="px-4 py-2">{it.brand ?? ""}</td>
                  <td className="px-4 py-2">{it.release_date}</td>
                </tr>
              ))}
              {data.items.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-muted-foreground" colSpan={3}>
                    0件
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {data.total} 件 / {page} / {totalPages}
        </div>
        <div className="flex gap-2">
          <Link
            aria-disabled={!prevPage}
            className={`inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm ${
              prevPage ? "" : "pointer-events-none opacity-50"
            }`}
            href={
              prevPage
                ? `/dashboard/game-specs${buildQuery({
                    page: String(prevPage),
                  })}`
                : "#"
            }
          >
            前へ
          </Link>
          <Link
            aria-disabled={!nextPage}
            className={`inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm ${
              nextPage ? "" : "pointer-events-none opacity-50"
            }`}
            href={
              nextPage
                ? `/dashboard/game-specs${buildQuery({
                    page: String(nextPage),
                  })}`
                : "#"
            }
          >
            次へ
          </Link>
        </div>
      </footer>
    </div>
  );
}
