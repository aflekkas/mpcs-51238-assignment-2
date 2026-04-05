"use client";

import { useState, useMemo } from "react";
import { useWatchlist } from "@/lib/watchlist-context";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { PosterCard } from "@/components/poster-card";
import { EmptyState } from "@/components/empty-state";
import { Film, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { type WatchStatus } from "@/lib/types";

const tabs: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "watching", label: "Watching" },
  { value: "plan-to-watch", label: "Plan to Watch" },
  { value: "completed", label: "Completed" },
  { value: "dropped", label: "Dropped" },
];

export default function WatchlistPage() {
  const { items } = useWatchlist();
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let result = items;

    if (activeTab !== "all") {
      result = result.filter((i) => i.status === (activeTab as WatchStatus));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.genre.toLowerCase().includes(q)
      );
    }

    return result;
  }, [items, activeTab, search]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">My List</h1>
            <p className="text-muted-foreground mt-1">
              {items.length} {items.length === 1 ? "title" : "titles"} in your watchlist
            </p>
          </div>
          <Button
            className="bg-netflix-red hover:bg-netflix-red/80 text-white font-semibold gap-2 w-fit"
            render={<Link href="/add" />}
          >
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or genre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white/5"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList variant="line" className="w-full sm:w-auto overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {filtered.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                  {filtered.map((item) => (
                    <PosterCard key={item.id} item={item} className="w-full" />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Film}
                  title="Nothing here"
                  description={
                    search
                      ? `No results for "${search}"`
                      : "No items in this category yet."
                  }
                />
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
