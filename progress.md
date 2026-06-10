# Linkpond — Build Progress

> Living doc. Update this every session. Future Claude sessions read this first to know where we are.

---

## Current phase: Phase 0 — Setup & first screen

**Learning goal:** RN primitives (`View`, `Text`, `StyleSheet`), Expo Router file-based routing, hot reload loop.
**Build goal:** App runs on S24 Ultra. Home screen renders hardcoded link cards with `FlatList`.

---

## What's been done

### Session 1 — Project setup & design audit
- Read and locked all reference docs: `CLAUDE.md`, `docs/03-build-roadmap.md`, `docs/linkpond-mvp.md`, `docs/05-design-brief.md`, `docs/06-rn-best-practices.md`
- Audited the Claude Design prototype (`Linkpond/` folder) — it is a **web-only mockup**, not an RN project. Treat it as a pixel-accurate spec only.
- Extracted final design tokens from prototype `Linkpond/theme.jsx` — these are canonical
- Updated `CLAUDE.md` design tokens to match prototype (previous values `#1B1A18` etc. were wrong)
- Created `design/` folder at project root; copied all screen PNGs from `docs/screens/` into it
- Scaffolded Expo project (SDK 56, React 19, RN 0.85.3) using `blank-typescript` template into the project root via temp-folder workaround

### Known issues to fix before writing any UI
- [ ] Project name is `_tmp` in both `package.json` and `app.json` — rename to `linkpond` / `Linkpond`
- [ ] `app.json` has `userInterfaceStyle: "light"` — change to `"dark"`
- [ ] No Expo Router installed yet
- [ ] Folder structure from `06-rn-best-practices.md` not set up yet (`src/features/`, `src/theme/`, etc.)
- [ ] `theme.ts` not created yet
- [ ] Hanken Grotesk font not loaded yet

---

## Phase 0 — remaining steps

1. **Fix project name** — update `package.json` (`name`) and `app.json` (`name`, `slug`) to `linkpond`
2. **Set dark mode** — `app.json` → `userInterfaceStyle: "dark"`
3. **Install Expo Router** — follow [Expo Router installation for SDK 56](https://docs.expo.dev/router/installation/)
4. **Scaffold folder structure** — create `src/features/links/`, `src/components/`, `src/theme/`, `src/db/`, `src/lib/` per `06-rn-best-practices.md`
5. **Set up path aliases** — `@/*`, `@features/*`, `@theme` in `tsconfig.json`
6. **Create `src/theme/theme.ts`** — all design tokens, no hex values in components ever
7. **Load Hanken Grotesk** — `expo-font`, weights 400/500/600/700
8. **Build `LinkCard` component** — hardcoded data, rich + fallback variants, correct styling
9. **Render with `FlatList`** in `app/index.tsx` — no `.map()`
10. **Test on S24 Ultra** — cards scroll, fonts load, colors match design screenshots

**Phase 0 done when:** hardcoded cards scroll on the real device, styled correctly.

---

## Phases ahead (summary)

| Phase | Goal |
|---|---|
| 1 | SQLite schema + data layer, links persist across restarts |
| 2 | Manual add form + navigation (TextInput, useRouter, detail screen) |
| 3 | Preview fetch — OG parsing, graceful fallback for IG/FB/X |
| 4 | Groups & tags — many-to-many, filter by group |
| 5 | Search & sort — debounced input, SQLite FTS5 or in-memory |
| 6a | Share intent — receive URLs from other apps, dev build required |
| 6b | Popup-over-app theming — translucent Activity, native config plugin |
| 7 | Clipboard auto-detect — foreground lifecycle |
| 8 | Reminders — local notifications, deep link from notification |
| 9 | Polish — empty states, skeletons, app icon, splash |
| 10 (v2) | Spaced resurfacing engine |

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
