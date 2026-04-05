"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number | null;
  onChange?: (rating: number | null) => void;
  readonly?: boolean;
  size?: "sm" | "md";
}

export function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
}: StarRatingProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
  };

  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-0.5">
      {stars.map((star) => {
        const filled = value !== null && star <= value;

        if (readonly || !onChange) {
          return (
            <Star
              key={star}
              className={cn(
                sizeClasses[size],
                filled
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-white/20"
              )}
            />
          );
        }

        return (
          <button
            key={star}
            type="button"
            onClick={() => {
              // Clicking the same star clears the rating
              onChange(value === star ? null : star);
            }}
            className="hover:scale-110 transition-transform"
          >
            <Star
              className={cn(
                sizeClasses[size],
                filled
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-white/30 hover:text-yellow-400/50"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
