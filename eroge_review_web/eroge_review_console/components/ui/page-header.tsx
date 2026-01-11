import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PageHeaderProps {
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}

export function PageHeader({ children, className, actions }: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex items-center justify-between gap-4 border-b pb-4 mb-6",
        className
      )}
    >
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        {children}
      </h1>
      {actions && (
        <div className="ml-auto flex items-center gap-2">{actions}</div>
      )}
    </header>
  );
}
