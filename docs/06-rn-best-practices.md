# Linkpond — React Native Conventions & Best Practices

> Reference doc for Claude Code (and me). Folder structure, libraries, and coding rules for this project, based on current (2026) Expo/React Native practice. The goal is a clean, scalable-but-not-over-engineered codebase for a solo-built learning app. **When a "simple" and a "powerful" option exist, this project picks simple** — I'm learning, not shipping at scale.

---

## Guiding principles

1. **Feature-based, not type-based.** Group code by what it does (links, groups, reminders), not by what it is (all components in one folder, all hooks in another). This is the dominant 2026 convention and it scales without restructuring.
2. **Keep the data layer out of components.** SQL lives in a data-access module; components call typed functions. Same separation you'd use with an API layer in Next.
3. **TypeScript everywhere.** Typed DB rows, typed navigation params, typed function signatures. Catch errors at compile time.
4. **Don't add a library until the pain is real.** Every dependency is a maintenance and learning cost. Start with the platform/Expo built-ins; reach for a library only when hand-rolling is clearly worse.
5. **New Architecture is on by default** in modern Expo. When choosing any library, confirm it's New-Architecture-compatible (run `npx expo-doctor`, which checks against React Native Directory).

---

## Folder structure

A pragmatic feature-based layout for Expo Router. `app/` holds routes only (thin); real logic lives in `src/`.

```
linkpond/
  app/                          # Expo Router — ROUTES ONLY, keep thin
    _layout.tsx                 # root navigator (tabs/stack)
    index.tsx                   # home / link list
    link/[id].tsx               # link detail
    add.tsx                     # add/quick-save (modal route)
    groups/
      index.tsx                 # groups list
    search.tsx
  src/
    features/                   # feature-based modules
      links/
        components/             # LinkCard, LinkList, etc. (used only by links)
        hooks/                  # useLinks, useLinkPreview
        data/                   # links.repo.ts — SQL for links
        types.ts                # Link type, DTOs
        index.ts                # public API (barrel) — outside code imports from here
      groups/
        components/
        data/
        types.ts
        index.ts
      reminders/
        ...
    components/                 # SHARED UI used across features (Button, Chip, EmptyState)
    db/
      client.ts                 # opens the SQLite db, runs migrations
      schema.sql                # or migration files
    lib/                        # generic helpers (url normalize, date format)
    theme/
      theme.ts                  # design tokens (colors, spacing, type) — single source of truth
      fonts.ts
    hooks/                      # shared hooks not tied to one feature
  assets/                       # fonts, icons, images
  design/                       # screenshots/exports from the Linkpond design (reference)
  CLAUDE.md
  docs/                         # the other .md files
```

**The public-API rule:** outside code imports from `features/links` (its `index.ts`), never reaches into `features/links/data/links.repo.ts` directly. If you can delete a feature folder and only the things that imported its public API break, your boundaries are clean.

**Path aliases:** set up `@/*`, `@features/*`, `@theme` in `tsconfig.json` so imports aren't `../../../`. Expo supports this.

---

## Libraries

### Use these (baseline)

| Need | Library | Why |
|---|---|---|
| Navigation | **Expo Router** | Already chosen; file-based, you know the model from Next. |
| Local database | **expo-sqlite** | Already chosen; official, frictionless in Expo, works with the New Architecture. |
| Share intent | **expo-share-intent** | For Phase 6 capture. Dev-build only. |
| Clipboard | **expo-clipboard** | Phase 7. |
| Notifications | **expo-notifications** | Phase 8 reminders. |
| Fonts | **expo-font** | Load Hanken Grotesk. |
| Images | **expo-image** | Better caching/perf than RN's `<Image>` for link thumbnails. Supports WebP. |
| Gradient | **expo-linear-gradient** | The design's radial/gradient background. |
| Bottom sheet | **@gorhom/bottom-sheet** | The standard for the quick-save sheet. Most popular, feature-rich. Pair with `react-native-reanimated` + `react-native-gesture-handler` (Expo includes these). |

