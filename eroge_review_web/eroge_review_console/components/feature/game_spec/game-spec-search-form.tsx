import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type GameSpecSearchParams = {
  title?: string;
  brand?: string;
  page?: string;
};

export function GameSpecSearchForm({
  title,
  brand,
}: {
  title: string;
  brand: string;
}) {
  return (
    <form className="flex flex-col gap-3 md:flex-row md:items-end" method="get">
      <div className="flex-1 space-y-2">
        <Label>タイトル（部分一致）</Label>
        <Input name="title" defaultValue={title} />
      </div>

      <div className="flex-1 space-y-2">
        <Label>ブランド名（部分一致）</Label>
        <Input name="brand" defaultValue={brand} />
      </div>

      <Button type="submit">検索</Button>
    </form>
  );
}
