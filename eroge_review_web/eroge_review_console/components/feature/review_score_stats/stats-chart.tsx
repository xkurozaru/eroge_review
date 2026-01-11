"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  ErrorBar,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ReviewScoreStatsDaily } from "@/lib/api/reviewScoreStatsApi";

interface StatsChartProps {
  data: ReviewScoreStatsDaily[];
  scope: string;
}

export function StatsChart({ data, scope }: StatsChartProps) {
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());

  const toggleSeries = (dataKey: string | number) => {
    const key = String(dataKey);
    setHiddenSeries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };
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
          ratingStddev,
          potentialStddev,
          ratingError: [ratingStddev, ratingStddev],
          potentialError: [potentialStddev, potentialStddev],
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data, scope]);

  return (
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
            const numValue = typeof value === "number" ? value : 0;

            // 標準偏差は個別に表示しない（平均値と一緒に表示）
            if (name === "ratingStddev" || name === "potentialStddev") {
              return null;
            }

            if (name === "ratingAvg") {
              const stddev = props.payload.ratingStddev;
              return [
                `${numValue.toFixed(2)} (±${stddev.toFixed(2)})`,
                "評価平均",
              ];
            }

            if (name === "potentialAvg") {
              const stddev = props.payload.potentialStddev;
              return [
                `${numValue.toFixed(2)} (±${stddev.toFixed(2)})`,
                "期待値平均",
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
          onClick={(e) => {
            if (
              e.dataKey &&
              (typeof e.dataKey === "string" || typeof e.dataKey === "number")
            ) {
              toggleSeries(e.dataKey);
            }
          }}
          wrapperStyle={{ cursor: "pointer" }}
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

        {/* 平均値の折れ線グラフ（エラーバー付き） */}
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="ratingAvg"
          stroke="#8884d8"
          strokeWidth={2}
          name="ratingAvg"
          dot={{ r: 3 }}
          hide={hiddenSeries.has("ratingAvg")}
        >
          <ErrorBar dataKey="ratingError" stroke="#8884d8" strokeWidth={1.5} />
        </Line>
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="potentialAvg"
          stroke="#82ca9d"
          strokeWidth={2}
          name="potentialAvg"
          dot={{ r: 3 }}
          hide={hiddenSeries.has("potentialAvg")}
        >
          <ErrorBar
            dataKey="potentialError"
            stroke="#82ca9d"
            strokeWidth={1.5}
          />
        </Line>

        {/* 件数の棒グラフ */}
        <Bar
          yAxisId="right"
          dataKey="ratingCount"
          fill="#ffc658"
          name="ratingCount"
          opacity={0.6}
          hide={hiddenSeries.has("ratingCount")}
        />
        <Bar
          yAxisId="right"
          dataKey="potentialCount"
          fill="#ff7c7c"
          name="potentialCount"
          opacity={0.6}
          hide={hiddenSeries.has("potentialCount")}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
