"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_OPTIONS, type WatchStatus } from "@/lib/types";

interface StatusSelectProps {
  value: WatchStatus;
  onValueChange: (value: WatchStatus) => void;
  className?: string;
}

export function StatusSelect({ value, onValueChange, className }: StatusSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(val) => val && onValueChange(val as WatchStatus)}
    >
      <SelectTrigger className={className ?? "w-full bg-white/5"}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUS_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
