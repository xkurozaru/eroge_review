"use client";

import { format, parse, subDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateRange {
  from: Date;
  to: Date;
}

interface DashboardDateRangePickerProps {
  from: string;
  to: string;
}

export function DashboardDateRangePicker({
  from,
  to,
}: DashboardDateRangePickerProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const fromDate = parse(from, "yyyy-MM-dd", new Date());
  const toDate = parse(to, "yyyy-MM-dd", new Date());

  const handlePresetClick = (days: number) => {
    const newTo = new Date();
    const newFrom = subDays(newTo, days - 1);
    const params = new URLSearchParams();
    params.set("from", format(newFrom, "yyyy-MM-dd"));
    params.set("to", format(newTo, "yyyy-MM-dd"));
    router.push(`/dashboard?${params.toString()}`);
    setIsOpen(false);
  };

  const handleRangeSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (range?.from && range?.to) {
      const params = new URLSearchParams();
      params.set("from", format(range.from, "yyyy-MM-dd"));
      params.set("to", format(range.to, "yyyy-MM-dd"));
      router.push(`/dashboard?${params.toString()}`);
      setIsOpen(false);
    }
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
            {format(fromDate, "yyyy/MM/dd")} - {format(toDate, "yyyy/MM/dd")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            <div className="border-r p-3">
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handlePresetClick(7)}
                >
                  直近7日
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handlePresetClick(30)}
                >
                  直近30日
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handlePresetClick(90)}
                >
                  直近90日
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handlePresetClick(365)}
                >
                  直近1年
                </Button>
              </div>
            </div>
            <div className="p-3">
              <Calendar
                mode="range"
                defaultMonth={fromDate}
                selected={{ from: fromDate, to: toDate }}
                onSelect={handleRangeSelect}
                numberOfMonths={2}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
