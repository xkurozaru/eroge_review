"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ScopeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const SCOPES = [
  { value: "published_all", label: "公開済み（全期間）" },
  { value: "published_90d", label: "公開済み（90日以内）" },
] as const;

export function ScopeSelector({ value, onChange }: ScopeSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[240px]">
        <SelectValue placeholder="スコープを選択" />
      </SelectTrigger>
      <SelectContent>
        {SCOPES.map((scope) => (
          <SelectItem key={scope.value} value={scope.value}>
            {scope.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
