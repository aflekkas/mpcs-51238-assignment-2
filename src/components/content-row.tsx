"use client";

import { type WatchItem } from "@/lib/types";
import { PosterCard } from "./poster-card";

interface ContentRowProps {
  title: string;
  items: WatchItem[];
}

export function ContentRow({ title, items }: ContentRowProps) {
  if (items.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg sm:text-xl font-semibold text-white px-4 sm:px-6 lg:px-8">
        {title}
      </h2>
      <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-4">
        {items.map((item) => (
          <PosterCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
