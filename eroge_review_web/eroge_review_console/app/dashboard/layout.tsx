import Link from "next/link";

import { LayoutGrid, NotebookPen, SquareTerminal } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <aside className="w-16 border-r bg-background">
          <nav className="flex h-full flex-col items-center gap-3 py-4">
            <Link
              href="/dashboard"
              aria-label="Dashboard"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border bg-background"
            >
              <LayoutGrid className="h-5 w-5" />
            </Link>
            <Link
              href="/dashboard/game-specs"
              aria-label="Game Spec 管理"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border bg-background"
            >
              <SquareTerminal className="h-5 w-5" />
            </Link>
            <Link
              href="/dashboard/game-reviews"
              aria-label="Game Review 管理"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border bg-background"
            >
              <NotebookPen className="h-5 w-5" />
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
