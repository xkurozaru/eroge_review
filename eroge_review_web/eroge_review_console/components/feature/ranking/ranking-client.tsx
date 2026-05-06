"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { GameSpec } from "@/lib/api/gameSpecApi";
import { formatDateTime } from "@/lib/datetime";

const MAX_ITEMS = 50;

function getMid(low: number, high: number) {
  return Math.floor((low + high) / 2);
}

function estimateTotalComparisons(n: number) {
  let total = 0;
  for (let i = 1; i < n; i += 1) {
    total += Math.ceil(Math.log2(i + 1));
  }
  return total;
}

function GameSpecCard({ item, label }: { item: GameSpec; label: string }) {
  return (
    <Card className="border border-border bg-background">
      <CardHeader>
        <CardTitle className="text-base">{label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm text-muted-foreground">タイトル</p>
          <p className="text-lg font-semibold text-foreground">{item.title}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">ブランド</p>
          <p className="text-sm text-foreground">{item.brand}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">リリース日</p>
          <p className="text-sm text-foreground">{item.release_date}</p>
        </div>
        {item.created_at && (
          <div>
            <p className="text-sm text-muted-foreground">作成日時</p>
            <p className="text-sm text-foreground">
              {formatDateTime(item.created_at)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RankingProgress({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const progress =
    total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>比較進捗</span>
        <span>{progress}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-foreground transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function RankingTable({
  sorted,
  remaining,
}: {
  sorted: GameSpec[];
  remaining: GameSpec[];
}) {
  const rows = [...sorted, ...remaining];

  return (
    <Card>
      <CardHeader>
        <CardTitle>ランキング</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[55vh] min-h-[12rem] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="text-left">
                <TableHead>順位</TableHead>
                <TableHead>タイトル</TableHead>
                <TableHead>ブランド</TableHead>
                <TableHead>リリース日</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((item, index) => (
                <TableRow key={item.id ?? `${item.title}-${index}`}>
                  <TableCell className="font-medium">
                    {index < sorted.length ? index + 1 : "-"}
                  </TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.brand}</TableCell>
                  <TableCell>{item.release_date}</TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell className="py-6 text-muted-foreground" colSpan={4}>
                    0件
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export function RankingClient({ items }: { items: GameSpec[] }) {
  const initialItems = useMemo(() => items.slice(0, MAX_ITEMS), [items]);

  const [sortedItems, setSortedItems] = useState<GameSpec[]>(
    initialItems.length > 0 ? [initialItems[0]] : [],
  );
  const [remainingItems, setRemainingItems] = useState<GameSpec[]>(
    initialItems.slice(1),
  );
  const [currentItem, setCurrentItem] = useState<GameSpec | null>(
    initialItems.length > 1 ? initialItems[1] : null,
  );
  const [low, setLow] = useState(initialItems.length > 1 ? 0 : -1);
  const [high, setHigh] = useState(
    initialItems.length > 1 ? sortedItems.length - 1 : -1,
  );
  const [candidateIndex, setCandidateIndex] = useState(
    initialItems.length > 1 ? getMid(0, sortedItems.length - 1) : -1,
  );
  const [comparisonCount, setComparisonCount] = useState(0);

  const totalComparisons = useMemo(
    () => estimateTotalComparisons(initialItems.length),
    [initialItems.length],
  );

  const isComplete = currentItem === null;
  const candidate =
    !isComplete && low <= high && candidateIndex >= 0
      ? sortedItems[candidateIndex]
      : null;

  const finishedRankCount = sortedItems.length;
  const remainingRankCount = remainingItems.length + (currentItem ? 1 : 0);

  const handleInsert = (insertAt: number) => {
    if (!currentItem) {
      return;
    }

    const nextSorted = [
      ...sortedItems.slice(0, insertAt),
      currentItem,
      ...sortedItems.slice(insertAt),
    ];

    const nextRemaining = remainingItems.slice(1);
    const nextCurrent = nextRemaining.length > 0 ? nextRemaining[0] : null;
    const nextLow = nextCurrent ? 0 : -1;
    const nextHigh = nextCurrent ? nextSorted.length - 1 : -1;
    const nextCandidate = nextCurrent ? getMid(0, nextSorted.length - 1) : -1;

    setSortedItems(nextSorted);
    setRemainingItems(nextRemaining);
    setCurrentItem(nextCurrent);
    setLow(nextLow);
    setHigh(nextHigh);
    setCandidateIndex(nextCandidate);
  };

  const handleChoice = (choice: "current" | "equal" | "candidate") => {
    setComparisonCount((value) => value + 1);

    if (!currentItem || !candidate) {
      return;
    }

    if (choice === "equal") {
      handleInsert(candidateIndex + 1);
      return;
    }

    if (choice === "current") {
      const nextHigh = candidateIndex - 1;
      if (nextHigh < low) {
        handleInsert(low);
        return;
      }
      const nextIdx = getMid(low, nextHigh);
      setHigh(nextHigh);
      setCandidateIndex(nextIdx);
      return;
    }

    const nextLow = candidateIndex + 1;
    if (nextLow > high) {
      handleInsert(nextLow);
      return;
    }

    const nextIdx = getMid(nextLow, high);
    setLow(nextLow);
    setCandidateIndex(nextIdx);
  };

  if (initialItems.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ranking</CardTitle>
        </CardHeader>
        <CardContent>Game Specを追加してください。</CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>比較</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-muted p-4">
                <p className="text-sm text-muted-foreground">ランキング済み</p>
                <p className="text-2xl font-semibold text-foreground">
                  {finishedRankCount}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted p-4">
                <p className="text-sm text-muted-foreground">残り比較対象</p>
                <p className="text-2xl font-semibold text-foreground">
                  {remainingRankCount}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted p-4">
                <p className="text-sm text-muted-foreground">推定比較回数</p>
                <p className="text-2xl font-semibold text-foreground">
                  {comparisonCount} / {totalComparisons}
                </p>
              </div>
            </div>
            <RankingProgress
              current={comparisonCount}
              total={totalComparisons}
            />
            {isComplete ? (
              <div className="rounded-lg border border-border bg-muted p-6 text-center">
                <p className="text-lg font-semibold text-foreground">
                  ランキングが完了しました
                </p>
                <p className="text-sm text-muted-foreground">
                  全ての候補の位置が決まりました。
                </p>
              </div>
            ) : candidate ? (
              <div className="grid gap-4 lg:grid-cols-2">
                <GameSpecCard item={currentItem} label="比較対象 A" />
                <GameSpecCard item={candidate} label="比較対象 B" />
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-muted p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  次の比較候補を読み込んでいます...
                </p>
              </div>
            )}
            {!isComplete && candidate && (
              <div className="grid gap-3 sm:grid-cols-3">
                <Button
                  className="min-h-[3rem] whitespace-normal"
                  onClick={() => handleChoice("current")}
                >
                  {currentItem?.title} を上位にする
                </Button>
                <Button
                  variant="outline"
                  className="min-h-[3rem] whitespace-normal"
                  onClick={() => handleChoice("equal")}
                >
                  優劣つけない
                </Button>
                <Button
                  className="min-h-[3rem] whitespace-normal"
                  onClick={() => handleChoice("candidate")}
                >
                  {candidate.title} を上位にする
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <RankingTable sorted={sortedItems} remaining={remainingItems} />
    </div>
  );
}
