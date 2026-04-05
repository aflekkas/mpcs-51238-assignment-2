"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Plus } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { type WatchItem } from "@/lib/types";
import { StatusBadge } from "./status-badge";
import { StarRating } from "./star-rating";

interface HeroSectionProps {
  item: WatchItem;
}

export function HeroSection({ item }: HeroSectionProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative w-full min-h-[60vh] flex items-end overflow-hidden">
      {/* Background gradient fallback */}
      <div
        className="absolute inset-0 scale-110 blur-xl opacity-40"
        style={{ background: item.posterGradient }}
      />

      {/* Background poster image */}
      {item.posterUrl && !imgError && (
        <Image
          src={item.posterUrl}
          alt=""
          fill
          className="object-cover opacity-30 scale-110 blur-sm"
          sizes="100vw"
          priority
          onError={() => setImgError(true)}
        />
      )}

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 pt-32">
        <div className="max-w-2xl flex flex-col gap-4">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <StatusBadge status={item.status} />
            <span className="text-sm text-white/60">
              {item.year} / {item.genre} / {item.mediaType === "movie" ? "Movie" : "TV Show"}
            </span>
          </motion.div>

          <motion.h1
            className="font-logo text-5xl sm:text-6xl lg:text-7xl text-white tracking-wide"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 100 }}
          >
            {item.title}
          </motion.h1>

          {item.rating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <StarRating value={item.rating} readonly size="md" />
            </motion.div>
          )}

          {item.review && (
            <motion.p
              className="text-base sm:text-lg text-white/70 line-clamp-3 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              {item.review}
            </motion.p>
          )}

          <motion.div
            className="flex gap-3 mt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button
              nativeButton={false}
              className="bg-netflix-red hover:bg-netflix-red/80 text-white font-semibold gap-2"
              render={<Link href={`/watchlist/${item.slug}`} />}
            >
              <Play className="h-4 w-4 fill-white" />
              View Details
            </Button>
            <Button
              nativeButton={false}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 gap-2"
              render={<Link href="/add" />}
            >
              <Plus className="h-4 w-4" />
              Add New
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
