"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

function toInt(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

export function GameReviewForm(props: {
  action: (formData: FormData) => void;
  submitLabel: string;
  defaultValues?: {
    title?: string;
    potential_score?: number | null;
    rating_score?: number | null;
    started_at?: string | null;
    ended_at?: string | null;
    body?: string | null;
    is_published?: boolean;
  };
  showPublicToggle?: boolean;
}) {
  const potentialDefault = props.defaultValues?.potential_score ?? null;
  const ratingDefault = props.defaultValues?.rating_score ?? null;
  const isPublishedDefault = props.defaultValues?.is_published ?? false;

  const [potential, setPotential] = React.useState<number | null>(
    potentialDefault
  );
  const [rating, setRating] = React.useState<number | null>(ratingDefault);
  const [isPublished, setIsPublished] =
    React.useState<boolean>(isPublishedDefault);
  const [body, setBody] = React.useState<string>(
    props.defaultValues?.body ?? ""
  );

  const achievementRate = React.useMemo(() => {
    if (potential == null || rating == null) return null;
    if (potential === 0) return null;
    return rating / potential;
  }, [potential, rating]);

  return (
    <form
      action={props.action}
      className="space-y-5 rounded-lg border bg-background p-6"
    >
      <div className="space-y-2">
        <Label>レビュータイトル</Label>
        <Input
          name="title"
          defaultValue={props.defaultValues?.title ?? ""}
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>ポテンシャル値</Label>
          <Input
            name="potential_score"
            inputMode="numeric"
            required
            defaultValue={
              potentialDefault == null ? "" : String(potentialDefault)
            }
            onChange={(e) => setPotential(toInt(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label>評価値</Label>
          <Input
            name="rating_score"
            inputMode="numeric"
            defaultValue={ratingDefault == null ? "" : String(ratingDefault)}
            onChange={(e) => setRating(toInt(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label>達成率（評価値/ポテンシャル値）</Label>
          <Input
            value={
              achievementRate == null
                ? ""
                : `${(achievementRate * 100).toFixed(1)}%`
            }
            readOnly
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>開始日時</Label>
          <Input
            name="started_at"
            type="datetime-local"
            defaultValue={props.defaultValues?.started_at ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label>終了日時</Label>
          <Input
            name="ended_at"
            type="datetime-local"
            defaultValue={props.defaultValues?.ended_at ?? ""}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>レビュー本文</Label>
          <textarea
            name="body"
            className="min-h-48 w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>レビュー本文プレビュー</Label>
          <div className="min-h-48 rounded-md border bg-background px-3 py-2 text-sm whitespace-pre-wrap">
            {body || (
              <span className="text-muted-foreground">（本文なし）</span>
            )}
          </div>
        </div>
      </div>

      {props.showPublicToggle ? (
        <div className="flex items-center justify-between rounded-md border bg-background px-3 py-2">
          <Label htmlFor="is_published">公開</Label>
          {/* Keep native checkbox semantics for form submission. */}
          <input
            id="is_published"
            name="is_published"
            type="checkbox"
            className="sr-only"
            checked={isPublished}
            readOnly
          />
          <Switch checked={isPublished} onCheckedChange={setIsPublished} />
        </div>
      ) : null}

      <div className="flex justify-end">
        <Button type="submit">{props.submitLabel}</Button>
      </div>
    </form>
  );
}
