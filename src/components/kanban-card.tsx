"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Draggable } from "@hello-pangea/dnd";
import { motion } from "motion/react";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { type WatchItem } from "@/lib/types";
import { StarRating } from "./star-rating";

interface KanbanCardProps {
  item: WatchItem;
  index: number;
}

export function KanbanCard({ item, index }: KanbanCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: index * 0.04,
            type: "spring",
            stiffness: 300,
            damping: 25,
          }}
          className={cn(
            "flex items-center gap-3 rounded-md bg-white/5 p-2 transition-colors hover:bg-white/10",
            snapshot.isDragging && "bg-white/10 shadow-xl shadow-black/50 ring-1 ring-netflix-red/30 scale-105"
          )}
          style={{
            ...provided.draggableProps.style,
          }}
        >
          {/* Drag handle */}
          <div
            {...provided.dragHandleProps}
            className="shrink-0 cursor-grab active:cursor-grabbing text-white/20 hover:text-white/50"
          >
            <GripVertical className="h-4 w-4" />
          </div>

          {/* Clickable content */}
          <Link href={`/${item.slug}`} className="flex items-center gap-3 flex-1 min-w-0">
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
              <span className="text-xs text-muted-foreground">
                {item.year} / {item.genre}
              </span>
              {item.rating && <StarRating value={item.rating} size="sm" readonly />}
            </div>
          </Link>
        </motion.div>
      )}
    </Draggable>
  );
}
