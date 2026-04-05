# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

MPCS 51238 Assignment 2: a multi-page Next.js app that stores data in client-side state (no database). Built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, and shadcn/ui. Uses bun as the package manager.

Assignment spec is in `docs/Week 2 Assignment 2.pdf`.

## Commands

- `bun dev` - start dev server
- `bun run build` - production build
- `bun run lint` - run ESLint
- `bunx shadcn@latest add <component>` - add a shadcn/ui component

## Playwright MCP

Configured in `.mcp.json` at the project root. Use the Playwright MCP tools (browser_navigate, browser_snapshot, browser_click, etc.) for verifying the app visually during development.

## Architecture

- **App Router** with `src/` directory structure
- **Path alias**: `@/*` maps to `./src/*`
- **UI components**: `src/components/ui/` (shadcn/ui, do not edit directly, add new ones via `bunx shadcn@latest add`)
- **Custom components**: `src/components/`
- **Utilities**: `src/lib/utils.ts` (cn helper for merging Tailwind classes)
- **Hooks**: `src/hooks/`
- **Styling**: Tailwind v4 with CSS variables for theming defined in `src/app/globals.css`. shadcn uses `base-nova` style with `neutral` base color and `lucide` icons.
- **Data**: All state is client-side only (React state/context). No database, no API routes. Data does not persist across page refreshes.

## Requirements (from assignment)

- At least 4 distinct pages/routes
- A form that adds data (client-side state)
- A dynamic route (e.g., `/day/[date]` or `/recipe/[slug]`)
- Shared layout with navigation
- Styled with Tailwind
- Playwright MCP configured for verification
- Deployed to Vercel with a live URL
- Public GitHub repo with multiple commits
