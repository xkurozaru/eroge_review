import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function GameSpecForm({
  action,
  submitLabel,
  defaultValues,
}: {
  action: (formData: FormData) => void;
  submitLabel: string;
  defaultValues?: {
    title?: string;
    brand?: string;
    release_date?: string;
  };
}) {
  return (
    <form
      action={action}
      className="space-y-5 rounded-lg border bg-background p-6"
    >
      <div className="space-y-2">
        <Label>タイトル</Label>
        <Input
          name="title"
          defaultValue={defaultValues?.title ?? ""}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>ブランド名</Label>
        <Input
          name="brand"
          defaultValue={defaultValues?.brand ?? ""}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>リリース日</Label>
        <DatePicker
          name="release_date"
          defaultValue={defaultValues?.release_date ?? ""}
          required
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
