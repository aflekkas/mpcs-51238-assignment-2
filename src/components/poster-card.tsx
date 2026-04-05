"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "motion/react";
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
  const [imgError, setImgError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const scale = useMotionValue(1);

  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 20 });
  const springScale = useSpring(scale, { stiffness: 300, damping: 20 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // -1 to 1 range
      const percentX = (e.clientX - centerX) / (rect.width / 2);
      const percentY = (e.clientY - centerY) / (rect.height / 2);

      // Tilt towards mouse: rotateY for horizontal, rotateX for vertical (inverted)
      rotateY.set(percentX * 15);
      rotateX.set(percentY * -10);
      scale.set(1.08);
    },
    [rotateX, rotateY, scale]
  );

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  }, [rotateX, rotateY, scale]);

  const sizeClasses = {
    sm: "w-32 sm:w-36",
    md: "w-40 sm:w-48",
    lg: "w-52 sm:w-64",
  };

  return (
    <Link href={`/${item.slug}`} className={cn("group block shrink-0", className)}>
      <motion.div
        ref={cardRef}
        className={cn(
          "relative aspect-[2/3] overflow-hidden rounded-sm",
          sizeClasses[size]
        )}
        style={{
          transformPerspective: 800,
          rotateX: springRotateX,
          rotateY: springRotateY,
          scale: springScale,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Gradient fallback */}
        <div
          className="absolute inset-0"
          style={{ background: item.posterGradient }}
        />

        {/* Poster image */}
        {item.posterUrl && !imgError && (
          <Image
            src={item.posterUrl}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 160px, 256px"
            onError={() => setImgError(true)}
          />
        )}

        {/* Status badge */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <StatusBadge status={item.status} />
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-netflix-red/0 group-hover:bg-netflix-red/10 pointer-events-none transition-colors duration-300" />

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
      </motion.div>
    </Link>
  );
}
