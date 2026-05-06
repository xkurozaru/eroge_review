"use client";

import { endOfMonth, format, parse, startOfMonth, subMonths } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  from: string;
  to: string;
}

export function DateRangePicker({ from, to }: DateRangePickerProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const fromDate = parse(from, "yyyy-MM-dd", new Date());
  const toDate = parse(to, "yyyy-MM-dd", new Date());

  const defaultFromMonth = format(startOfMonth(fromDate), "yyyy-MM");
  const defaultToMonth = format(startOfMonth(toDate), "yyyy-MM");

  const [fromMonth, setFromMonth] = useState(defaultFromMonth);
  const [toMonth, setToMonth] = useState(defaultToMonth);

  const buildQueryRange = (fromMonthValue: string, toMonthValue: string) => {
    const start = parse(`${fromMonthValue}-01`, "yyyy-MM-dd", new Date());
    const end = endOfMonth(
      parse(`${toMonthValue}-01`, "yyyy-MM-dd", new Date()),
    );
    const params = new URLSearchParams();
    params.set("from", format(start, "yyyy-MM-dd"));
    params.set("to", format(end, "yyyy-MM-dd"));
    return params.toString();
  };

  const handlePresetClick = (months: number) => {
    const newTo = startOfMonth(new Date());
    const newFrom = startOfMonth(subMonths(newTo, months - 1));
    const params = new URLSearchParams();
    params.set("from", format(newFrom, "yyyy-MM-dd"));
    params.set("to", format(endOfMonth(newTo), "yyyy-MM-dd"));
    router.push(`/dashboard?${params.toString()}`);
    setIsOpen(false);
  };

  const handleApply = () => {
    const query = buildQueryRange(fromMonth, toMonth);
    router.push(`/dashboard?${query}`);
    setIsOpen(false);
  };

  return (
    <div className="flex gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("justify-start text-left font-normal")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(fromDate, "yyyy/MM")} - {format(toDate, "yyyy/MM")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[340px] p-4" align="start">
          <div className="space-y-4">
            <div className="grid gap-3">
              <label className="grid gap-1 text-sm text-muted-foreground">
                開始月
                <input
                  type="month"
                  value={fromMonth}
                  onChange={(event) => setFromMonth(event.target.value)}
                  className="rounded-md border border-slate-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="grid gap-1 text-sm text-muted-foreground">
                終了月
                <input
                  type="month"
                  value={toMonth}
                  onChange={(event) => setToMonth(event.target.value)}
                  className="rounded-md border border-slate-200 px-3 py-2 text-sm"
                />
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => handlePresetClick(12)}>
                直近12か月
              </Button>
              <Button variant="outline" onClick={() => handlePresetClick(6)}>
                直近6か月
              </Button>
              <Button variant="outline" onClick={() => handlePresetClick(3)}>
                直近3か月
              </Button>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsOpen(false)}>
                キャンセル
              </Button>
              <Button onClick={handleApply}>適用</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
