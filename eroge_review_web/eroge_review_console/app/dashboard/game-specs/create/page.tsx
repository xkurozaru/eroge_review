import { redirect } from "next/navigation";

import { createGameSpec } from "@/lib/api/gameSpecApi";

export default function GameSpecCreatePage() {
  async function createAction(formData: FormData) {
    "use server";
    const title = String(formData.get("title") || "").trim();
    const brandRaw = String(formData.get("brand") || "").trim();
    const releaseDate = String(formData.get("release_date") || "").trim();

    await createGameSpec({
      title,
      brand: brandRaw ? brandRaw : null,
      release_date: releaseDate,
    });

    redirect("/dashboard/game-specs");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Game Spec 新規作成</h1>

      <form
        action={createAction}
        className="space-y-5 rounded-lg border bg-background p-6"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium">タイトル</label>
          <input
            name="title"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">ブランド名</label>
          <input
            name="brand"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">リリース日</label>
          <input
            name="release_date"
            type="date"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            required
          />
        </div>

        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-md bg-foreground px-4 text-sm font-medium text-background"
        >
          新規作成
        </button>
      </form>
    </div>
  );
}
