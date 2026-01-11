"use client";

import { useMemo } from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReviewScoreStatsDaily } from "@/lib/api/reviewScoreStatsApi";

interface StatsChartProps {
  data: ReviewScoreStatsDaily[];
  scope: string;
}

export function StatsChart({ data, scope }: StatsChartProps) {
  const chartData = useMemo(() => {
    return data
      .filter((item) => item.scope === scope)
      .map((item) => {
        const ratingAvg = item.rating_avg ?? 0;
        const potentialAvg = item.potential_avg ?? 0;
        const ratingStddev = item.rating_stddev ?? 0;
        const potentialStddev = item.potential_stddev ?? 0;

        return {
          date: item.stats_date,
          ratingAvg,
          potentialAvg,
          ratingCount: item.rating_count,
          potentialCount: item.potential_count,
          ratingUpper: Math.min(100, ratingAvg + ratingStddev),
          ratingLower: Math.max(0, ratingAvg - ratingStddev),
          potentialUpper: Math.min(100, potentialAvg + potentialStddev),
          potentialLower: Math.max(0, potentialAvg - potentialStddev),
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data, scope]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>スコア推移グラフ</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis
              yAxisId="left"
              domain={[0, 100]}
              label={{ value: "スコア", angle: -90, position: "insideLeft" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: "件数", angle: 90, position: "insideRight" }}
            />
            <Tooltip
              labelFormatter={(value) => {
                return new Date(value as string).toLocaleDateString("ja-JP");
              }}
              formatter={(value, name, props) => {
                // 標準偏差の範囲は表示しない
                if (
                  name === "ratingUpper" ||
                  name === "ratingLower" ||
                  name === "potentialUpper" ||
                  name === "potentialLower"
                ) {
                  return null;
                }

                const numValue = typeof value === "number" ? value : 0;
                if (name === "ratingAvg" || name === "potentialAvg") {
                  return [
                    numValue.toFixed(2),
                    name === "ratingAvg" ? "評価平均" : "期待値平均",
                  ];
                }
                if (name === "ratingCount" || name === "potentialCount") {
                  return [
                    numValue,
                    name === "ratingCount" ? "評価件数" : "期待値件数",
                  ];
                }
                return [numValue.toFixed(2), name];
              }}
            />
            <Legend
              formatter={(value) => {
                switch (value) {
                  case "ratingAvg":
                    return "評価平均";
                  case "potentialAvg":
                    return "期待値平均";
                  case "ratingCount":
                    return "評価件数";
                  case "potentialCount":
                    return "期待値件数";
                  default:
                    return value;
                }
              }}
            />

            {/* 標準偏差の範囲（半透明のエリア） */}
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="ratingUpper"
              stroke="none"
              fill="#8884d8"
              fillOpacity={0.1}
              legendType="none"
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="ratingLower"
              stroke="none"
              fill="#8884d8"
              fillOpacity={0.1}
              legendType="none"
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="potentialUpper"
              stroke="none"
              fill="#82ca9d"
              fillOpacity={0.1}
              legendType="none"
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="potentialLower"
              stroke="none"
              fill="#82ca9d"
              fillOpacity={0.1}
              legendType="none"
            />

            {/* 平均値の折れ線グラフ */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="ratingAvg"
              stroke="#8884d8"
              strokeWidth={2}
              name="ratingAvg"
              dot={{ r: 3 }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="potentialAvg"
              stroke="#82ca9d"
              strokeWidth={2}
              name="potentialAvg"
              dot={{ r: 3 }}
            />

            {/* 件数の棒グラフ */}
            <Bar
              yAxisId="right"
              dataKey="ratingCount"
              fill="#ffc658"
              name="ratingCount"
              opacity={0.6}
            />
            <Bar
              yAxisId="right"
              dataKey="potentialCount"
              fill="#ff7c7c"
              name="potentialCount"
              opacity={0.6}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
