import Image from "next/image";
import Link from "next/link";

import { Gamepad2, LayoutDashboard, NotebookPen } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

export function DashboardNav() {
  return (
    <aside className="w-16 border-r bg-background">
      <nav className="flex h-full flex-col items-center gap-3 py-4">
        {/* サイトロゴ */}
        <div className="mb-6 flex h-12 w-12 items-center justify-center">
          <Image
            src="/logo.png"
            alt="Eroge Review Logo"
            width={48}
            height={48}
            className="rounded-md"
          />
        </div>

        {/* Dashboard アイコン */}
        <Link
          href="/dashboard"
          aria-label="Dashboard"
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <LayoutDashboard className="h-5 w-5" />
        </Link>

        {/* Game Spec アイコン */}
        <Link
          href="/dashboard/game-specs"
          aria-label="Game Spec 管理"
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <Gamepad2 className="h-5 w-5" />
        </Link>

        {/* Game Review アイコン */}
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
