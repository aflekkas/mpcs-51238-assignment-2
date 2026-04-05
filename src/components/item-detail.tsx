"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWatchlist } from "@/lib/watchlist-context";
import { type WatchItem, type WatchStatus, STATUS_LABELS } from "@/lib/types";
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

  const handleStatusChange = (newStatus: string) => {
    updateItem(item.id, { status: newStatus as WatchStatus });
    toast.success(`Status updated to "${STATUS_LABELS[newStatus as WatchStatus]}"`);
  };

  const handleRatingChange = (newRating: number | null) => {
    updateItem(item.id, { rating: newRating });
    toast.success(newRating ? `Rated ${newRating}/5 stars` : "Rating cleared");
  };

  const handleFavoriteToggle = () => {
    updateItem(item.id, { favorite: !item.favorite });
    toast.success(item.favorite ? "Removed from recommendations" : "Added to recommendations");
  };

  const handleReviewSave = () => {
    updateItem(item.id, { review: reviewDraft.trim() });
    setIsEditingReview(false);
    toast.success("Review updated");
  };

  const handleDelete = () => {
    deleteItem(item.id);
    toast.success(`Deleted "${item.title}"`);
    router.push("/watchlist");
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Back button */}
      <Link
        href="/watchlist"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Watchlist
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Poster */}
        <div className="shrink-0">
          <div
            className="w-full max-w-xs mx-auto lg:mx-0 lg:w-64 aspect-[2/3] rounded-md overflow-hidden"
            style={{ background: item.posterGradient }}
          />
        </div>

        {/* Details */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <StatusBadge status={item.status} />
              <span className="text-sm text-muted-foreground">
                {item.year} / {item.genre} / {item.mediaType === "movie" ? "Movie" : "TV Show"}
              </span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                {item.title}
              </h1>
              <button
                onClick={handleFavoriteToggle}
                className="shrink-0 mt-1 p-2 rounded-full hover:bg-white/10 transition-colors"
                title={item.favorite ? "Remove from recommendations" : "Add to recommendations"}
              >
                <Heart
                  className={cn(
                    "h-6 w-6 transition-colors",
                    item.favorite
                      ? "fill-netflix-red text-netflix-red"
                      : "text-muted-foreground hover:text-white"
                  )}
                />
              </button>
            </div>
          </div>

          {/* Rating */}
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Rating</Label>
            <StarRating
              value={item.rating}
              onChange={handleRatingChange}
              size="md"
            />
          </div>

          {/* Status */}
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Status</Label>
            <Select value={item.status} onValueChange={(val) => val && handleStatusChange(val)}>
              <SelectTrigger className="w-48 bg-white/5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="plan-to-watch">Plan to Watch</SelectItem>
                <SelectItem value="watching">Watching</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="dropped">Dropped</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Review */}
          <div className="flex flex-col gap-2">
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
            {isEditingReview ? (
              <div className="flex flex-col gap-2">
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
              </div>
            ) : (
              <p className="text-sm text-white/80">
                {item.review || "No review yet."}
              </p>
            )}
          </div>

          {/* Added date + delete */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <span className="text-xs text-muted-foreground">
              Added {new Date(item.addedAt).toLocaleDateString()}
            </span>
            <DeleteConfirmDialog title={item.title} onConfirm={handleDelete} />
          </div>
        </div>
      </div>
    </div>
  );
}
