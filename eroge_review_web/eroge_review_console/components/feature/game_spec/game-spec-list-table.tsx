import Link from "next/link";

import { formatDateTime } from "@/lib/datetime";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type GameSpecListItem = {
  id?: string;
  title: string;
  brand: string;
  release_date: string;
  created_at: string;
  updated_at: string;
};

export function GameSpecListTable({ items }: { items: GameSpecListItem[] }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="text-left">
            <TableHead>タイトル</TableHead>
            <TableHead>ブランド</TableHead>
            <TableHead>リリース日</TableHead>
            <TableHead>作成日時</TableHead>
            <TableHead>更新日時</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((it, index) => (
            <TableRow key={it.id ?? `${it.title}-${index}`}>
              <TableCell>
                {it.id ? (
                  <Link
                    href={`/dashboard/game-specs/${it.id}`}
                    className="underline"
                  >
                    {it.title}
                  </Link>
                ) : (
                  it.title
                )}
              </TableCell>
              <TableCell>{it.brand}</TableCell>
              <TableCell>{it.release_date}</TableCell>
              <TableCell>{formatDateTime(it.created_at)}</TableCell>
              <TableCell>{formatDateTime(it.updated_at)}</TableCell>
            </TableRow>
          ))}
          {items.length === 0 && (
            <TableRow>
              <TableCell className="py-6 text-muted-foreground" colSpan={5}>
                0件
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
