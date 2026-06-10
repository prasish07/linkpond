# Session Log

> One entry per session. What was built, what was learned, what's next.

---

## Session 1 — 2026-06-10

### What we did
- Audited the Claude Design prototype (`Linkpond/` folder) — it's a web-only mockup, not RN code. Useful as a pixel-accurate spec.
- Extracted final design tokens from the prototype (`Linkpond/theme.jsx`) and updated `CLAUDE.md`/`AGENTS.md` to use them as the canonical source of truth
- Created `design/` folder with all screen reference PNGs
- Created `progress.md` (progress tracker) and `wisdom/` (portable lessons)
- Created this `learning/` folder for concept notes
- Scaffolded the Expo project (SDK 56, React 19, RN 0.85.3) using `blank-typescript` template
- Fixed project name (`_tmp` → `linkpond`) in `package.json` and `app.json`
- Set `userInterfaceStyle: "dark"` in `app.json`
- Verified app loads on S24 Ultra via Expo Go
- Installed Expo Router and all required packages
- Set `"main": "expo-router/entry"` in `package.json`
- Added `expo-router` plugin, `typedRoutes` experiment, and `"scheme": "linkpond"` to `app.json`
- Set up GitHub repo (`prasish07/linkpond`), learned the branch → commit → PR workflow

### Key concepts learned
- Expo Router file-based routing (same mental model as Next.js App Router)
- `_layout.tsx` defines navigator type (Stack / Tabs), not screen content
- Route groups `(name)/` for logical grouping without URL impact
- `"scheme"` in `app.json` is required for deep linking with Expo Router
- Expo Go works for JS-only phases (0–5); dev build required once native modules are added (Phase 6+)
- `create-expo-app` won't scaffold into a non-empty directory — workaround: scaffold into `_tmp`, move up

### What's next (Phase 0 — remaining)
- [ ] Add `"scheme": "linkpond"` to `app.json` ← do this now
- [ ] Create `app/_layout.tsx` with `<Tabs>` navigator
- [ ] Create `app/index.tsx`, `app/groups.tsx`, `app/search.tsx` placeholder screens
- [ ] Set up folder structure (`src/features/`, `src/theme/`, etc.)
- [ ] Set up path aliases in `tsconfig.json`
- [ ] Create `src/theme/theme.ts` with all design tokens
- [ ] Load Hanken Grotesk font
- [ ] Build `LinkCard` component with hardcoded data
- [ ] Render with `FlatList`, verify on S24 Ultra
