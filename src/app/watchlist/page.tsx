"use client";

import { useState, useMemo } from "react";
import { useWatchlist } from "@/lib/watchlist-context";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { PosterCard } from "@/components/poster-card";
import { EmptyState } from "@/components/empty-state";
import { Film, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/ui/blur-fade";
import { motion, AnimatePresence } from "motion/react";
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
        <BlurFade delay={0.05}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">My List</h1>
              <p className="text-muted-foreground mt-1">
                {items.length} {items.length === 1 ? "title" : "titles"} in your watchlist
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                nativeButton={false}
                className="bg-netflix-red hover:bg-netflix-red/80 text-white font-semibold gap-2 w-fit"
                render={<Link href="/add" />}
              >
                <Plus className="h-4 w-4" />
                Add New
              </Button>
            </motion.div>
          </div>
        </BlurFade>

        {/* Search */}
        <BlurFade delay={0.15}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or genre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white/5"
            />
          </div>
        </BlurFade>

        {/* Tabs */}
        <BlurFade delay={0.25}>
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
                <AnimatePresence mode="wait">
                  {filtered.length > 0 ? (
                    <motion.div
                      key={`${activeTab}-${search}-grid`}
                      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {filtered.map((item, i) => (
                        <BlurFade key={item.id} delay={0.05 + i * 0.04} yOffset={12}>
                          <PosterCard item={item} className="w-full" />
                        </BlurFade>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <EmptyState
                        icon={Film}
                        title="Nothing here"
                        description={
                          search
                            ? `No results for "${search}"`
                            : "No items in this category yet."
                        }
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>
            ))}
          </Tabs>
        </BlurFade>
      </div>
    </div>
  );
}
