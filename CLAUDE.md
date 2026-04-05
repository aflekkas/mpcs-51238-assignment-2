# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**CANTFINDAFLIX** - A Netflix-inspired watchlist app for tracking movies and TV shows. Built for MPCS 51238 Assignment 2.

Built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, and shadcn/ui (base-ui). Uses bun as the package manager. Dark mode only with a Netflix-inspired color scheme (#141414 background, #E50914 red accents).

Assignment spec is in `docs/Week 2 Assignment 2.pdf`.

## Commands

- `bun dev` - start dev server
- `bun run build` - production build
- `bun run lint` - run ESLint
- `bunx shadcn@latest add <component>` - add a shadcn/ui component

## Playwright MCP

Configured in `.mcp.json` at the project root. Use the Playwright MCP tools (browser_navigate, browser_snapshot, browser_click, etc.) for verifying the app visually during development.

## Pages

| Route | File | Description |
|---|---|---|
| `/` | `src/app/page.tsx` | Homepage with hero section featuring a favorite item, and horizontal scroll rows grouped by watch status |
| `/watchlist` | `src/app/watchlist/page.tsx` | Full watchlist grid with tab filtering (All/Watching/Plan to Watch/Completed/Dropped) and search |
| `/watchlist/[slug]` | `src/app/watchlist/[slug]/page.tsx` | Detail page for a single item (dynamic route). Inline editing for status, rating, review, and favorite toggle. Delete with confirmation. |
| `/add` | `src/app/add/page.tsx` | Form to add a new movie or show to the watchlist |
| `/recommend` | `src/app/recommend/page.tsx` | "Surprise Me" view showing favorited items with a shuffle picker |

## Data Model

All state is client-side only via React Context (`src/lib/watchlist-context.tsx`). Data does not persist across page refreshes. Initialized with 12 seed items from `src/lib/seed-data.ts`.

```typescript
type MediaType = "movie" | "show"
type WatchStatus = "watching" | "completed" | "plan-to-watch" | "dropped"

interface WatchItem {
  id: string              // crypto.randomUUID()
  slug: string            // URL-safe, derived from title
  title: string
  mediaType: MediaType
  genre: string
  year: number
  status: WatchStatus
  rating: number | null   // 1-5 stars
  review: string
  favorite: boolean
  posterGradient: string  // CSS gradient for placeholder poster
  addedAt: string         // ISO date string
}
```

## Architecture

- **App Router** with `src/` directory structure
- **Path alias**: `@/*` maps to `./src/*`
- **UI components**: `src/components/ui/` (shadcn/ui with base-ui primitives, do not edit directly, add new ones via `bunx shadcn@latest add`)
- **Custom components**: `src/components/` (navbar, poster-card, hero-section, content-row, star-rating, status-badge, empty-state, add-item-form, item-detail, delete-confirm-dialog, theme-provider)
- **State**: `src/lib/watchlist-context.tsx` (React Context + useState)
- **Types**: `src/lib/types.ts`
- **Utilities**: `src/lib/utils.ts` (cn helper, slugify)
- **Hooks**: `src/hooks/use-mobile.ts`
- **Styling**: Tailwind v4 with Netflix-inspired dark theme via CSS variables in `src/app/globals.css`. Fonts: Inter (body), Bebas Neue (logo).
- **Icons**: lucide-react
- **Toasts**: sonner

## Important Notes

- shadcn/ui in this project uses `@base-ui/react` primitives (not Radix). Components use `render` prop instead of `asChild` for composition.
- The `Select` component's `onValueChange` passes `string | null`, so always guard against null.
- All custom components are `"use client"` since they depend on React Context.
