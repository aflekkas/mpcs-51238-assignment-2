"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useWatchlist } from "@/lib/watchlist-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KanbanBoard } from "@/components/kanban-board";

export default function Home() {
  const { items } = useWatchlist();
  const [search, setSearch] = useState("");

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-white">My List</h1>
            <p className="text-muted-foreground mt-1">
              {items.length} {items.length === 1 ? "title" : "titles"} in your watchlist
            </p>
          </div>
          <Button
            nativeButton={false}
            className="bg-netflix-red hover:bg-netflix-red/80 text-white font-semibold gap-2 w-fit"
            render={<Link href="/add" />}
          >
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        </motion.div>

        {/* Search */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or genre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white/5"
          />
        </motion.div>

        {/* Kanban Board */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <KanbanBoard search={search} />
        </motion.div>
      </div>
    </div>
  );
}
