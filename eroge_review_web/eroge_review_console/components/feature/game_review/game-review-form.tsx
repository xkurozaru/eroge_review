"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";

import { Button } from "@/components/ui/button";
import { CircularGauge } from "@/components/ui/circular-gauge";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

function toInt(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

function preventNonIntegerKeys(e: React.KeyboardEvent<HTMLInputElement>) {
  // Even with type="number", some browsers allow characters like e/E/+/-/.
  if (["e", "E", "+", "-", "."].includes(e.key)) {
    e.preventDefault();
  }
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
  showBodyEditor?: boolean;
}) {
  const sanitizeSchema = React.useMemo(() => {
    // Allow a limited subset of HTML for richer authoring, but sanitize it.
    // NOTE: Any rendering in showcase must also sanitize.
    const baseAttributesUnknown: unknown = defaultSchema.attributes ?? {};
    const baseAttributes =
      typeof baseAttributesUnknown === "object" &&
      baseAttributesUnknown !== null
        ? (baseAttributesUnknown as Record<string, unknown>)
        : {};
    const baseAAttributes = Array.isArray(baseAttributes.a)
      ? (baseAttributes.a as string[])
      : [];

    return {
      ...defaultSchema,
      tagNames: Array.from(
        new Set([
          ...(defaultSchema.tagNames ?? []),
          "img",
          "table",
          "thead",
          "tbody",
          "tr",
          "th",
          "td",
        ])
      ),
      attributes: {
        ...(defaultSchema.attributes ?? {}),
        a: [...baseAAttributes, "href", "title", "rel"],
        img: ["src", "alt", "title", "width", "height"],
        table: ["align"],
        th: ["align"],
        td: ["align"],
      },
    };
  }, []);

  const showBodyEditor = props.showBodyEditor ?? true;
  const showPublicToggle = props.showPublicToggle ?? false;
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
  const [publishError, setPublishError] = React.useState<string | null>(null);

  const bodyTextareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  React.useLayoutEffect(() => {
    if (!showBodyEditor) return;
    const el = bodyTextareaRef.current;
    if (!el) return;

    // Auto-resize: grow height with content (no internal scroll).
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [body, showBodyEditor]);

  const achievementRate = React.useMemo(() => {
    if (potential == null || rating == null) return null;
    if (potential === 0) return null;
    return rating / potential;
  }, [potential, rating]);

  const canPublish = React.useMemo(() => {
    // Publish requires both rating_score and body.
    if (rating == null) return false;
    return body.trim().length > 0;
  }, [rating, body]);

  React.useEffect(() => {
    if (!canPublish && isPublished) {
      setIsPublished(false);
    }
  }, [canPublish, isPublished]);

  const PublishToggle = React.useCallback(
    (layout: "inline" | "footer") => {
      if (!showPublicToggle) return null;

      return (
        <div
          className={
            layout === "footer"
              ? "flex items-center gap-3"
              : "flex items-center gap-3"
          }
        >
          <Label htmlFor="is_published_toggle">公開/非公開</Label>
          <Switch
            id="is_published_toggle"
            checked={isPublished}
            onCheckedChange={(next) => {
              if (next && !canPublish) {
                setPublishError("公開するには評価値とレビュー本文が必要です");
                return;
              }
              setPublishError(null);
              setIsPublished(next);
            }}
          />
        </div>
      );
    },
    [showPublicToggle, isPublished, canPublish]
  );

  return (
    <form
      action={props.action}
      className="space-y-5 rounded-lg border bg-background p-6"
    >
      <input
        type="hidden"
        name="is_published"
        value={isPublished ? "true" : "false"}
      />

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
          <Label>期待値</Label>
          <Input
            name="potential_score"
            type="number"
            inputMode="numeric"
            step={1}
            min={0}
            required
            defaultValue={
              potentialDefault == null ? "" : String(potentialDefault)
            }
            onKeyDown={preventNonIntegerKeys}
            onChange={(e) => setPotential(toInt(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label>評価値</Label>
          <Input
            name="rating_score"
            type="number"
            inputMode="numeric"
            step={1}
            min={0}
            defaultValue={ratingDefault == null ? "" : String(ratingDefault)}
            onKeyDown={preventNonIntegerKeys}
            onChange={(e) => setRating(toInt(e.target.value))}
          />
        </div>
        <div className="space-y-3">
          <Label>達成率（評価値/期待値）</Label>
          <div className="flex h-14 items-center">
            <CircularGauge value={achievementRate} size="md" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>開始日時</Label>
          <DateTimePicker
            name="started_at"
            defaultValue={props.defaultValues?.started_at ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label>終了日時</Label>
          <DateTimePicker
            name="ended_at"
            defaultValue={props.defaultValues?.ended_at ?? ""}
          />
        </div>
      </div>

      {showBodyEditor ? (
        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <Label>レビュー本文</Label>
            <textarea
              name="body"
              ref={bodyTextareaRef}
              rows={12}
              className="min-h-72 w-full resize-none overflow-hidden rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>

          <Dialog>
            <div className="space-y-1">
              {showPublicToggle && publishError ? (
                <div className="text-sm text-muted-foreground">
                  {publishError}
                </div>
              ) : null}

              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                {showPublicToggle ? PublishToggle("inline") : <div />}

                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    プレビュー
                  </Button>
                </DialogTrigger>
              </div>
            </div>
            <DialogContent className="max-w-6xl">
              <DialogHeader>
                <DialogTitle>レビュー本文プレビュー</DialogTitle>
                <DialogDescription>
                  本文を保存する前の表示確認です
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 max-h-[70vh] overflow-auto rounded-md border bg-background px-3 py-2 text-sm leading-relaxed [&_h1]:text-base [&_h1]:font-semibold [&_h2]:text-sm [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:underline">
                {body.trim() ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[
                      [rehypeRaw],
                      [rehypeSanitize, sanitizeSchema],
                    ]}
                  >
                    {body}
                  </ReactMarkdown>
                ) : (
                  <span className="text-muted-foreground">（本文なし）</span>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : null}

      {showPublicToggle && !showBodyEditor ? (
        // プレビューが無い場合はフッターに表示する
        <div className="space-y-1">
          {publishError ? (
            <div className="text-sm text-muted-foreground">{publishError}</div>
          ) : null}
          <div className="flex items-center justify-between">
            {PublishToggle("footer")}

            <Button type="submit">{props.submitLabel}</Button>
          </div>
        </div>
      ) : null}

      {/* フッターで submit を表示しているケースでは二重表示を避ける */}
      {!(showPublicToggle && !showBodyEditor) ? (
        <div className="flex justify-end">
          <Button type="submit">{props.submitLabel}</Button>
        </div>
      ) : null}
    </form>
  );
}
