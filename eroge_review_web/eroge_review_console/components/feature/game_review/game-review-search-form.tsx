import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type GameReviewSearchParams = {
  title?: string;
  brand?: string;
  status?: string;
  page?: string;
};

export function GameReviewSearchForm(props: {
  title: string;
  brand: string;
  status: string;
}) {
  return (
    <form className="space-y-4" method="GET">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>タイトル（部分一致）</Label>
          <Input name="title" defaultValue={props.title} />
        </div>
        <div className="space-y-2">
          <Label>ブランド名（部分一致）</Label>
          <Input name="brand" defaultValue={props.brand} />
        </div>
        <div className="space-y-2">
          <Label>ステータス</Label>
          <select
            name="status"
            defaultValue={props.status}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="">（指定なし）</option>
            <option value="unreviewed">未評価</option>
            <option value="published">評価済・公開</option>
            <option value="draft">非公開</option>
          </select>
        </div>
      </div>

      <div>
        <Button type="submit" variant="outline">
          検索
        </Button>
      </div>
    </form>
  );
}
