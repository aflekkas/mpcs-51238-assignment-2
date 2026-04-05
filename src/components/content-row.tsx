"use client";

import { motion } from "motion/react";
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
      <motion.h2
        className="text-lg sm:text-xl font-semibold text-white px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        {title}
      </motion.h2>
      <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-4">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 40, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{
              duration: 0.4,
              delay: i * 0.08,
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
          >
            <PosterCard item={item} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
