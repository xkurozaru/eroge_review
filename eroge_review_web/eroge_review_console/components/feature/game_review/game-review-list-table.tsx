import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { GameReviewListItem } from "@/lib/api/gameReviewApi";

function statusLabel(item: GameReviewListItem): string {
  if (!item.game_review_id) return "未評価";
  if (item.is_published) return "評価済・公開";
  return "非公開";
}

export function GameReviewListTable(props: { items: GameReviewListItem[] }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>タイトル</TableHead>
            <TableHead>ブランド名</TableHead>
            <TableHead>ステータス</TableHead>
            <TableHead className="w-0" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.items.map((item) => {
            const href = item.game_review_id
              ? `/dashboard/game-reviews/${item.game_review_id}`
              : `/dashboard/game-reviews/create?game_spec_id=${encodeURIComponent(
                  item.game_spec_id
                )}`;
            const actionLabel = item.game_review_id ? "編集" : "作成";

            return (
              <TableRow key={item.game_spec_id}>
                <TableCell className="font-medium">{item.game_title}</TableCell>
                <TableCell>{item.brand}</TableCell>
                <TableCell>{statusLabel(item)}</TableCell>
                <TableCell className="text-right">
                  <Link
                    href={href}
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                    })}
                  >
                    {actionLabel}
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
