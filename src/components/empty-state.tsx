"use client";

import { type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  children?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  className,
  children,
}: EmptyStateProps) {
  return (
    <motion.div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-16 px-4 text-center",
        className
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <motion.div
        className="rounded-full bg-white/5 p-4"
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 15 }}
      >
        <Icon className="h-8 w-8 text-muted-foreground" />
      </motion.div>
      <motion.div
        className="flex flex-col gap-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
      >
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-md">{description}</p>
      </motion.div>
      {children && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.3 }}
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}
