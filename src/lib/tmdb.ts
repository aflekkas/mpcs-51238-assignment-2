const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export interface TmdbSearchResult {
  id: number;
  title: string;
  posterUrl: string | null;
  year: number | null;
  overview: string;
}

export function isTmdbConfigured(): boolean {
  return !!TMDB_API_KEY;
}

// In-memory cache: key is "mediaType:query", value is { results, timestamp }
const cache = new Map<
  string,
  { results: TmdbSearchResult[]; timestamp: number }
>();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes
const MAX_CACHE_SIZE = 200;

function getCacheKey(query: string, mediaType: string): string {
  return `${mediaType}:${query.trim().toLowerCase()}`;
}

export async function searchTmdb(
  query: string,
  mediaType: "movie" | "show"
): Promise<TmdbSearchResult[]> {
  if (!TMDB_API_KEY || !query.trim()) return [];

  // Check cache first
  const key = getCacheKey(query, mediaType);
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.results;
  }

  const endpoint = mediaType === "movie" ? "search/movie" : "search/tv";
  const url = `${TMDB_BASE}/${endpoint}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`;

  try {
    const res = await fetch(url);
    if (!res.ok) return [];

    const data = await res.json();
    const results: TmdbSearchResult[] = (data.results ?? [])
      .slice(0, 6)
      .map((item: Record<string, unknown>) => {
        const title = (item.title ?? item.name ?? "") as string;
        const date = (item.release_date ?? item.first_air_date ?? "") as string;
        const posterPath = item.poster_path as string | null;

        return {
          id: item.id as number,
          title,
          posterUrl: posterPath ? `${TMDB_IMAGE_BASE}/w500${posterPath}` : null,
          year: date ? parseInt(date.substring(0, 4), 10) : null,
          overview: (item.overview ?? "") as string,
        };
      });

    // Evict oldest entries if cache is full
    if (cache.size >= MAX_CACHE_SIZE) {
      const oldest = [...cache.entries()].sort(
        (a, b) => a[1].timestamp - b[1].timestamp
      );
      for (let i = 0; i < 50; i++) cache.delete(oldest[i][0]);
    }

    cache.set(key, { results, timestamp: Date.now() });
    return results;
  } catch {
    return [];
  }
}