### Consider later (don't start with these)

| Need | Option | When |
|---|---|---|
| Global state | **Zustand** | Only when prop-drilling actually hurts. Tiny, simple. For most of this app, React state + Context is enough. Don't reach for Redux — overkill here. |
| Server-state/caching | **TanStack Query** | If preview-fetching grows complex (caching, retries, background refresh). For a handful of fetches, a plain hook is fine. Note: default `staleTime` is 0 — set it higher if you adopt it. |
| Type-safe SQL | **Drizzle ORM** | Tempting (fully typed queries, `useLiveQuery` auto-reruns on data change), but it adds a learning curve and migration tooling. For learning raw SQL first, hand-write queries in the repo layer. Adopt Drizzle only if manual SQL becomes a real chore. |
| Big lists | **FlashList** (Shopify) | If `FlatList` ever janks with hundreds of links. `FlatList` is fine to start. |

### Avoid for this project
- **Heavyweight UI kits** (gluestack, UI Kitten, Ant Design Mobile, React Native Paper) — you have a custom design. A component library would fight your theme and bloat the bundle. Build your own small set of components against `theme.ts`.
- **Redux / Redux Toolkit** — far more ceremony than a local-first solo app needs.
- A dedicated form library — your forms are tiny; controlled `TextInput` + local state is enough. (Revisit only if forms get complex.)

---

## Coding rules

### Components
- Small, single-responsibility, reusable. Break big screens into pieces.
- No business logic or SQL inside screen components — call hooks/repo functions.
- Shared UI (Button, Chip, EmptyState) lives in `src/components`; feature-only UI stays in that feature.

### Lists
- **Always `FlatList`** (or FlashList) for the link list — never `.map()` inside a `ScrollView` for dynamic/long lists. Provide a stable `keyExtractor`.
- Memoize list item components (`React.memo`) and `useCallback` the `renderItem` to avoid re-renders.

### Styling
- All colors, spacing, font sizes, radii come from `theme/theme.ts`. **Never hardcode a hex value in a component.**
- Use `StyleSheet.create`. Avoid recreating style objects inline on every render.
- Respect the contrast rule: gold accent for icons/active/FAB only, never small text.

### Data layer
- One repo module per feature in `features/<x>/data/`. Functions return typed results.
- Open the DB once (`src/db/client.ts`), run migrations on startup, reuse the connection.
- expo-sqlite supports async APIs — don't block the UI thread on queries.
- Use parameterized queries (`?` placeholders) always — never string-concatenate values into SQL.

### TypeScript
- Type every DB row and every function boundary. No `any` without a comment explaining why.
- Type Expo Router params; read them with the typed hooks.

### Performance (build the habits early)
- Hermes is on by default in Expo — good.
- `expo-image` for thumbnails (caching + WebP). Don't load full-size remote images into small cards.
- Profile with React DevTools Profiler if a screen feels slow; don't guess.

### Async & errors
- Every network call (preview fetch) wrapped in try/catch with a real fallback — the IG/FB/X failure path is a feature, not an afterthought.
- Show loading and error states explicitly. Never leave the UI in a silent broken state.

### Git hygiene
- Small, focused commits per roadmap step. Conventional-ish messages (`feat:`, `fix:`, `refactor:`).
- `.gitignore` covers `node_modules`, `.expo`, build artifacts, secrets.

---

## Validate dependencies

Before committing to any new library:
1. `npx expo-doctor` — flags unmaintained or New-Architecture-incompatible packages.
2. Check [reactnative.directory](https://reactnative.directory) for New Architecture support and maintenance status.
3. Prefer Expo SDK packages (`expo-*`) when one exists — they're version-matched to your SDK.

---

## What "good" looks like for this project

A reviewer opening the repo should see: thin route files, feature folders with clear boundaries, a typed data layer with no SQL leaking into UI, a single theme source, `FlatList` for the list, real loading/error/empty states, and no over-engineered state management. That reads as a mid-level dev who knows what to add **and what to leave out** — the second half is the harder signal to send.
