"use client";

import * as React from "react";

import type { Locale as DateFnsLocale } from "date-fns";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { DayPicker } from "react-day-picker";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({ className, classNames, ...props }: CalendarProps) {
  const dayPickerLocale = props.locale ?? ja;
  const isDropdownCaption =
    props.captionLayout?.startsWith("dropdown") ?? false;
  const dateFnsLocale: DateFnsLocale =
    props.locale &&
    typeof props.locale === "object" &&
    "localize" in props.locale &&
    "formatLong" in props.locale
      ? (props.locale as unknown as DateFnsLocale)
      : ja;

  return (
    <DayPicker
      locale={dayPickerLocale}
      weekStartsOn={props.weekStartsOn ?? 0}
      showOutsideDays={props.showOutsideDays ?? true}
      className={cn("p-2", className)}
      classNames={{
        months: "relative flex flex-col",
        month: "space-y-4 w-max",
        month_caption: "flex items-center justify-between",
        caption_label: cn(
          "text-sm font-medium",
          isDropdownCaption && "sr-only"
        ),
        caption_dropdowns: "flex items-center gap-2",
        dropdown: "h-8 rounded-md border bg-background px-2 text-sm",
        dropdown_month: "",
        dropdown_year: "",
        nav: cn("flex items-center gap-1", isDropdownCaption && "hidden"),
        button_previous: cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "h-8 w-8 p-0",
          isDropdownCaption && "hidden"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "h-8 w-8 p-0",
          isDropdownCaption && "hidden"
        ),
        month_grid: "w-max border-collapse",
        weekdays: "",
        weekday:
          "h-9 w-9 p-0 text-center text-xs font-medium text-muted-foreground",
        weeks: "",
        week: "",
        day: "h-9 w-9 p-0 text-center align-middle",
        day_button: cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "h-9 w-9 p-0 font-normal"
        ),
        selected: "bg-foreground text-background rounded-md",
        today: "border rounded-md",
        outside: "text-muted-foreground/50",
        disabled: "text-muted-foreground/50 opacity-50",
        ...classNames,
      }}
      formatters={{
        ...props.formatters,
        formatWeekdayName: (date) =>
          format(date, "EEEEE", {
            locale: dateFnsLocale,
          }),
      }}
      {...props}
    />
  );
}
