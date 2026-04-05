"use client";

import { useWatchlist } from "@/lib/watchlist-context";
import { HeroSection } from "@/components/hero-section";
import { ContentRow } from "@/components/content-row";

export default function Home() {
  const { items } = useWatchlist();

  const featured = items.find((i) => i.favorite) ?? items[0];
  const watching = items.filter((i) => i.status === "watching");
  const planToWatch = items.filter((i) => i.status === "plan-to-watch");
  const completed = items.filter((i) => i.status === "completed");
  const dropped = items.filter((i) => i.status === "dropped");

  return (
    <div className="flex flex-col gap-8 pb-16">
      {featured && <HeroSection item={featured} />}

      <div className="flex flex-col gap-10 max-w-7xl mx-auto w-full">
        <ContentRow title="Currently Watching" items={watching} />
        <ContentRow title="Plan to Watch" items={planToWatch} />
        <ContentRow title="Completed" items={completed} />
        <ContentRow title="Dropped" items={dropped} />
      </div>
    </div>
  );
}
