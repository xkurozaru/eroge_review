import { DashboardNav } from "@/components/feature/dashboard/dashboard-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <DashboardNav />

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
