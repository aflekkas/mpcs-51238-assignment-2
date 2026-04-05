"use client";

import { useMemo, useState, useCallback } from "react";
import { useWatchlist } from "@/lib/watchlist-context";
import { PosterCard } from "@/components/poster-card";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Heart, Shuffle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BlurFade } from "@/components/ui/blur-fade";
import Link from "next/link";

export default function RecommendPage() {
  const { items } = useWatchlist();
  const favorites = useMemo(
    () => items.filter((i) => i.favorite),
    [items]
  );
  const [spotlight, setSpotlight] = useState<number | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);

  const handleShuffle = useCallback(() => {
    if (favorites.length === 0 || isShuffling) return;
    setIsShuffling(true);

    // Quick cycling through items for slot-machine feel
    let count = 0;
    const totalCycles = 8 + Math.floor(Math.random() * 5);
    const interval = setInterval(() => {
      setSpotlight(Math.floor(Math.random() * favorites.length));
      count++;
      if (count >= totalCycles) {
        clearInterval(interval);
        const finalIndex = Math.floor(Math.random() * favorites.length);
        setSpotlight(finalIndex);
        setShuffleKey((k) => k + 1);
        setIsShuffling(false);
      }
    }, 100);
  }, [favorites.length, isShuffling]);

  if (favorites.length === 0) {
    return (
      <motion.div
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <EmptyState
          icon={Heart}
          title="No Recommendations Yet"
          description="Mark items as favorites from their detail page to see them here."
        >
          <Button
            nativeButton={false}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
            render={<Link href="/" />}
          >
            Browse Watchlist
          </Button>
        </EmptyState>
      </motion.div>
    );
  }

  const spotlightItem = spotlight !== null ? favorites[spotlight] : null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Sparkles className="h-7 w-7 text-netflix-red" />
              </motion.div>
              Surprise Me
            </h1>
            <p className="text-muted-foreground mt-1">
              Your top picks. Can&apos;t decide? Hit shuffle.
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95, rotate: -3 }}>
            <Button
              onClick={handleShuffle}
              disabled={isShuffling}
              className="bg-netflix-red hover:bg-netflix-red/80 text-white font-semibold gap-2 w-fit"
            >
              <motion.div
                animate={isShuffling ? { rotate: 360 } : {}}
                transition={isShuffling ? { duration: 0.5, repeat: Infinity, ease: "linear" } : {}}
              >
                <Shuffle className="h-4 w-4" />
              </motion.div>
              {isShuffling ? "Shuffling..." : "Shuffle Pick"}
            </Button>
          </motion.div>
        </motion.div>

        {/* Spotlight */}
        <AnimatePresence mode="wait">
          {spotlightItem && (
            <motion.div
              key={shuffleKey}
              className="relative rounded-lg overflow-hidden p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center"
              initial={{ opacity: 0, scale: 0.8, rotateX: 15 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              style={{ transformPerspective: 1000 }}
            >
              <div
                className="absolute inset-0 opacity-30 blur-xl"
                style={{ background: spotlightItem.posterGradient }}
              />
              <div className="absolute inset-0 bg-background/60" />
              <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-center w-full">
                <motion.div
                  className="shrink-0"
                  initial={{ opacity: 0, x: -30, rotateY: -20 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 150 }}
                >
                  <PosterCard item={spotlightItem} size="lg" />
                </motion.div>
                <motion.div
                  className="flex flex-col gap-2 text-center sm:text-left"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                >
                  <motion.p
                    className="text-xs uppercase tracking-widest text-netflix-red font-semibold"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    Tonight&apos;s pick
                  </motion.p>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">
                    {spotlightItem.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {spotlightItem.year} / {spotlightItem.genre} /{" "}
                    {spotlightItem.mediaType === "movie" ? "Movie" : "TV Show"}
                  </p>
                  {spotlightItem.review && (
                    <p className="text-sm text-white/70 mt-2 max-w-lg">
                      &ldquo;{spotlightItem.review}&rdquo;
                    </p>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        <div>
          <motion.h2
            className="text-lg font-semibold text-white mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            All Favorites ({favorites.length})
          </motion.h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8">
            {favorites.map((item, i) => (
              <BlurFade key={item.id} delay={0.1 + i * 0.05} yOffset={16}>
                <PosterCard item={item} className="w-full" />
              </BlurFade>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
