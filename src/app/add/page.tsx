"use client";

import { motion } from "motion/react";
import { AddItemForm } from "@/components/add-item-form";

export default function AddPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold text-white">Add to Watchlist</h1>
          <p className="text-muted-foreground mt-1">
            Add a movie or show to track
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <AddItemForm />
        </motion.div>
      </div>
    </div>
  );
}
