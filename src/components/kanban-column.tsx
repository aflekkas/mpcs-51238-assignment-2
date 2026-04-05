"use client";

import { Droppable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { type WatchItem, type WatchStatus, STATUS_LABELS } from "@/lib/types";
import { KanbanCard } from "./kanban-card";

const columnAccents: Record<WatchStatus, { bg: string; border: string; dot: string }> = {
  watching: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    dot: "bg-blue-500",
  },
  "plan-to-watch": {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    dot: "bg-amber-500",
  },
  completed: {
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    dot: "bg-green-500",
  },
  dropped: {
    bg: "bg-zinc-500/10",
    border: "border-zinc-500/30",
    dot: "bg-zinc-500",
  },
};

interface KanbanColumnProps {
  status: WatchStatus;
  items: WatchItem[];
}

export function KanbanColumn({ status, items }: KanbanColumnProps) {
  const accent = columnAccents[status];

  return (
    <div className={cn("flex flex-col rounded-lg border", accent.border, "bg-white/[0.02]")}>
      {/* Column header */}
      <div className={cn("flex items-center gap-2 px-3 py-2.5 border-b", accent.border)}>
        <div className={cn("h-2 w-2 rounded-full", accent.dot)} />
        <h3 className="text-sm font-semibold text-white">
          {STATUS_LABELS[status]}
        </h3>
        <span className="text-xs text-muted-foreground ml-auto">
          {items.length}
        </span>
      </div>

      {/* Droppable area */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex flex-col gap-1.5 p-2 min-h-[120px] max-h-[calc(100vh-260px)] overflow-y-auto scrollbar-hide transition-colors rounded-b-lg",
              snapshot.isDraggingOver && accent.bg
            )}
          >
            {items.map((item, index) => (
              <KanbanCard key={item.id} item={item} index={index} />
            ))}
            {provided.placeholder}
            {items.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex-1 flex items-center justify-center rounded-md border border-dashed border-white/10 p-4 min-h-[80px]">
                <p className="text-xs text-muted-foreground text-center">
                  Drag items here
                </p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
