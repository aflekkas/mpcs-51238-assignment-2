"use client";

import { Droppable } from "@hello-pangea/dnd";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { type WatchItem, type WatchStatus, STATUS_LABELS } from "@/lib/types";
import { NumberTicker } from "@/components/ui/number-ticker";
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

const columnIndex: Record<WatchStatus, number> = {
  watching: 0,
  "plan-to-watch": 1,
  completed: 2,
  dropped: 3,
};

interface KanbanColumnProps {
  status: WatchStatus;
  items: WatchItem[];
}

export function KanbanColumn({ status, items }: KanbanColumnProps) {
  const accent = columnAccents[status];
  const idx = columnIndex[status];

  return (
    <motion.div
      className={cn("flex flex-col rounded-lg border", accent.border, "bg-white/[0.02]")}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: idx * 0.08,
        type: "spring",
        stiffness: 200,
        damping: 20,
      }}
    >
      {/* Column header */}
      <div className={cn("flex items-center gap-2 px-3 py-2.5 border-b", accent.border)}>
        <motion.div
          className={cn("h-2 w-2 rounded-full", accent.dot)}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 + idx * 0.08, type: "spring", stiffness: 400 }}
        />
        <h3 className="text-sm font-semibold text-white">
          {STATUS_LABELS[status]}
        </h3>
        <span className="text-xs text-muted-foreground ml-auto">
          <NumberTicker value={items.length} className="text-muted-foreground text-xs" />
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
              <motion.div
                className="flex-1 flex items-center justify-center rounded-md border border-dashed border-white/10 p-4 min-h-[80px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-xs text-muted-foreground text-center">
                  Drag items here
                </p>
              </motion.div>
            )}
          </div>
        )}
      </Droppable>
    </motion.div>
  );
}
