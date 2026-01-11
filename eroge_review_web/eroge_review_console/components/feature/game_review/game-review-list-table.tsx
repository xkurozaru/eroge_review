import Link from "next/link";

import { CircularGauge } from "@/components/ui/circular-gauge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { GameReviewListItem } from "@/lib/api/gameReviewApi";
import { formatDateTime } from "@/lib/datetime";

function status(
  item: GameReviewListItem
): "unreviewed" | "draft" | "published" {
  if (!item.game_review_id) return "unreviewed";
  if (item.published_at) return "published";
  return "draft";
}

function rowClassName(item: GameReviewListItem): string {
  const s = status(item);

  // Apply background on cells to ensure it is visible across table styles.
  if (s === "published") {
    return "[&>td:first-child]:border-l-4 [&>td:first-child]:border-chart-2";
  }
  if (s === "draft") {
    return "[&>td:first-child]:border-l-4 [&>td:first-child]:border-chart-1";
  }
  // unreviewed
  return "[&>td:first-child]:border-l-4 [&>td:first-child]:border-muted-foreground";
}

function achievementRate(item: GameReviewListItem): number | null {
  const potential = item.potential_score;
  const rating = item.rating_score;
  if (rating == null || potential == null || potential === 0) return null;
  return rating / potential;
}

function achievementText(item: GameReviewListItem): string {
  const potential = item.potential_score;
  if (potential == null) return "-";

  const rating = item.rating_score;
  const left = rating == null ? "-" : String(rating);
  return `${left}/${potential}`;
}

export function GameReviewListTable(props: { items: GameReviewListItem[] }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>タイトル</TableHead>
            <TableHead>ブランド</TableHead>
            <TableHead>評価値/期待値(達成率)</TableHead>
            <TableHead>レビュー作成日時</TableHead>
            <TableHead>レビュー更新日時</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.items.map((item) => {
            const href = item.game_review_id
              ? `/dashboard/game-reviews/${item.game_review_id}`
              : `/dashboard/game-reviews/create?game_spec_id=${encodeURIComponent(
                  item.game_spec_id
                )}`;

            return (
              <TableRow key={item.game_spec_id} className={rowClassName(item)}>
                <TableCell className="font-medium">
                  <Link href={href} className="underline underline-offset-4">
                    {item.game_title}
                  </Link>
                </TableCell>
                <TableCell>{item.brand}</TableCell>
                <TableCell>
                  {item.potential_score != null ? (
                    <div className="flex items-center gap-2">
                      <div className="text-sm tabular-nums">
                        {achievementText(item)}
                      </div>
                      <CircularGauge value={achievementRate(item)} />
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>{formatDateTime(item.review_created_at)}</TableCell>
                <TableCell>{formatDateTime(item.review_updated_at)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
