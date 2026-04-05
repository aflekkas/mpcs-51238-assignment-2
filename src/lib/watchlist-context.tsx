"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { seedData } from "./seed-data";
import { type WatchItem } from "./types";
import { slugify } from "./utils";

interface WatchlistContextValue {
  items: WatchItem[];
  addItem: (
    item: Omit<WatchItem, "id" | "slug" | "addedAt">
  ) => WatchItem;
  updateItem: (id: string, updates: Partial<WatchItem>) => void;
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
      let slug = slugify(data.title);

      // Handle slug collisions
      const existingSlugs = new Set(items.map((i) => i.slug));
      if (existingSlugs.has(slug)) {
        let counter = 2;
        while (existingSlugs.has(`${slug}-${counter}`)) {
          counter++;
        }
        slug = `${slug}-${counter}`;
      }

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

  const deleteItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return (
    <WatchlistContext value={{ items, addItem, updateItem, deleteItem, getItemBySlug }}>
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
