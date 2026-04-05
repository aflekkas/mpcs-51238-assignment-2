"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { type WatchItem } from "@/lib/types";
import { StatusBadge } from "./status-badge";
import { StarRating } from "./star-rating";

interface PosterCardProps {
  item: WatchItem;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PosterCard({ item, size = "md", className }: PosterCardProps) {
  const sizeClasses = {
    sm: "w-32 sm:w-36",
    md: "w-40 sm:w-48",
    lg: "w-52 sm:w-64",
  };

  return (
    <Link href={`/watchlist/${item.slug}`} className={cn("group block shrink-0", className)}>
      <div
        className={cn(
          "relative aspect-[2/3] overflow-hidden rounded-sm transition-all duration-300 group-hover:scale-105 group-hover:z-10 group-hover:ring-1 group-hover:ring-white/20 group-hover:shadow-xl group-hover:shadow-black/50",
          sizeClasses[size]
        )}
      >
        {/* Gradient poster */}
        <div
          className="absolute inset-0"
          style={{ background: item.posterGradient }}
        />

        {/* Status badge */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <StatusBadge status={item.status} />
        </div>

        {/* Bottom overlay with info */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2">
            {item.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-white/60">
            <span>{item.year}</span>
            <span className="capitalize">{item.mediaType}</span>
          </div>
          {item.rating && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <StarRating value={item.rating} size="sm" readonly />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
