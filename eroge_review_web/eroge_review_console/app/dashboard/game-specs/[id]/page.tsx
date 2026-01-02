import { redirect } from "next/navigation";

import { GameSpecForm } from "@/components/feature/game_spec/game-spec-form";
import { Button } from "@/components/ui/button";
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
    const brand = String(formData.get("brand") || "").trim();
    const releaseDate = String(formData.get("release_date") || "").trim();

    await updateGameSpec(params.id, {
      title,
      brand,
      release_date: releaseDate,
    });
    redirect("/dashboard/game-specs");
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
          <Button type="submit" variant="outline">
            削除
          </Button>
        </form>
      </header>

      <GameSpecForm
        action={updateAction}
        submitLabel="更新"
        defaultValues={{
          title: gameSpec.title,
          brand: gameSpec.brand,
          release_date: gameSpec.release_date,
        }}
      />
    </div>
  );
}
