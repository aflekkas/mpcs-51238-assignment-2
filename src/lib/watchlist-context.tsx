"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { seedData } from "./seed-data";
import { type WatchItem, type WatchStatus } from "./types";
import { generateUniqueSlug } from "./utils";

interface WatchlistContextValue {
  items: WatchItem[];
  addItem: (
    item: Omit<WatchItem, "id" | "slug" | "addedAt">
  ) => WatchItem;
  updateItem: (id: string, updates: Partial<WatchItem>) => void;
  moveItem: (itemId: string, newStatus: WatchStatus, destinationIndex: number) => void;
  deleteItem: (id: string) => void;
  getItemBySlug: (slug: string) => WatchItem | undefined;
}

const WatchlistContext = createContext<WatchlistContextValue | null>(null);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WatchItem[]>(seedData);

  const getItemBySlug = useCallback(
    (slug: string) => items.find((item) => item.slug === slug),
    [items]
  );

  const addItem = useCallback(
    (data: Omit<WatchItem, "id" | "slug" | "addedAt">) => {
      const RESERVED_SLUGS = ["add", "recommend"];
      const existingSlugs = new Set([...items.map((i) => i.slug), ...RESERVED_SLUGS]);
      const slug = generateUniqueSlug(data.title, existingSlugs);

      const newItem: WatchItem = {
        ...data,
        id: crypto.randomUUID(),
        slug,
        addedAt: new Date().toISOString(),
      };

      setItems((prev) => [newItem, ...prev]);
      return newItem;
    },
    [items]
  );

  const updateItem = useCallback(
    (id: string, updates: Partial<WatchItem>) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        )
      );
    },
    []
  );

  const moveItem = useCallback(
    (itemId: string, newStatus: WatchStatus, destinationIndex: number) => {
      setItems((prev) => {
        const itemIndex = prev.findIndex((i) => i.id === itemId);
        if (itemIndex === -1) return prev;

        const item = prev[itemIndex];
        const updatedItem = { ...item, status: newStatus };

        // Remove the item from its current position
        const without = [...prev];
        without.splice(itemIndex, 1);

        // Find items in the destination column (in their array order)
        const columnItems = without.filter((i) => i.status === newStatus);

        // Determine where in the full array to insert
        let insertIndex: number;
        if (columnItems.length === 0 || destinationIndex >= columnItems.length) {
          // Insert after the last item in this column, or at end if column is empty
          if (columnItems.length === 0) {
            insertIndex = without.length;
          } else {
            insertIndex = without.indexOf(columnItems[columnItems.length - 1]) + 1;
          }
        } else {
          // Insert before the item at destinationIndex
          insertIndex = without.indexOf(columnItems[destinationIndex]);
        }

        without.splice(insertIndex, 0, updatedItem);
        return without;
      });
    },
    []
  );

  const deleteItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return (
    <WatchlistContext value={{ items, addItem, updateItem, moveItem, deleteItem, getItemBySlug }}>
      {children}
    </WatchlistContext>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
}
