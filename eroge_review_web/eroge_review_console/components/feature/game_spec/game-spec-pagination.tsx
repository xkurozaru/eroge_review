import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

type SearchParams = {
  title?: string;
  brand?: string;
  page?: string;
};

export function GameSpecPagination({
  page,
  totalPages,
  total,
  prevPage,
  nextPage,
  buildQuery,
}: {
  page: number;
  totalPages: number;
  total: number;
  prevPage: number | null;
  nextPage: number | null;
  buildQuery: (next: Partial<SearchParams>) => string;
}) {
  return (
    <footer className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        {total} 件 / {page} / {totalPages}
      </div>
      <div className="flex gap-2">
        <Link
          aria-disabled={!prevPage}
          className={
            prevPage
              ? buttonVariants({ variant: "outline", size: "sm" })
              : `${buttonVariants({
                  variant: "outline",
                  size: "sm",
                })} pointer-events-none opacity-50`
          }
          href={
            prevPage
              ? `/dashboard/game-specs${buildQuery({ page: String(prevPage) })}`
              : "#"
          }
        >
          前へ
        </Link>
        <Link
          aria-disabled={!nextPage}
          className={
            nextPage
              ? buttonVariants({ variant: "outline", size: "sm" })
              : `${buttonVariants({
                  variant: "outline",
                  size: "sm",
                })} pointer-events-none opacity-50`
          }
          href={
            nextPage
              ? `/dashboard/game-specs${buildQuery({ page: String(nextPage) })}`
              : "#"
          }
        >
          次へ
        </Link>
      </div>
    </footer>
  );
}
