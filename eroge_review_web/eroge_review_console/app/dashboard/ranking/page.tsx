import { PageHeader } from "@/components/ui/page-header";
import { listGameSpecs } from "@/lib/api/gameSpecApi";
import { RankingClient } from "./ranking-client";

export default async function RankingPage() {
  const data = await listGameSpecs({ page: 1, pageSize: 50 });

  return (
    <div className="space-y-6">
      <PageHeader>Ranking</PageHeader>
      <RankingClient items={data.items} />
    </div>
  );
}
