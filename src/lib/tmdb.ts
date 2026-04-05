export interface TmdbSearchResult {
  id: number;
  title: string;
  posterUrl: string | null;
  year: number | null;
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
  if (!query.trim()) return [];

  // Check cache first
  const key = getCacheKey(query, mediaType);
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.results;
  }

  try {
    const params = new URLSearchParams({ query, type: mediaType });
    const res = await fetch(`/api/tmdb?${params}`);
    if (!res.ok) return [];

    const data = await res.json();
    const results: TmdbSearchResult[] = data.results ?? [];

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
