import Link from "next/link";

import { LayoutGrid, NotebookPen, SquareTerminal } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

export function DashboardNav() {
  return (
    <aside className="w-16 border-r bg-background">
      <nav className="flex h-full flex-col items-center gap-3 py-4">
        <Link
          href="/dashboard"
          aria-label="Dashboard"
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <LayoutGrid className="h-5 w-5" />
        </Link>
        <Link
          href="/dashboard/game-specs"
          aria-label="Game Spec 管理"
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <SquareTerminal className="h-5 w-5" />
        </Link>
        <Link
          href="/dashboard/game-reviews"
          aria-label="Game Review 管理"
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <NotebookPen className="h-5 w-5" />
        </Link>
      </nav>
    </aside>
  );
}
