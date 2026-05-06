import { DateRangePicker } from "@/components/feature/review_score_stats/date-range-picker";
import { StatsChart } from "@/components/feature/review_score_stats/stats-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReviewScoreStatsMonthly } from "@/lib/api/reviewScoreStatsApi";

interface StatsChartSectionProps {
  initialData: ReviewScoreStatsMonthly[];
  initialFrom: string;
  initialTo: string;
}

export function StatsChartSection({
  initialData,
  initialFrom,
  initialTo,
}: StatsChartSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>レビュースコア推移</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <DateRangePicker from={initialFrom} to={initialTo} />
        </div>

        {initialData.length > 0 ? (
          <StatsChart data={initialData} />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            データがありません
          </div>
        )}
      </CardContent>
    </Card>
  );
}
