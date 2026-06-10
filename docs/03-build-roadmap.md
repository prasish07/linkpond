# Linkpond — Build Roadmap (Learn While Building)

> Each phase has a **learning goal** (the RN/native concept you're meant to internalize) and a **build goal** (what ships). Don't skip ahead — each phase depends on the last. Build it yourself; use Claude Code per the rules in `04-claude-code-rules.md`.

Reference the full product spec in `linkpond-mvp.md` for schema, architecture, and feature rationale.

---

## Phase 0 — Setup & first screen
**Learning goal:** RN primitives (`View`, `Text`, `StyleSheet`), Expo Router file-based routing, hot reload loop.
**Build goal:** App runs on your phone. A home screen renders a hardcoded list of fake links using `FlatList`.

- Create the project, get it on your phone (see `02-environment-setup.md`).
- Build a `LinkCard` component from a hardcoded array.
- Render the array with `FlatList` (not `.map()`).
- **Done when:** you can style a card, lay out title/description/thumbnail with flexbox, and the list scrolls.

---

## Phase 1 — Local database
**Learning goal:** `expo-sqlite`, async data access, separating a data layer from UI.
**Build goal:** Links persist in SQLite across app restarts.

- Add `expo-sqlite`. Create the `links`, `groups`, `tags`, `link_tags`, `reminders` tables (schema in the MVP spec).
- Write a small data-access module (`db/links.ts`) with `getAll`, `insert`, `getById`, `delete`. Keep SQL out of components.
- Replace the hardcoded array with a DB read on mount.
- **Done when:** you add a row (temporarily hardcoded insert), restart the app, and it's still there.

> Concept to nail: the data layer is plain async functions. Components call them; they don't know about SQL. This is the same separation you'd use in a Next app — just SQLite instead of an API.

---

## Phase 2 — Manual add + navigation
**Learning goal:** `TextInput`, controlled inputs in RN, navigating between routes, passing params.
**Build goal:** Add a link by hand; tap a card to see a detail screen.

- `app/add.tsx` — a form with `TextInput` for URL and note. Save to DB, navigate back.
- `app/link/[id].tsx` — read the `id` param, load that link, show detail.
- Wire up navigation (`useRouter`, `useLocalSearchParams`).
- **Done when:** add → it appears in the list → tap → detail screen shows it.

---

## Phase 3 — Preview fetching (the interesting part)
**Learning goal:** async side effects against the network, error/loading states, graceful degradation, caching.
**Build goal:** Pasting a URL fetches title/description/thumbnail; broken previews degrade cleanly.

- On save, fetch the URL's HTML and parse Open Graph / Twitter Card tags.
- Map to `title`, `description`, `thumbnail_url`, `site_name`, `favicon_url`.
- **Critical:** handle failure (IG/FB/X will fail or return nothing) → fall back to favicon + domain + manual title. Never render a broken card.
- Cache the result in the DB so you fetch once per URL.
- Insert the row instantly, then update it when the fetch resolves (optimistic UI).
- **Done when:** a YouTube/blog link gets a rich card; an Instagram link gets a clean fallback, not a crash or blank.

> This is your portfolio centerpiece. The degradation handling is what separates this from a tutorial clone. Take your time and make the failure path genuinely good.

---

## Phase 4 — Groups & tags
**Learning goal:** many-to-many relations in SQLite, derived/filtered lists, reusable form UI.
**Build goal:** Create groups, assign links, filter by group; add/remove tags.

- Group CRUD (name, color, icon).
- Assign a link to a group on save or from detail.
- Filter the home list by group.
- Tags via the `link_tags` join table.
- **Done when:** you can create "Recipes", file three links into it, and filter to just those.

---

## Phase 5 — Search & sort
**Learning goal:** querying/filtering data, debounced input, performance with `FlatList`.
**Build goal:** Search across title/description/note; sort by date/group/tag.

- A search bar that filters the list (debounce the input).
- Sort controls (newest, oldest, by group).
- Consider SQLite FTS5 if you want to learn full-text search; in-memory filter is fine for small datasets.
- **Done when:** typing instantly narrows the list and sorting reorders it.

---

## Phase 6a — Share Sheet capture (make-or-break UX)
**Learning goal:** native modules, development builds (Expo Go can't do this), Android share intents, app lifecycle.
**Build goal:** Share a link from YouTube/X into your app and save it.

- Add `expo-share-intent`. **Switch to a development build now** (see setup doc — EAS).
- Receive the shared URL, run the Phase 3 preview pipeline, save it.
- For now, let the share open a **normal modal screen** in your app (a sheet-styled route) with the quick-assign form (group/tag/note/reminder). Don't fight the theming yet.
- **Done when:** in the YouTube app, Share → your app → a form appears prefilled with the link + preview → save → it's in your list. Confirm the whole save pipeline works before touching theming.

> This is the second portfolio highlight. Most clones skip it because it requires leaving the comfort of Expo Go. Doing it well signals mid-level. **Get this fully working before Phase 6b** — don't debug the capture pipeline and the popup theme at the same time.

---

## Phase 6b — Popup-over-other-app (themed quick-save)
**Learning goal:** native Android Activity config, translucent/dialog themes, config plugins / prebuild, returning focus to the previous app.
**Build goal:** The share opens a **floating popup over the app you were in** (dimmed behind), not a full-screen takeover.

- The receiving share target needs a dedicated Android Activity with a **translucent/dialog theme** so it renders as a floating sheet with the previous app visible/dimmed behind it.
- This requires custom native Android config — manifest theme + an Expo **config plugin** (or prebuild). Expo Go cannot run this; it's dev-build only.
- On save, `finish()` the Activity so the user is dropped back exactly where they were.
- **Fallback if this fights you:** keep the Phase 6a sheet-styled in-app modal (transparent background, content card, dismiss-to-close). It feels modal even if it's not literally floating over the other app. Ship that and revisit 6b later.
- **Done when:** sharing a link shows your quick-save popup hovering over YouTube/X with that app dimmed behind, and saving returns you there.

> ⚠️ This is the hardest native task in the project. It's genuinely impressive on a portfolio *because* it's hard — but it's optional polish, not core function. The app is fully usable with the 6a modal. Treat 6b as a stretch goal, not a blocker for the phases after it.

---

## Phase 7 — Clipboard auto-detect
**Learning goal:** `expo-clipboard`, app-foreground lifecycle, non-intrusive UI patterns.
**Build goal:** Open the app with a URL copied → "Save this?" banner.

- On foreground, check clipboard for a URL not already saved.
- Show a dismissible banner offering one-tap save.
- **Done when:** copy a link elsewhere, open your app, get the prompt.

---

## Phase 8 — Reminders
**Learning goal:** `expo-notifications`, scheduling local notifications, permissions, deep-linking from a notification.
**Build goal:** Set a reminder on a link; get notified; tap to open it.

- Request notification permission.
- Set `remind_at`, schedule a local notification, store its handle.
- Tapping the notification deep-links to the link detail.
- **Done when:** set a reminder 2 minutes out, lock the phone, get the notification, tap it, land on the link.

---

## Phase 9 — Polish
**Learning goal:** empty states, dark mode, accessibility basics, app icon/splash.
**Build goal:** It feels like a real app, not a demo.

- Empty states for every list. Loading skeletons for preview fetches.
- Dark mode (`useColorScheme`).
- App icon, splash screen, sensible defaults.
- Export/import as HTML (universal bookmark format) — good portfolio + anti-lock-in signal.
- **Done when:** you'd be comfortable handing the APK to a friend.

---

## Phase 10 (v2, optional) — The differentiator
**Learning goal:** background tasks, scheduling logic, product thinking.
**Build goal:** Spaced resurfacing — the app proactively surfaces old saves so it's not a graveyard.

- A rule engine: surface links saved N days ago, never-opened, etc.
- A "resurface" feed or periodic gentle notification.
- **This is the feature that makes the project memorable in an interview.** Everything before it is competent; this is original.

---

## How to pace yourself

- One phase at a time. Get it working and *understood* before moving on.
- After each phase, write yourself 3 sentences: what was a React concept you already knew vs. a native concept that was new. That reflection is where the learning sticks.
- If a phase takes a week, that's normal. You're learning a platform, not copying a tutorial.
