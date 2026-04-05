"use client";

import { useMemo, useState } from "react";
import { useWatchlist } from "@/lib/watchlist-context";
import { PosterCard } from "@/components/poster-card";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Heart, Shuffle, Sparkles } from "lucide-react";
import Link from "next/link";

export default function RecommendPage() {
  const { items } = useWatchlist();
  const favorites = useMemo(
    () => items.filter((i) => i.favorite),
    [items]
  );
  const [spotlight, setSpotlight] = useState<number | null>(null);

  const handleShuffle = () => {
    if (favorites.length === 0) return;
    const randomIndex = Math.floor(Math.random() * favorites.length);
    setSpotlight(randomIndex);
  };

  if (favorites.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <EmptyState
          icon={Heart}
          title="No Recommendations Yet"
          description="Mark items as favorites from their detail page to see them here."
        >
          <Button
            nativeButton={false}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
            render={<Link href="/watchlist" />}
          >
            Browse Watchlist
          </Button>
        </EmptyState>
      </div>
    );
  }

  const spotlightItem = spotlight !== null ? favorites[spotlight] : null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Sparkles className="h-7 w-7 text-netflix-red" />
              Surprise Me
            </h1>
            <p className="text-muted-foreground mt-1">
              Your top picks. Can't decide? Hit shuffle.
            </p>
          </div>
          <Button
            onClick={handleShuffle}
            className="bg-netflix-red hover:bg-netflix-red/80 text-white font-semibold gap-2 w-fit"
          >
            <Shuffle className="h-4 w-4" />
            Shuffle Pick
          </Button>
        </div>

        {/* Spotlight */}
        {spotlightItem && (
          <div className="relative rounded-lg overflow-hidden p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center">
            <div
              className="absolute inset-0 opacity-30 blur-xl"
              style={{ background: spotlightItem.posterGradient }}
            />
            <div className="absolute inset-0 bg-background/60" />
            <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-center w-full">
              <div className="shrink-0">
                <PosterCard item={spotlightItem} size="lg" />
              </div>
              <div className="flex flex-col gap-2 text-center sm:text-left">
                <p className="text-xs uppercase tracking-widest text-netflix-red font-semibold">
                  Tonight's pick
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  {spotlightItem.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {spotlightItem.year} / {spotlightItem.genre} /{" "}
                  {spotlightItem.mediaType === "movie" ? "Movie" : "TV Show"}
                </p>
                {spotlightItem.review && (
                  <p className="text-sm text-white/70 mt-2 max-w-lg">
                    "{spotlightItem.review}"
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">
            All Favorites ({favorites.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {favorites.map((item) => (
              <PosterCard key={item.id} item={item} className="w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
