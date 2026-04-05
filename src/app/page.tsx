"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useWatchlist } from "@/lib/watchlist-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BlurFade } from "@/components/ui/blur-fade";
import { TextAnimate } from "@/components/ui/text-animate";
import { NumberTicker } from "@/components/ui/number-ticker";
import { KanbanBoard } from "@/components/kanban-board";

export default function Home() {
  const { items } = useWatchlist();
  const [search, setSearch] = useState("");

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <BlurFade delay={0.05}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <TextAnimate
                as="h1"
                animation="blurInUp"
                by="word"
                className="text-3xl font-bold text-white"
                once
              >
                My List
              </TextAnimate>
              <p className="text-muted-foreground mt-1">
                <NumberTicker value={items.length} className="text-muted-foreground" />{" "}
                {items.length === 1 ? "title" : "titles"} in your watchlist
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

        {/* Kanban Board */}
        <KanbanBoard search={search} />
      </div>
    </div>
  );
}
