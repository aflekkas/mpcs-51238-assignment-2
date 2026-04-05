import { NextRequest, NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE = "https://api.themoviedb.org/3";

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

        return {
          id: item.id as number,
          title,
          posterUrl: posterPath
            ? `https://image.tmdb.org/t/p/w500${posterPath}`
            : null,
          year: date ? parseInt(date.substring(0, 4), 10) : null,
        };
      }
    );

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
