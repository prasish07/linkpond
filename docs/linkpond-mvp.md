# Linkpond — MVP Spec & Architecture

> A React Native app to save, preview, organize, and resurface links you find while scrolling. This document scopes a realistic v1 that ships, learns from honest market/technical constraints, and degrades gracefully where social platforms block previews.

---

## 1. Reality check (read this first)

Two hard constraints shape every decision below:

1. **The market is saturated.** Raindrop.io, SaveLink, Pocket, Linkmark, Link App, and others already do "save + preview + tags + folders + reminders." Baseline parity wins nothing. Differentiation has to come from *resurfacing*, *privacy/local-first*, or *frictionless capture* — not from the feature checklist.
2. **Rich previews are blocked on the platforms you care about most.** Instagram, Facebook, and X require an authenticated session and have killed public scraping. YouTube, blogs, news, and most of the open web still expose Open Graph / Twitter Card tags. **Design for graceful degradation**, not full coverage.

**Recommended framing:** Treat v1 as a portfolio-grade learning project (share intents, OG scraping, local DB, notifications) with a genuinely useful niche, not a head-to-head competitor to funded apps.

---

## 2. Differentiation strategy

Pick at most two wedges and build the product around them. Recommended:

- **Local-first & private.** No account required, all data on-device. Direct contrast to subscription incumbents.
- **Resurfacing, not just storage.** Most bookmark apps are write-only graveyards. Build around spaced resurfacing ("you saved this 3 weeks ago — still useful?") and reminders as a first-class concept, not an afterthought.

Secondary (nice-to-have, not v1-blocking): on-device AI auto-categorization, flawless Android Share Sheet capture.

---

## 3. MVP scope

### In scope (v1)
- Save a link via **system Share Sheet** from any app (primary capture path)
- Save via **clipboard auto-detect** when app is opened
- **Preview fetch** (title, description, thumbnail, site name) with graceful fallback
- **Groups/collections** — user-created, custom name + color/icon
- **Tags** (lightweight, many-to-many) — optional but cheap to add
- **Sort/filter** by date, group, tag; **full-text search** over title/description/notes
- **Reminders** per link (local notification at a chosen time)
- **Open original link** in browser or native app
- **Local persistence** (offline-first)

