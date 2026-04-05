"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "motion/react";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { type WatchItem } from "@/lib/types";
import { StarRating } from "./star-rating";

interface KanbanCardProps {
  item: WatchItem;
  overlay?: boolean;
}

export function KanbanCard({ item, overlay = false }: KanbanCardProps) {
  const [imgError, setImgError] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({ id: item.id });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
        zIndex: 50,
      }
    : undefined;

  const content = (
    <div
      className={cn(
        "flex items-center gap-3 rounded-md bg-white/5 p-2 transition-colors hover:bg-white/10 group",
        isDragging && "opacity-40",
        overlay && "bg-white/10 shadow-xl shadow-black/50 ring-1 ring-netflix-red/30 rotate-2"
      )}
    >
      {/* Drag handle */}
      {!overlay && (
        <div
          className="shrink-0 cursor-grab active:cursor-grabbing text-white/20 hover:text-white/50 touch-none"
          {...listeners}
          {...attributes}
        >
          <GripVertical className="h-4 w-4" />
        </div>
      )}

      {/* Poster thumbnail */}
      <div
        className="relative shrink-0 w-10 aspect-[2/3] rounded-sm overflow-hidden"
        style={{ background: item.posterGradient }}
      >
        {item.posterUrl && !imgError && (
          <Image
            src={item.posterUrl}
            alt={item.title}
            fill
            className="object-cover"
            sizes="40px"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{item.title}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {item.year} / {item.genre}
          </span>
        </div>
        {item.rating && <StarRating value={item.rating} size="sm" readonly />}
      </div>
    </div>
  );

  if (overlay) {
    return <div className="w-64">{content}</div>;
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/${item.slug}`} className="block">
        {content}
      </Link>
    </motion.div>
  );
}
