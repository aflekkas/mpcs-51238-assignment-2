"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { useWatchlist } from "@/lib/watchlist-context";
import { GENRES, type MediaType, type WatchStatus } from "@/lib/types";
import { StarRating } from "./star-rating";
import { searchTmdb, type TmdbSearchResult } from "@/lib/tmdb";

const POSTER_GRADIENTS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
  "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
  "linear-gradient(135deg, #f5576c 0%, #ff6a00 100%)",
  "linear-gradient(135deg, #0c3483 0%, #a2b6df 70%, #6b8cce 100%)",
];

export function AddItemForm() {
  const router = useRouter();
  const { addItem } = useWatchlist();

  const [title, setTitle] = useState("");
  const [mediaType, setMediaType] = useState<MediaType>("movie");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [status, setStatus] = useState<WatchStatus>("plan-to-watch");
  const [rating, setRating] = useState<number | null>(null);
  const [review, setReview] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [posterUrl, setPosterUrl] = useState("");

  // TMDB search state
  const [searchResults, setSearchResults] = useState<TmdbSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const doSearch = useCallback(
    async (query: string) => {
      if (query.trim().length < 3) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      const results = await searchTmdb(query, mediaType);
      setSearchResults(results);
      setShowResults(results.length > 0);
      setIsSearching(false);
    },
    [mediaType]
  );

  // Debounced search on title change
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (title.trim().length < 3) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    searchTimeoutRef.current = setTimeout(() => doSearch(title), 700);
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [title, doSearch]);

  // Close results when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (resultsRef.current && !resultsRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectResult = (result: TmdbSearchResult) => {
    setTitle(result.title);
    if (result.posterUrl) setPosterUrl(result.posterUrl);
    if (result.year) setYear(result.year.toString());
    setShowResults(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!genre) {
      toast.error("Genre is required");
      return;
    }

    const yearNum = parseInt(year, 10);
    if (!year || isNaN(yearNum) || yearNum < 1900 || yearNum > 2030) {
      toast.error("Enter a valid year (1900-2030)");
      return;
    }

    const randomGradient =
      POSTER_GRADIENTS[Math.floor(Math.random() * POSTER_GRADIENTS.length)];

    const newItem = addItem({
      title: title.trim(),
      mediaType,
      genre,
      year: yearNum,
      status,
      rating,
      review: review.trim(),
      favorite,
      posterUrl: posterUrl.trim() || undefined,
      posterGradient: randomGradient,
    });

    toast.success(`Added "${newItem.title}" to your watchlist`);
    router.push(`/${newItem.slug}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Title with TMDB search */}
      <div className="relative flex flex-col gap-2" ref={resultsRef}>
        <Label htmlFor="title">Title</Label>
        <div className="relative">
          <Input
            id="title"
            placeholder="e.g. The Dark Knight"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowResults(true)}
            className="bg-white/5"
          />
          {tmdbEnabled && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </div>
          )}
        </div>
        {tmdbEnabled && (
          <p className="text-xs text-muted-foreground">
            Start typing to search TMDB for posters
          </p>
        )}

        {/* Search results dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-md border border-white/10 bg-neutral-900 shadow-xl max-h-80 overflow-y-auto">
            {searchResults.map((result) => (
              <button
                key={result.id}
                type="button"
                onClick={() => selectResult(result)}
                className="flex items-center gap-3 w-full px-3 py-2 hover:bg-white/10 transition-colors text-left"
              >
                {result.posterUrl ? (
                  <Image
                    src={result.posterUrl}
                    alt={result.title}
                    width={40}
                    height={60}
                    className="rounded-sm object-cover shrink-0"
                  />
                ) : (
                  <div className="w-10 h-15 rounded-sm bg-white/10 shrink-0" />
                )}
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-sm font-medium text-white truncate">
                    {result.title}
                  </span>
                  {result.year && (
                    <span className="text-xs text-muted-foreground">
                      {result.year}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Media Type */}
      <div className="flex flex-col gap-2">
        <Label>Type</Label>
        <RadioGroup
          value={mediaType}
          onValueChange={(val) => setMediaType(val as MediaType)}
          className="flex gap-4"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="movie" />
            <Label className="cursor-pointer font-normal">Movie</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="show" />
            <Label className="cursor-pointer font-normal">TV Show</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Genre and Year */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label>Genre</Label>
          <Select value={genre} onValueChange={(val) => val && setGenre(val)}>
            <SelectTrigger className="w-full bg-white/5">
              <SelectValue placeholder="Select genre" />
            </SelectTrigger>
            <SelectContent>
              {GENRES.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            type="number"
            placeholder="e.g. 2024"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="bg-white/5"
          />
        </div>
      </div>

      {/* Status */}
      <div className="flex flex-col gap-2">
        <Label>Status</Label>
        <Select value={status} onValueChange={(val) => val && setStatus(val as WatchStatus)}>
          <SelectTrigger className="w-full bg-white/5">
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

      {/* Rating */}
      <div className="flex flex-col gap-2">
        <Label>Rating</Label>
        <StarRating value={rating} onChange={setRating} />
      </div>

      {/* Review */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="review">Review</Label>
        <Textarea
          id="review"
          placeholder="What did you think? (optional)"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={3}
          className="bg-white/5 resize-none"
        />
      </div>

      {/* Poster URL */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="posterUrl">Poster Image URL</Label>
        <Input
          id="posterUrl"
          type="url"
          placeholder="https://image.tmdb.org/t/p/w500/..."
          value={posterUrl}
          onChange={(e) => setPosterUrl(e.target.value)}
          className="bg-white/5"
        />
        {posterUrl && (
          <div className="mt-2 w-20 aspect-[2/3] rounded-sm overflow-hidden bg-white/5">
            <Image
              src={posterUrl}
              alt="Poster preview"
              width={80}
              height={120}
              className="object-cover w-full h-full"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          {tmdbEnabled
            ? "Auto-filled from TMDB search, or paste your own URL"
            : "Paste a direct image URL for the poster (optional)"}
        </p>
      </div>

      {/* Favorite */}
      <div className="flex items-center gap-3">
        <Switch
          checked={favorite}
          onCheckedChange={setFavorite}
        />
        <Label className="cursor-pointer font-normal">
          Add to recommendations
        </Label>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="bg-netflix-red hover:bg-netflix-red/80 text-white font-semibold w-full sm:w-auto"
      >
        Add to Watchlist
      </Button>
    </form>
  );
}
