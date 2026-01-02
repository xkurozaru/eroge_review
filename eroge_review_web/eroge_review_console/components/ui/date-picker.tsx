"use client";

import * as React from "react";

import { format, isValid, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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

export function DatePicker({
  name,
  defaultValue,
  required,
}: {
  name: string;
  defaultValue?: string;
  required?: boolean;
}) {
  const [selected, setSelected] = React.useState<Date | undefined>(() =>
    toDate(defaultValue)
  );

  const centerYear = (selected ?? new Date()).getFullYear();
  const fromYear = centerYear - 20;
  const toYear = centerYear + 20;

  const display = selected ? format(selected, "yyyy/MM/dd") : "日付を選択";

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-full justify-between font-normal"
        )}
      >
        <span className={cn(!selected && "text-muted-foreground")}>
          {display}
        </span>
        <CalendarIcon className="h-4 w-4 opacity-70" />
      </PopoverTrigger>
      <PopoverContent align="start" className="p-2">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={setSelected}
          defaultMonth={selected}
          captionLayout="dropdown"
          fromYear={fromYear}
          toYear={toYear}
          initialFocus
        />
      </PopoverContent>

      <input
        type="hidden"
        name={name}
        value={toISODate(selected)}
        required={required}
      />
    </Popover>
  );
}
