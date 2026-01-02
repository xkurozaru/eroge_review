import { redirect } from "next/navigation";

import {
  deleteGameSpec,
  getGameSpec,
  updateGameSpec,
} from "@/lib/api/gameSpecApi";

type Params = {
  id: string;
};

export default async function GameSpecDetailPage(
  props: PageProps<"/dashboard/game-specs/[id]">
) {
  const params = (await props.params) as Params;
  const gameSpec = await getGameSpec(params.id);

  async function updateAction(formData: FormData) {
    "use server";
    const title = String(formData.get("title") || "").trim();
    const brandRaw = String(formData.get("brand") || "").trim();
    const releaseDate = String(formData.get("release_date") || "").trim();

    await updateGameSpec(params.id, {
      title,
      brand: brandRaw ? brandRaw : null,
      release_date: releaseDate,
    });
    redirect(`/dashboard/game-specs/${params.id}`);
  }

  async function deleteAction() {
    "use server";
    await deleteGameSpec(params.id);
    redirect("/dashboard/game-specs");
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Game Spec 詳細・編集</h1>
        <form action={deleteAction}>
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium"
          >
            削除
          </button>
        </form>
      </header>

      <form
        action={updateAction}
        className="space-y-5 rounded-lg border bg-background p-6"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium">タイトル</label>
          <input
            name="title"
            defaultValue={gameSpec.title}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">ブランド名</label>
          <input
            name="brand"
            defaultValue={gameSpec.brand ?? ""}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">リリース日</label>
          <input
            name="release_date"
            type="date"
            defaultValue={gameSpec.release_date}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            required
          />
        </div>

        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-md bg-foreground px-4 text-sm font-medium text-background"
        >
          更新
        </button>
      </form>
    </div>
  );
}
