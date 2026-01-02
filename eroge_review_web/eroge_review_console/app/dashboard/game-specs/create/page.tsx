import { redirect } from "next/navigation";

import { GameSpecForm } from "@/components/feature/game_spec/game-spec-form";
import { createGameSpec } from "@/lib/api/gameSpecApi";

export default function GameSpecCreatePage() {
  async function createAction(formData: FormData) {
    "use server";
    const title = String(formData.get("title") || "").trim();
    const brand = String(formData.get("brand") || "").trim();
    const releaseDate = String(formData.get("release_date") || "").trim();

    await createGameSpec({
      title,
      brand,
      release_date: releaseDate,
    });

    redirect("/dashboard/game-specs");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Game Spec 新規作成</h1>

      <GameSpecForm action={createAction} submitLabel="新規作成" />
    </div>
  );
}
