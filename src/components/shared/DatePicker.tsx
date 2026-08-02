"use client";

import { CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Popover } from "@base-ui/react/popover";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

type DatePickerProps = {
  label: string;
  minDate?: Date;
  name: string;
  onChange: (value: string) => void;
  value: string;
};

export default function DatePicker({ label, minDate, name, onChange, value }: DatePickerProps) {
  const selectedDate = value ? parseISO(value) : undefined;

  return <label className="block text-sm font-medium">{label}<input name={name} readOnly required type="hidden" value={value} /><Popover.Root><Popover.Trigger render={<Button className="mt-2 w-full justify-start font-normal" variant="outline" />}><CalendarIcon />{selectedDate ? format(selectedDate, "PPP") : `Select ${label.toLowerCase()}`}</Popover.Trigger><Popover.Portal><Popover.Positioner align="start" sideOffset={8}><Popover.Popup className="z-50 rounded-xl border bg-popover p-1 text-popover-foreground shadow-lg outline-none"><Calendar disabled={minDate ? { before: minDate } : undefined} mode="single" onSelect={(date) => { if (date) onChange(format(date, "yyyy-MM-dd")); }} selected={selectedDate} /></Popover.Popup></Popover.Positioner></Popover.Portal></Popover.Root></label>;
}
