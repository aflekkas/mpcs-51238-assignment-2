"use client";

import { useState, useMemo, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { toast } from "sonner";
import { useWatchlist } from "@/lib/watchlist-context";
import { type WatchItem, type WatchStatus, STATUS_LABELS } from "@/lib/types";
import { KanbanColumn } from "./kanban-column";
import { KanbanCard } from "./kanban-card";

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
  const { items, updateItem } = useWatchlist();
  const [activeItem, setActiveItem] = useState<WatchItem | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor)
  );

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

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const item = items.find((i) => i.id === event.active.id);
      if (item) setActiveItem(item);
    },
    [items]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveItem(null);
      const { active, over } = event;
      if (!over) return;

      const draggedItemId = active.id as string;
      let targetStatus: WatchStatus | null = null;

      // Check if dropped on a column
      if (COLUMN_ORDER.includes(over.id as WatchStatus)) {
        targetStatus = over.id as WatchStatus;
      }

      if (!targetStatus) return;

      const item = items.find((i) => i.id === draggedItemId);
      if (item && item.status !== targetStatus) {
        updateItem(draggedItemId, { status: targetStatus });
        toast.success(
          `Moved "${item.title}" to ${STATUS_LABELS[targetStatus]}`
        );
      }
    },
    [items, updateItem]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMN_ORDER.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            items={columns[status]}
          />
        ))}
      </div>

      <DragOverlay>
        {activeItem ? <KanbanCard item={activeItem} overlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
