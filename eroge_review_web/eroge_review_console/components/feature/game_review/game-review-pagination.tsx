import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export function GameReviewPagination(props: {
  page: number;
  totalPages: number;
  total: number;
  prevPage: number | null;
  nextPage: number | null;
  buildQuery: (next: { page?: string }) => string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        {props.total} 件 / {props.page} / {props.totalPages} ページ
      </div>

      <div className="flex items-center gap-2">
        {props.prevPage ? (
          <Link
            href={props.buildQuery({ page: String(props.prevPage) })}
            className={buttonVariants({ variant: "outline" })}
          >
            前へ
          </Link>
        ) : (
          <span
            className={
              buttonVariants({ variant: "outline" }) +
              " pointer-events-none opacity-50"
            }
          >
            前へ
          </span>
        )}

        {props.nextPage ? (
          <Link
            href={props.buildQuery({ page: String(props.nextPage) })}
            className={buttonVariants({ variant: "outline" })}
          >
            次へ
          </Link>
        ) : (
          <span
            className={
              buttonVariants({ variant: "outline" }) +
              " pointer-events-none opacity-50"
            }
          >
            次へ
          </span>
        )}
      </div>
    </div>
  );
}
