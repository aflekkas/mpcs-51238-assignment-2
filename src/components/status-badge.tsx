import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { type WatchStatus, STATUS_LABELS } from "@/lib/types";

const statusColors: Record<WatchStatus, string> = {
  watching: "bg-blue-500/80 text-white border-blue-400/30",
  completed: "bg-green-500/80 text-white border-green-400/30",
  "plan-to-watch": "bg-amber-500/80 text-white border-amber-400/30",
  dropped: "bg-zinc-500/80 text-white border-zinc-400/30",
};

interface StatusBadgeProps {
  status: WatchStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      className={cn(
        "text-[10px] font-medium px-1.5 py-0.5",
        statusColors[status],
        className
      )}
    >
      {STATUS_LABELS[status]}
    </Badge>
  );
}
