# Linkpond — Build Progress

> Living doc. Update this every session. Future Claude sessions read this first to know where we are.

---

## Current phase: Phase 6a — Share intent

**Learning goal:** native modules, development builds, Android share intents, app lifecycle.
**Build goal:** Share a link from YouTube/X into Linkpond and save it via a normal modal screen.

---

## What's been done

### Phase 0 — Setup & first screen ✅
- Scaffolded Expo SDK 56 project (React 19, RN 0.85.3, TypeScript, blank template)
- Installed Expo Router, set up file-based routing with tab navigation (`(tabs)/`)
- Scaffolded folder structure: `src/features/links/`, `src/components/`, `src/theme/`, `src/db/`, `src/lib/`
- Set up path aliases (`@/*`, `@theme`, `@db/*`, `@features/*`) in `tsconfig.json`
- Created `src/theme/theme.ts` with all design tokens (Colors, Spacing, Typography)
- Loaded Hanken Grotesk via `expo-font` (variable font, weights 400–700)
- Built `LinkCard` component (rich + fallback variants) in `src/features/links/components/`
- Rendered hardcoded cards with `FlatList` in `app/(tabs)/index.tsx`
- Verified on S24 Ultra: cards scroll, fonts load, colors match design

### Phase 1 — SQLite data layer ✅
- Installed `expo-sqlite`, opened DB with `openDatabaseSync`
- Wrote `src/db/client.ts`: opens DB, runs `initDB()` to create all 5 tables on startup
  - Tables: `links`, `groups`, `tags`, `link_tags`, `reminders`
  - `PRAGMA foreign_keys = ON` enabled
  - All schema uses `CREATE TABLE IF NOT EXISTS` — safe to re-run
- Wrote `src/features/links/data/links.repo.ts`: `getAllLinks`, `insertLink`, `getLinkById`
- Wrote `src/features/links/types.ts`: `Link` type matching DB schema
- Set up ESLint 9 flat config (`eslint.config.js`) + `eslint-plugin-unused-imports`
- Set up Prettier (`.prettierrc`) + VS Code format-on-save

### Phase 2 — Add form, detail screen, navigation ✅
- `app/add.tsx` — modal form (URL, title, note), parameterized SQL insert, error handling
- `app/link/[id].tsx` — detail screen, loads link by ID with `useFocusEffect`
- `app/(tabs)/index.tsx` — `FlatList` + `LinkCard`, FAB → add modal, `useFocusEffect` refreshes list on focus
- Added `getLinkById` to `links.repo.ts`
- Added `xxlarge` step to all Spacing + Typography scales in `theme.ts`
- Full flow verified on device: FAB → add → save → card in list → tap → detail screen

### Phase 3 — Preview fetching ✅
- `src/lib/fetchPreview.ts` — fetches OG tags (title, description, image, site_name, favicon)
- Optimistic insert in `add.tsx` — row inserted immediately, preview fetched in background
- `updateLinkPreview` in `links.repo.ts` — updates preview fields with `COALESCE` to preserve manual values
- Graceful fallback: IG/FB/X failures leave the row with just URL, `LinkCard` fallback variant renders cleanly

### Phase 4 — Groups & tags ✅
- Groups CRUD: create/edit/delete with name, color, icon picker (`app/group/create.tsx`)
- `src/features/groups/` — repo, hooks, types
- Groups tab (`app/(tabs)/groups.tsx`) — list with link count per group
- Home screen filter chips — tap group to filter, "All" resets; dynamic WHERE clause in `getAllLinks`
- `useGroups` hook with React Query

### Phase 5 — Search & sort ✅
- `getAllLinks` updated with dynamic WHERE clause supporting `search` + `groupId` simultaneously
- `src/lib/useDebounce.ts` — custom 300ms debounce hook using `useEffect` cleanup
- Search tab (`app/(tabs)/search.tsx`) — search input with icon, Recent/Oldest sort chips, results list
- Sort done in JS: `[...links].reverse()` for oldest-first (safe — avoids mutating React Query cache)
- Tab bar icons added (Ionicons), `SafeAreaView` applied to all tab screens

