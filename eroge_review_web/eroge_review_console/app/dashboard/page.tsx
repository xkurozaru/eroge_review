import { format, parse, subDays } from "date-fns";

import { DashboardContent } from "@/components/feature/dashboard/dashboard-content";
import { listReviewScoreStatsDaily } from "@/lib/api/reviewScoreStatsApi";

export default async function DashboardPage(props: PageProps<"/dashboard">) {
  const searchParams = await props.searchParams;

  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 29);

  const fromStr =
    (searchParams.from as string) || format(defaultFrom, "yyyy-MM-dd");
  const toStr = (searchParams.to as string) || format(defaultTo, "yyyy-MM-dd");

  let from: Date;
  let to: Date;

  try {
    from = parse(fromStr, "yyyy-MM-dd", new Date());
    to = parse(toStr, "yyyy-MM-dd", new Date());
  } catch {
    from = defaultFrom;
    to = defaultTo;
  }

  const since = format(from, "yyyy-MM-dd");
  const until = format(to, "yyyy-MM-dd");

  const data = await listReviewScoreStatsDaily(since, until);

  return (
    <DashboardContent
      initialData={data}
      initialFrom={since}
      initialTo={until}
    />
  );
}
