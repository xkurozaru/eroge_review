"use client";

import * as React from "react";

import { format, isValid, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function toDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const d = parseISO(value);
  return isValid(d) ? d : undefined;
}

function toISODate(value?: Date): string {
  if (!value) return "";
  return format(value, "yyyy-MM-dd");
}

function toTimeString(value?: Date): string {
  if (!value) return "";
  return format(value, "HH:mm");
}

function clampTime(value: string): string {
  // Expect HH:mm; return "" for invalid.
  const m = value.match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  return m ? value : "";
}

export function DateTimePicker({
  name,
  defaultValue,
  required,
}: {
  name: string;
  defaultValue?: string;
  required?: boolean;
}) {
  const defaultDate = React.useMemo(() => toDate(defaultValue), [defaultValue]);

  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    defaultDate
  );
  const [time, setTime] = React.useState<string>(() =>
    clampTime(toTimeString(defaultDate))
  );

  React.useEffect(() => {
    setSelectedDate(defaultDate);
    setTime(clampTime(toTimeString(defaultDate)));
  }, [defaultDate]);

  const centerYear = (selectedDate ?? new Date()).getFullYear();
  const fromYear = centerYear - 20;
  const toYear = centerYear + 20;

  const display = selectedDate
    ? `${format(selectedDate, "yyyy/MM/dd")} ${time || "--:--"}`
    : "日時を選択";

  const value = selectedDate
    ? `${toISODate(selectedDate)}T${time || "00:00"}`
    : "";

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-full justify-between font-normal"
        )}
      >
        <span className={cn(!selectedDate && "text-muted-foreground")}>
          {display}
        </span>
        <CalendarIcon className="h-4 w-4 opacity-70" />
      </PopoverTrigger>

      <PopoverContent align="start" className="w-80 p-2">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          defaultMonth={selectedDate}
          captionLayout="dropdown"
          fromYear={fromYear}
          toYear={toYear}
          initialFocus
        />

        <div className="mt-2 flex items-center gap-2">
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(clampTime(e.target.value))}
            disabled={!selectedDate}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSelectedDate(undefined);
              setTime("");
            }}
          >
            クリア
          </Button>
        </div>
      </PopoverContent>

      <input type="hidden" name={name} value={value} required={required} />
    </Popover>
  );
}
