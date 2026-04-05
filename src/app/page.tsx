"use client";

import { useWatchlist } from "@/lib/watchlist-context";

export default function Home() {
  const { items } = useWatchlist();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
      <h1 className="text-4xl font-bold text-white">Watchlist</h1>
      <p className="text-muted-foreground">
        {items.length} items in your watchlist
      </p>
    </div>
  );
}
