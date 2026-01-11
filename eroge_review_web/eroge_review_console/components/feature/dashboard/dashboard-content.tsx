"use client";

import { useState } from "react";

import { DashboardDateRangePicker } from "@/components/feature/dashboard/dashboard-date-range-picker";
import { ScopeSelector } from "@/components/feature/dashboard/scope-selector";
import { StatsChart } from "@/components/feature/dashboard/stats-chart";
import type { ReviewScoreStatsDaily } from "@/lib/api/reviewScoreStatsApi";

interface DashboardContentProps {
  initialData: ReviewScoreStatsDaily[];
  initialFrom: string;
  initialTo: string;
}

export function DashboardContent({
  initialData,
  initialFrom,
  initialTo,
}: DashboardContentProps) {
  const [scope, setScope] = useState<string>("published_all");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">ダッシュボード</h1>
        <p className="text-muted-foreground">
          レビュースコア統計の推移を確認できます
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        <DashboardDateRangePicker from={initialFrom} to={initialTo} />
        <ScopeSelector value={scope} onChange={setScope} />
      </div>

      {initialData.length > 0 ? (
        <StatsChart data={initialData} scope={scope} />
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          データがありません
        </div>
      )}
    </div>
  );
}
