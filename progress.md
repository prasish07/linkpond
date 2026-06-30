# Linkpond — Build Progress

> Living doc. Update this every session. Future Claude sessions read this first to know where we are.

---

## Current phase: Phase 9 ✅ done → Phase 10 (v2) next

**Phase 9 (Polish) shipped:** skeletons, branded app icon + splash, ripple press
feedback, toasts, empty states, card redesign + reminder badges, detail/edit
screens, group detail + edit/delete, recent searches + "Has reminder" filter,
`opened_at` tracking.

**Next big feature — Phase 10:** spaced resurfacing engine (the Resurface tab is
currently a visual preview fed by oldest-unopened links). A few small polish
follow-ups remain (see Pending todos).

> ⚠️ **Icon/splash need a fresh dev build to appear** — they're native config,
> not visible over Metro.

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

### Phase 6a — Share intent ✅
- Installed `expo-share-intent` v7 (SDK 56 compatible)
- Config plugin added to `app.json` — registers Linkpond as Android share target (`text/*`) via `AndroidManifest.xml` intent filter + `singleTask` launch mode
- New EAS dev build required and installed on S24 Ultra
- `app/_layout.tsx` — wrapped tree with `ShareIntentProvider`
- `src/lib/ShareIntentListener.tsx` — detects incoming share intents (`isReady && shareIntent?.text`), navigates to `/add` with `initialUrl` param; uses `shareIntent.webUrl` (extracted URL) not `shareIntent.text` (raw full payload)
- `app/add.tsx` — reads `initialUrl` via `useLocalSearchParams`, seeds `url` state, preview pipeline fires automatically via existing debounce
- `app/(tabs)/_layout.tsx` — thin route file, just renders `<ShareIntentListener />`
- Verified: YouTube → Share → Linkpond → Add sheet opens with URL + preview → save → link in list
- Verified: Chrome → Share → same flow works
- Android emulator: connect to dev server via `http://10.0.2.2:8081` (emulator can't use host LAN IP)

### Phase 6b — Return to source app after share-intent save ✅
- `plugins/withFinishActivity.js` — config plugin that writes `FinishActivityModule.kt` + `FinishActivityPackage.kt` into the Android project and patches `MainApplication.kt` using `.also { it.add(FinishActivityPackage()) }` on `PackageList(this).packages`
- `src/lib/finishActivity.ts` — JS wrapper calling `NativeModules.FinishActivity.finish()` which calls `moveTaskToBack(true)` on Android
- `useAddLink` updated to accept `onSuccess` option — fixes React Query lifecycle issue where per-call callbacks were cancelled after component unmount
- `fetchPreview.ts` — decode HTML entities on `og:image` URL (fixes missing thumbnails on Facebook links)
- `group/create.tsx` — converted to `@gorhom/bottom-sheet` (matches Add sheet pattern)
- Key lesson: Expo SDK 56 uses bridgeless New Architecture (`ExpoReactHostFactory`) — `withMainApplication` string replacement must target `PackageList(this).packages` directly via `.also {}` idiom

### Add sheet polish (between Phase 5 and 6a) ✅
- Bottom sheet converted from fixed snap to dynamic snap points
- Idle state: `35%` / `90%`; URL entered: `60%` / `90%`
- Note + Group fields hidden until URL is entered (progressive disclosure)
- URL input redesigned with inline link icon in a row layout
- Live OG preview shown inline before saving

### Key fixes along the way
- `crypto.randomUUID()` not available on Hermes → `Math.random().toString(36).slice(2) + Date.now().toString(36)`
- `useFocusEffect` + `useCallback` required for data that must refresh on screen focus (vs `useEffect` which only runs on mount)
- Pre-commit hook catches: hardcoded hex values, missing error handling, unused vars, magic numbers, thin route files
- `expo-share-intent`: `shareIntent.text` = raw share payload (title + URL); `shareIntent.webUrl` = extracted URL — always use `webUrl` for navigation

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
| 6a | ✅ Done | Share intent — receive URLs from other apps via Android share sheet |
| 6b | ✅ Done | Return to source app after share-intent save — config plugin + moveTaskToBack |
| 7 | ✅ Done | Clipboard auto-detect — foreground lifecycle |
| 8 | ✅ Done | Reminders — local notifications, deep link from notification |
| 9 | ✅ Done | Polish — skeletons, icon/splash, ripple, toasts, card redesign, reminder badges |
| 10 (v2) | Next | Spaced resurfacing engine (Resurface tab is a preview today) |

---

## Key decisions made

- **Design source of truth:** prototype `Linkpond/theme.jsx` > `CLAUDE.md` > anything else
- **No UI kits** — custom components against `theme.ts` only
- **No Zustand/TanStack Query yet** — plain hooks + repo functions until pain is real (TanStack Query is in use for groups)
- **No Drizzle** — hand-write SQL in repo layer first, adopt if it becomes a chore
- **FlatList always** for the link list — never `.map()` in a ScrollView
- **expo-image** for thumbnails (not RN's `<Image>`) — better caching, WebP support
- **@gorhom/bottom-sheet** for Add sheet
- **Graceful degradation on IG/FB/X** — fallback card is a feature, not a failure state
- **No `crypto.randomUUID()` on Hermes** — use `Math.random().toString(36).slice(2) + Date.now().toString(36)` until dev build is available
- **ShareIntentListener lives in `src/lib/`** — route files stay thin, all logic in lib/features

---

## Stack

| | |
|---|---|
| Framework | Expo SDK 56 |
| Language | TypeScript |
| Navigation | Expo Router (file-based) |
| Database | expo-sqlite |
| Share intents | expo-share-intent v7 |
| Device | Galaxy S24 Ultra (physical Android) |
| Builds | EAS cloud builds for dev builds |
| Dev machine | Mac (also has Android emulator available) |

## Decluttering the link list — CURRENT FOCUS (work in this order)

The flat "all links forever" list gets cluttered fast. Two sub-problems:
(a) scanning density, (b) the read-later graveyard. Agreed plan, in priority order:

1. **Archive** (`is_archived`) — ⏳ **DONE on branch `feature/archive-links` (PR open — test on device, then merge).**
   - `setLinkArchived` / `getArchivedLinks`, `useSetArchived` / `useArchivedLinks`.
   - Reusable `src/components/SwipeableRow.tsx` (ReanimatedSwipeable) — swipe a row left for **Archive + Delete** (lists) / **Restore + Delete** (archived screen). Delete uses shared `confirmDeleteLink`.
   - Archive/Unarchive action in link detail header; `app/archived.tsx` reached via archive icon in home header.
   - All list queries already filter `is_archived = 0`, so archived links drop out automatically.
   - **Next session: verify on device, then merge, then start step 2.**

2. **"Unopened" default emphasis** — `opened_at` already shipped. Lead the home list with unopened (section "Unopened" first, or a default "Unopened only" filter); dim/de-emphasize opened links so what you haven't read pops.

3. **Tags** — the `tags` + `link_tags` tables already exist but are unused. Cross-cutting organization (a link can have many tags). Add tag CRUD, tag chips on cards, and tag filtering. Biggest structural win after archive.

4. **Date sectioning + compact mode** — switch the home FlatList to a SectionList grouped by *Today / This week / This month / Earlier*; add a third "compact" density (single line, tiny favicon, no thumbnail) alongside the card/list toggle.

5. **Phase 10 — spaced resurfacing engine** — the strategic anti-clutter fix: hand back a few oldest-unopened at a time instead of a wall. Real scheduling logic behind the Resurface tab (currently an oldest-unopened stand-in). Likely needs a resurface schedule/interval per link.

## Other pending todos (lower priority)

- **"+ New group" in Add sheet** — `+` chip at the end of the group row opens the Create Group sheet stacked on top; after save the new group auto-selects.
- **Platform filter chips on Search** — design #34's "YouTube" chip; dynamic per-platform filters from saved links' domains. (Only "Has reminder" shipped.)
- **Group-add UI polish** — match prototype #31 spacing/preview (deferred).
- **Icon/splash** — branded assets shipped but need a fresh dev build to actually appear (native config).

## Schema notes (current)

- `links.opened_at INTEGER` — stamped on first "Open original"/"Open now" (migration via `PRAGMA table_info` guard in `db/client.ts`).
- `links.is_archived INTEGER` — in base schema; archive feature uses it (all active list queries filter `is_archived = 0`).
- `tags` + `link_tags` tables — exist in base schema but UNUSED yet (target for declutter step 3).
- `recent_searches(term PK, searched_at)` — backs Search "recent searches".
- Migration pattern: expo-sqlite has no auto-migrations; new **tables** use `CREATE TABLE IF NOT EXISTS`, new **columns** use a guarded `ALTER TABLE` in `runMigrations()`.

## Reusable components

- `src/components/Touchable.tsx` — Pressable + Android ripple (drop-in for TouchableOpacity).
- `src/components/Skeleton.tsx` + `LinkListSkeleton` — loading placeholders.
- `src/components/Toast.tsx` — `ToastProvider` + `useToast()` (fired from create/update/delete mutations).
- `src/components/SwipeableRow.tsx` — swipe-left action tray (ReanimatedSwipeable), takes `actions[]`.
- `src/features/links/confirmDelete.ts` — shared "Delete link?" Alert (`confirmDeleteLink`).
- `src/lib/canonicalizeUrl.ts` — URL canonical key for duplicate detection.

---

## Last session

- Date: 2026-06-30
- **Open branch: `feature/archive-links` (PR open, NOT merged)** — Archive feature (declutter step 1). Tested partially; verify swipe Archive/Delete + Restore on device, then merge.
- **NEXT SESSION: start at "Decluttering the link list" above.** After merging archive, do step 2 (Unopened emphasis) → step 3 (Tags) → step 4 (sectioning/compact) → step 5 (Phase 10 resurfacing).

Recent PRs merged:
- #25 — duplicate URL detection (canonicalizeUrl)
- #24 — card redesign, reminder badges, toasts, recent searches + "Has reminder" filter
- #23 — detail/edit screens, group management, shared FAB, Resurface preview, skeletons, branded icon/splash, opened_at

Older merged:
- #22 — Phase 8 reminders with local notifications
