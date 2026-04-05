"use client";

import { Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
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
            <motion.div
              key={star}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: star * 0.05, type: "spring", stiffness: 400, damping: 15 }}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  filled
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-white/20"
                )}
              />
            </motion.div>
          );
        }

        return (
          <motion.button
            key={star}
            type="button"
            onClick={() => {
              onChange(value === star ? null : star);
            }}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.8, rotate: -15 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={filled ? "filled" : "empty"}
                initial={{ scale: 0.5, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 12 }}
              >
                <Star
                  className={cn(
                    sizeClasses[size],
                    filled
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-white/30 hover:text-yellow-400/50"
                  )}
                />
              </motion.div>
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}