### Explicitly out of scope (v1)
- Cloud sync / multi-device (huge complexity; defer)
- Accounts / auth
- Collaborative/shared folders
- Browser extension
- Authenticated scraping of IG/FB/X (don't fight this battle)

### Deliberately deferred (v2+)
- Optional cloud sync (e.g. via a backend or a sync service)
- AI auto-tagging / semantic search
- Spaced-resurfacing engine (the real differentiator — prototype after core is stable)

---

## 4. The preview problem — how to handle it honestly

| Source | Preview quality | Approach |
|---|---|---|
| YouTube | Good | oEmbed endpoint or OG tags |
| Blogs / news / open web | Good | Fetch HTML, parse OG / Twitter Card tags |
| Instagram / Facebook / X | Poor / blocked | Fall back to favicon + domain + user note |

**Strategy:**
- Attempt OG/Twitter Card extraction client-side or via a thin backend.
- On failure, **degrade gracefully**: show favicon, domain name, platform icon, and let the user type a manual title/note. Never show a broken card.
- Cache fetched previews locally so you only fetch once per URL.

**Build vs. buy for fetching:**
- *Pure client-side fetch* — free, but CORS and JS-injected tags (React/Vue sites) limit it; many tags are server-rendered so it often works.
- *Thin backend (recommended if budget allows)* — a tiny serverless function fetches and parses HTML, returns normalized JSON. Avoids CORS, centralizes parsing. Adds a server to maintain.
- *Paid API (Microlink, etc.)* — fastest path, handles JS rendering and edge cases, costs money at scale.

Start with client-side + a metadata parser; add a backend only if quality demands it.

---

## 5. Architecture

```
┌─────────────────────────────────────────────┐
│                React Native App               │
│                                               │
│  ┌─────────────┐   ┌──────────────────────┐  │
│  │ Share Intent │──▶│   Capture / Save     │  │
│  │  (Android)   │   │   flow + clipboard   │  │
│  └─────────────┘   └──────────┬───────────┘  │
│                                │              │
│                    ┌───────────▼───────────┐  │
│                    │  Preview Fetcher        │ │
│                    │  (OG parse + fallback)  │ │
│                    └───────────┬───────────┘  │
│                                │              │
│  ┌─────────────┐   ┌───────────▼───────────┐  │
│  │ Notifications│◀──│  Local DB (SQLite)     │ │
│  │ (reminders)  │   │  links/groups/tags     │ │
│  └─────────────┘   └───────────┬───────────┘  │
│                                │              │
│              ┌─────────────────▼────────────┐ │
│              │   UI: list, groups, search,    ││
│              │   detail, reminder picker      ││
│              └────────────────────────────────┘│
└─────────────────────────────────────────────┘
        │ (optional, v2)
        ▼
   Thin backend for preview fetch / future sync
```

### Suggested stack
- **Framework:** React Native (Expo recommended for speed; bare RN if you need deep share-intent control)
- **Local DB:** SQLite via `expo-sqlite`, or `op-sqlite` / WatermelonDB for larger datasets
- **Share intent:** `expo-share-intent` (Expo) or `react-native-receive-sharing-intent` (bare)
- **Clipboard:** `expo-clipboard`
- **Notifications:** `expo-notifications` (local scheduled notifications for reminders)
- **HTML/OG parsing:** fetch + a metadata parser (e.g. an OG-tag parser library), or a backend endpoint
- **Navigation:** `expo-router` or React Navigation
- **State:** Zustand or React Query (React Query pairs well with cached preview fetches)

---

## 6. Data model (SQLite)

```sql
-- A saved link
CREATE TABLE links (
  id            TEXT PRIMARY KEY,        -- uuid
  url           TEXT NOT NULL,
  title         TEXT,                    -- from OG or user-edited
  description   TEXT,
  thumbnail_url TEXT,
  site_name     TEXT,
  favicon_url   TEXT,
  note          TEXT,                    -- user's own note
  group_id      TEXT,                    -- nullable; FK -> groups.id
  is_archived   INTEGER DEFAULT 0,
  created_at    INTEGER NOT NULL,        -- epoch ms
  updated_at    INTEGER NOT NULL,
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE SET NULL
);

-- User-created groups/collections
CREATE TABLE groups (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  color      TEXT,
  icon       TEXT,
  created_at INTEGER NOT NULL
);

-- Tags (many-to-many)
CREATE TABLE tags (
  id   TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE link_tags (
  link_id TEXT NOT NULL,
  tag_id  TEXT NOT NULL,
  PRIMARY KEY (link_id, tag_id),
  FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id)  REFERENCES tags(id)  ON DELETE CASCADE
);

-- Reminders (one or more per link)
CREATE TABLE reminders (
  id              TEXT PRIMARY KEY,
  link_id         TEXT NOT NULL,
  remind_at       INTEGER NOT NULL,      -- epoch ms
  notification_id TEXT,                  -- OS notification handle
  is_done         INTEGER DEFAULT 0,
  FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE CASCADE
);

CREATE INDEX idx_links_group   ON links(group_id);
CREATE INDEX idx_links_created ON links(created_at);
CREATE INDEX idx_reminders_at  ON reminders(remind_at);
```

For full-text search, add an FTS5 virtual table over `title`, `description`, and `note`, or filter in-memory if the dataset is small.

---

## 7. Core flows

### Capture (Share Sheet)
1. User taps Share in YouTube/X/etc. → selects your app.
2. App receives URL via share intent.
3. Insert a provisional `links` row immediately (so save feels instant).
4. Kick off preview fetch in background; update the row when it resolves.
5. Optional quick-assign sheet: pick group, add tag/note, set reminder.

### Capture (clipboard)
1. On app foreground, check clipboard for a URL.
2. If found and not already saved, show a non-intrusive "Save this link?" banner.

### Preview fetch
1. Normalize URL (strip tracking params, resolve redirects if possible).
2. Try OG/Twitter Card parse → map to title/description/thumbnail/site_name.
3. On failure, fall back to favicon + domain + empty title for user to fill.
4. Cache result; never block the UI on the network.

### Reminder
1. User sets `remind_at` on a link.
2. Schedule a local notification; store its handle in `reminders.notification_id`.
3. On tap, deep-link into the link's detail screen.

---

## 8. Suggested build order

1. **Skeleton + DB** — RN project, SQLite schema, basic list screen with mock data.
2. **Manual add** — add-link form, persist to DB, render real list.
3. **Preview fetch** — OG parsing with graceful fallback + local caching.
4. **Groups & tags** — create/assign/filter.
5. **Search & sort** — by date/group/tag + text search.
6. **Share intent** — receive shared URLs from other apps (the make-or-break UX).
7. **Clipboard auto-detect.**
8. **Reminders** — scheduling + notifications + deep link.
9. **Polish** — empty states, dark mode, broken-preview handling, settings.
10. **(v2)** Resurfacing engine, optional sync, AI tagging.

---

## 9. Feature ideas beyond v1

- **Spaced resurfacing** — periodically surface old saves so the app isn't a graveyard. *(Your strongest original idea — lean into it.)*
- **On-device AI auto-categorization** — suggest a group/tags on save.
- **"Read/watched" toggle** — separate the backlog from the archive.
- **Bulk actions** — multi-select move/delete/tag.
- **Export/import** — HTML (the universal bookmark format) so users aren't locked in; also a trust signal.
- **Widgets** — home-screen widget for most-recent or due-reminder links.
- **Duplicate detection** — warn when saving an already-saved URL.
- **Highlights/notes** — let users annotate why they saved something.

---

## 10. Risks & honest caveats

- **Preview inconsistency on IG/FB/X is unavoidable** without authenticated access. Set user expectations in-app; don't over-promise rich previews.
- **iOS share extensions are more restrictive** than Android intents — budget extra time if targeting iOS.
- **Competing on features alone is a losing fight.** The resurfacing + local-first angle is the only thing that makes this more than a clone.
- **Scope creep is the #1 killer.** Ship sections 1–9 before touching v2.
