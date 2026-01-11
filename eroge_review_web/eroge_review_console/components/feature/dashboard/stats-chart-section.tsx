"use client";

import { useState } from "react";

import { DateRangePicker } from "@/components/feature/review_score_stats/date-range-picker";
import { ScopeSelector } from "@/components/feature/review_score_stats/scope-selector";
import { StatsChart } from "@/components/feature/review_score_stats/stats-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReviewScoreStatsDaily } from "@/lib/api/reviewScoreStatsApi";

interface StatsChartSectionProps {
  initialData: ReviewScoreStatsDaily[];
  initialFrom: string;
  initialTo: string;
}

export function StatsChartSection({
  initialData,
  initialFrom,
  initialTo,
}: StatsChartSectionProps) {
  const [scope, setScope] = useState<string>("published_all");

  return (
    <Card>
      <CardHeader>
        <CardTitle>レビュースコア推移</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <DateRangePicker from={initialFrom} to={initialTo} />
          <ScopeSelector value={scope} onChange={setScope} />
        </div>

        {initialData.length > 0 ? (
          <StatsChart data={initialData} scope={scope} />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            データがありません
          </div>
        )}
      </CardContent>
    </Card>
  );
}