### Key fixes along the way
- `crypto.randomUUID()` not available on Hermes → `Math.random().toString(36).slice(2) + Date.now().toString(36)`
- `useFocusEffect` + `useCallback` required for data that must refresh on screen focus (vs `useEffect` which only runs on mount)
- Pre-commit hook catches: hardcoded hex values, missing error handling, unused vars

---

## Phase 3 — what to build next

1. **`src/lib/fetchPreview.ts`** — fetch URL HTML, parse OG tags (`og:title`, `og:description`, `og:image`, `og:site_name`, `og:url`). Return a `LinkPreview` object. Never throw — return nulls on failure.
2. **Optimistic insert** — `add.tsx` inserts the row immediately, then fires `fetchPreview` in the background and calls a new `updateLinkPreview(id, preview)` repo function.
3. **`updateLinkPreview`** in `links.repo.ts` — `UPDATE links SET title=?, description=?, thumbnail_url=?, site_name=?, favicon_url=? WHERE id=?`
4. **Home screen refresh** — `useFocusEffect` already handles this; the card upgrades on next focus.
5. **Fallback handling** — if fetch fails or returns nothing (IG/FB/X), the row stays with just the URL. `LinkCard` already has a fallback variant for this.

---

## Phases ahead (summary)

| Phase | Status | Goal |
|---|---|---|
| 0 | ✅ Done | Setup, fonts, hardcoded cards |
| 1 | ✅ Done | SQLite schema + data layer |
| 2 | ✅ Done | Add form, detail screen, navigation |
| 3 | ✅ Done | Preview fetch — OG parsing, graceful fallback |
| 4 | ✅ Done | Groups & tags — many-to-many, filter by group |
| 5 | ✅ Done | Search & sort — debounced input, SQLite FTS5 or in-memory |
| 6a | 🔄 Current | Share intent — receive URLs from other apps, dev build required |
| 6b | | Popup-over-app theming — translucent Activity, native config plugin |
| 7 | | Clipboard auto-detect — foreground lifecycle |
| 8 | | Reminders — local notifications, deep link from notification |
| 9 | | Polish — empty states, skeletons, app icon, splash |
| 10 (v2) | | Spaced resurfacing engine |

---

## Key decisions made

- **Design source of truth:** prototype `Linkpond/theme.jsx` > `CLAUDE.md` > anything else
- **No UI kits** — custom components against `theme.ts` only
- **No Zustand/TanStack Query yet** — plain hooks + repo functions until pain is real
- **No Drizzle** — hand-write SQL in repo layer first, adopt if it becomes a chore
- **FlatList always** for the link list — never `.map()` in a ScrollView
- **expo-image** for thumbnails (not RN's `<Image>`) — better caching, WebP support
- **@gorhom/bottom-sheet** for quick-save sheet (Phase 6a)
- **Graceful degradation on IG/FB/X** — fallback card is a feature, not a failure state
- **No `crypto.randomUUID()` on Hermes** — use `Math.random().toString(36).slice(2) + Date.now().toString(36)` until dev build is available

---

## Stack

| | |
|---|---|
| Framework | Expo SDK 56 |
| Language | TypeScript |
| Navigation | Expo Router (file-based) |
| Database | expo-sqlite |
| Device | Galaxy S24 Ultra (physical Android) |
| Builds | EAS cloud builds for dev builds |
| Dev machine | Ubuntu, 16GB RAM |
## Last session

- Date: 2026-06-19 22:19
- Branch: `main`

Recent commits:
```
c29f981 Merge pull request #12 from prasish07/feature/phase-5-search-sort
5b22c55 feat: Phase 5 — search tab, debounce hook, sort, tab bar icons
31c3901 Merge pull request #11 from prasish07/feature/phase-4-groups
bbaf169 chore: update progress.md session log
88281cd chore: auto-update progress.md on session stop via Claude Code hook
```
