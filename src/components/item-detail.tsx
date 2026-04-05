"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Heart } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWatchlist } from "@/lib/watchlist-context";
import { type WatchItem, type WatchStatus, STATUS_LABELS } from "@/lib/types";
import { PosterImage } from "./poster-image";
import { MediaMetadata } from "./media-metadata";
import { StatusSelect } from "./status-select";
import { StarRating } from "./star-rating";
import { StatusBadge } from "./status-badge";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import { cn } from "@/lib/utils";

interface ItemDetailProps {
  item: WatchItem;
}

export function ItemDetail({ item }: ItemDetailProps) {
  const router = useRouter();
  const { updateItem, deleteItem } = useWatchlist();
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [reviewDraft, setReviewDraft] = useState(item.review);

  const handleStatusChange = (newStatus: WatchStatus) => {
    updateItem(item.id, { status: newStatus });
    toast.success(`Now "${STATUS_LABELS[newStatus]}" -- nice!`);
  };

  const handleRatingChange = (newRating: number | null) => {
    updateItem(item.id, { rating: newRating });
    const msgs = ["Great taste!", "Noted!", "Fair enough!", "Solid pick!", "Interesting..."];
    toast.success(newRating ? `${"★".repeat(newRating)}${"☆".repeat(5 - newRating)} ${msgs[newRating - 1]}` : "Rating cleared");
  };

  const handleFavoriteToggle = () => {
    updateItem(item.id, { favorite: !item.favorite });
    toast.success(item.favorite ? "Removed from the VIP list" : "Added to the VIP list!");
  };

  const handleReviewSave = () => {
    updateItem(item.id, { review: reviewDraft.trim() });
    setIsEditingReview(false);
    toast.success("Review saved! Certified critic moment.");
  };

  const handleDelete = () => {
    deleteItem(item.id);
    toast.success(`"${item.title}" has left the chat.`);
    router.push("/");
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Watchlist
        </Link>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Poster */}
        <motion.div
          className="shrink-0"
          initial={{ opacity: 0, x: -40, rotateY: -15 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          style={{ transformPerspective: 800 }}
        >
          <div className="relative w-full max-w-xs mx-auto lg:mx-0 lg:w-64 aspect-[2/3] rounded-md overflow-hidden">
            <PosterImage
              posterUrl={item.posterUrl}
              posterGradient={item.posterGradient}
              alt={item.title}
              sizes="256px"
            />
          </div>
        </motion.div>

        {/* Details */}
        <div className="flex-1 flex flex-col gap-6">
          <motion.div
            className="flex flex-col gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            <div className="flex items-center gap-3 flex-wrap">
              <StatusBadge status={item.status} />
              <MediaMetadata item={item} className="text-sm text-muted-foreground" />
            </div>

            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                {item.title}
              </h1>
              <motion.button
                onClick={handleFavoriteToggle}
                className="shrink-0 mt-1 p-2 rounded-full hover:bg-white/10 transition-colors"
                title={item.favorite ? "Remove from recommendations" : "Add to recommendations"}
                whileTap={{ scale: 0.8 }}
                animate={item.favorite ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart
                  className={cn(
                    "h-6 w-6 transition-colors",
                    item.favorite
                      ? "fill-netflix-red text-netflix-red"
                      : "text-muted-foreground hover:text-white"
                  )}
                />
              </motion.button>
            </div>
          </motion.div>

          {/* Rating */}
          <motion.div
            className="flex flex-col gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
          >
            <Label className="text-muted-foreground">Rating</Label>
            <StarRating
              value={item.rating}
              onChange={handleRatingChange}
              size="md"
            />
          </motion.div>

          {/* Status */}
          <motion.div
            className="flex flex-col gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
          >
            <Label className="text-muted-foreground">Status</Label>
            <StatusSelect
              value={item.status}
              onValueChange={handleStatusChange}
              className="w-48 bg-white/5"
            />
          </motion.div>

          {/* Review */}
          <motion.div
            className="flex flex-col gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <Label className="text-muted-foreground">Review</Label>
              {!isEditingReview && (
                <button
                  onClick={() => {
                    setReviewDraft(item.review);
                    setIsEditingReview(true);
                  }}
                  className="text-xs text-netflix-red hover:underline"
                >
                  {item.review ? "Edit" : "Add review"}
                </button>
              )}
            </div>
            <AnimatePresence mode="wait">
              {isEditingReview ? (
                <motion.div
                  key="editing"
                  className="flex flex-col gap-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Textarea
                    value={reviewDraft}
                    onChange={(e) => setReviewDraft(e.target.value)}
                    rows={4}
                    className="bg-white/5 resize-none"
                    placeholder="What did you think?"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleReviewSave}
                      className="bg-netflix-red hover:bg-netflix-red/80 text-white"
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditingReview(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.p
                  key="display"
                  className="text-sm text-white/80"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {item.review || "No review yet."}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Added date + delete */}
          <motion.div
            className="flex items-center justify-between pt-4 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.4 }}
          >
            <span className="text-xs text-muted-foreground">
              Added {new Date(item.addedAt).toLocaleDateString()}
            </span>
            <DeleteConfirmDialog title={item.title} onConfirm={handleDelete} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
