"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type GameReviewSearchParams = {
  title?: string;
  brand?: string;
  status?: string;
  page?: string;
};

const STATUS_OPTIONS = [
  { value: "unreviewed", label: "未評価" },
  { value: "published", label: "評価済・公開" },
  { value: "draft", label: "非公開" },
] as const;

export function GameReviewSearchForm(props: {
  title: string;
  brand: string;
  status: string;
}) {
  const [status, setStatus] = useState(props.status || "");

  return (
    <form
      className="flex flex-col gap-3 md:flex-row md:items-start"
      method="get"
    >
      <div className="flex-1 space-y-2">
        <Label>タイトル（部分一致）</Label>
        <Input name="title" defaultValue={props.title} />
      </div>
      <div className="flex-1 space-y-2">
        <Label>ブランド名（部分一致）</Label>
        <Input name="brand" defaultValue={props.brand} />
      </div>
      <div className="flex-1 space-y-2">
        <Label>ステータス</Label>
        <Select value={status || undefined} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="（指定なし）" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {status && <input type="hidden" name="status" value={status} />}

      <div className="space-y-2">
        <div className="h-4" />
        <Button type="submit">検索</Button>
      </div>
    </form>
  );
}
