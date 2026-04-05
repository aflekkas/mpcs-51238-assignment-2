export type MediaType = "movie" | "show";
export type WatchStatus = "watching" | "completed" | "plan-to-watch" | "dropped";

export interface WatchItem {
  id: string;
  slug: string;
  title: string;
  mediaType: MediaType;
  genre: string;
  year: number;
  status: WatchStatus;
  rating: number | null;
  review: string;
  favorite: boolean;
  posterUrl?: string;
  posterGradient: string;
  addedAt: string;
}

export const GENRES = [
  "Action",
  "Comedy",
  "Drama",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Documentary",
  "Animation",
  "Fantasy",
] as const;

export const STATUS_LABELS: Record<WatchStatus, string> = {
  watching: "Watching",
  completed: "Completed",
  "plan-to-watch": "Plan to Watch",
  dropped: "Dropped",
};
