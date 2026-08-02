"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";

function Calendar({ className, classNames, showOutsideDays = true, ...props }: React.ComponentProps<typeof DayPicker>) {
  return <DayPicker className={cn("p-3", className)} classNames={{ root: "w-full", months: "flex flex-col", month: "space-y-4", month_caption: "flex h-8 items-center justify-center", caption_label: "text-sm font-medium", nav: "flex items-center justify-between", button_previous: "inline-flex size-8 items-center justify-center rounded-md hover:bg-muted", button_next: "inline-flex size-8 items-center justify-center rounded-md hover:bg-muted", month_grid: "w-full border-collapse", weekdays: "flex", weekday: "w-9 text-center text-xs font-normal text-muted-foreground", week: "mt-1 flex w-full", day: "size-9 p-0 text-center text-sm", day_button: "inline-flex size-9 items-center justify-center rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40", selected: "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button:hover]:bg-primary", today: "[&>button]:border [&>button]:border-primary", outside: "text-muted-foreground opacity-50", disabled: "text-muted-foreground opacity-40", hidden: "invisible", ...classNames }} showOutsideDays={showOutsideDays} {...props} />;
}

export { Calendar };
