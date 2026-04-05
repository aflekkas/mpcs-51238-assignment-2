import { NextRequest, NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE = "https://api.themoviedb.org/3";

// Map TMDB genre IDs to our app's genre names
const GENRE_MAP: Record<number, string> = {
  // Movie genres
  28: "Action",
  12: "Action",
  35: "Comedy",
  18: "Drama",
  27: "Horror",
  10749: "Romance",
  878: "Sci-Fi",
  53: "Thriller",
  99: "Documentary",
  16: "Animation",
  14: "Fantasy",
  80: "Thriller",
  9648: "Thriller",
  // TV genres
  10759: "Action",
  10765: "Sci-Fi",
  10768: "Drama",
};

function mapGenre(genreIds: number[]): string | null {
  for (const id of genreIds) {
    if (GENRE_MAP[id]) return GENRE_MAP[id];
  }
  return null;
}

export async function GET(request: NextRequest) {
  if (!TMDB_API_KEY) {
    return NextResponse.json({ results: [] });
  }

  const { searchParams } = request.nextUrl;
  const query = searchParams.get("query") ?? "";
  const mediaType = searchParams.get("type") ?? "movie";

  if (query.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  const endpoint = mediaType === "movie" ? "search/movie" : "search/tv";
  const url = `${TMDB_BASE}/${endpoint}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`;

  try {
    const res = await fetch(url);
    if (!res.ok) return NextResponse.json({ results: [] });

    const data = await res.json();
    const results = (data.results ?? []).slice(0, 6).map(
      (item: Record<string, unknown>) => {
        const title = (item.title ?? item.name ?? "") as string;
        const date = (item.release_date ?? item.first_air_date ?? "") as string;
        const posterPath = item.poster_path as string | null;
        const genreIds = (item.genre_ids ?? []) as number[];

        return {
          id: item.id as number,
          title,
          posterUrl: posterPath
            ? `https://image.tmdb.org/t/p/w500${posterPath}`
            : null,
          year: date ? parseInt(date.substring(0, 4), 10) : null,
          genre: mapGenre(genreIds),
          overview: ((item.overview ?? "") as string).slice(0, 200),
        };
      }
    );

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
