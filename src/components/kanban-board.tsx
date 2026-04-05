"use client";

import { useMemo, useCallback } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { toast } from "sonner";
import { useWatchlist } from "@/lib/watchlist-context";
import { type WatchItem, type WatchStatus, STATUS_LABELS } from "@/lib/types";
import { KanbanColumn } from "./kanban-column";

const COLUMN_ORDER: WatchStatus[] = [
  "watching",
  "plan-to-watch",
  "completed",
  "dropped",
];

interface KanbanBoardProps {
  search: string;
}

export function KanbanBoard({ search }: KanbanBoardProps) {
  const { items, moveItem } = useWatchlist();

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.genre.toLowerCase().includes(q)
    );
  }, [items, search]);

  const columns = useMemo(() => {
    const grouped: Record<WatchStatus, WatchItem[]> = {
      watching: [],
      "plan-to-watch": [],
      completed: [],
      dropped: [],
    };
    for (const item of filtered) {
      grouped[item.status].push(item);
    }
    return grouped;
  }, [filtered]);

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      const { draggableId, destination, source } = result;
      if (!destination) return;

      // No change if dropped in the same spot
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }

      const targetStatus = destination.droppableId as WatchStatus;
      const isCrossColumn = destination.droppableId !== source.droppableId;

      moveItem(draggableId, targetStatus, destination.index);

      if (isCrossColumn) {
        const item = items.find((i) => i.id === draggableId);
        if (item) {
          toast.success(
            `"${item.title}" is now ${STATUS_LABELS[targetStatus]}!`
          );
        }
      }
    },
    [items, moveItem]
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMN_ORDER.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            items={columns[status]}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
