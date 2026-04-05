import { type WatchItem } from "@/lib/types";

interface MediaMetadataProps {
  item: Pick<WatchItem, "year" | "genre" | "mediaType">;
  className?: string;
}

export function MediaMetadata({ item, className }: MediaMetadataProps) {
  return (
    <span className={className}>
      {item.year} / {item.genre} / {item.mediaType === "movie" ? "Movie" : "TV Show"}
    </span>
  );
}
