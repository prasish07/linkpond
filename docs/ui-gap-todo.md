# UI Gap TODO — current app vs. `docs/actual_screens/`

Comparison of the current RN implementation against the target screenshots in
`docs/actual_screens/`. Each item notes the file(s) involved and whether it's a
**visual fix** to an existing screen or an **unbuilt feature** (later roadmap phase).

Legend: `[fix]` = built screen diverges from design · `[feature]` = not yet built ·
`[v2]` = spaced-resurfacing / share-target, out of current phase.

---

## 1. Links list — `app/(tabs)/index.tsx`, `src/features/links/components/LinkCard.tsx`

Target: `22-51-47` (card), `22-52-48` (list)

- [ ] `[fix]` LinkCard rows are missing the **group dot + label** (e.g. "● Watch later"). Only title/source/date render.
- [ ] `[fix]` Saved time shows `toLocaleDateString()` — design wants **relative time** ("2h ago", "Yesterday", "2 days ago").
- [ ] `[fix]` Rows with a reminder are missing the **bell icon** on the right (`22-52-48`).
- [ ] `[feature]` Card variant is missing the **note line**, **reminder row** ("🔔 Tomorrow, 9:00"), and **duration badge** ("12:04") on the thumbnail.
- [ ] `[fix]` "Recent ⌄" sort control is **static / non-functional** — no `onPress`, no menu. Wire it to the sort that already exists in search, or a dropdown.
- [ ] `[fix]` Header has only the grid/list toggle; design has a **second control** (filter/sliders icon) top-right.
- [ ] `[fix]` Filter chips: design shows a **colored dot** per group; current renders the group icon tinted instead.

## 2. Empty state (list) — `app/(tabs)/index.tsx`

Target: `22-54-21`

- [ ] `[fix]` Empty state is plain text "No links saved yet." Design wants: **folder icon**, group-aware message (`"Trip 2025" is empty`), subtitle, and a gold **"+ Save a link"** CTA.

## 3. Link detail — `app/link/[id].tsx`

Target: `22-53-13`

- [x] `[fix]` Primary button reads "Open in browser" — **FIXED**: now "Open original" (`[id].tsx:123`).
- [ ] `[fix]` Note block missing the **"MY NOTE"** label and **gold left-border accent**.
- [ ] `[feature]` Missing **Group** row (right-aligned colored dot + name).
- [ ] `[feature]` Missing **Tags** row (chips: "# productivity", "# systems").
- [ ] `[fix]` Missing **Saved** row ("Saved … 2h ago").
- [ ] `[feature]` Missing **REMINDER** card ("Tomorrow, 9:00 / You'll get a nudge" + bell).
- [ ] `[fix]` Missing **duration badge** ("12:04") on the thumbnail.

## 4. Groups list — `app/(tabs)/groups.tsx`

Target: `22-53-32`

- [x] `[fix]` Missing screen **header**: title "Groups" + subtitle — **FIXED** (`groups.tsx:63–69`).
- [x] `[fix]` Group rows missing **link-count subtitle** ("5 links" / "No links yet") — **FIXED** (`groups.tsx:34,43`).
- [x] `[fix]` Group rows missing the **chevron** (›) on the right — **FIXED** (`groups.tsx:45`).
- [x] `[fix]` Missing the inline dashed **"+ New group"** button at the bottom of the list — **FIXED** (`groups.tsx:79–87`, also shown in empty state).

## 5. New group sheet — `app/group/create.tsx`

Target: `22-53-39`, `22-53-52`, toast `22-54-12`

- [ ] `[fix]` Presented as a **full screen**; design is a **bottom sheet** with a grabber handle, title "New group", and close (×).
- [ ] `[fix]` Missing the **live preview row** at top (icon swatch + typed name).
- [ ] `[fix]` Missing the **"NAME / COLOR / ICON"** section labels with icons.
- [x] `[fix]` Button label is "Create Group" — **FIXED**: now "Create group" sentence case (`create.tsx:110`).
- [ ] `[fix]` Confirm the **"Group created"** toast exists (shown in `22-54-12`) — no toast in current code.

## 6. Search — `app/(tabs)/search.tsx`

Target: `22-54-26`

- [ ] `[feature]` Sort/filter chips missing **"Has reminder"** and **"YouTube"** (only Recent/Oldest exist).
- [ ] `[feature]` Empty state missing **"RECENT SEARCHES"** with tappable recent-term chips.

## 7. Add / Save link — `app/add.tsx`

Target: `22-54-38` (empty), `22-54-50`/`22-55-08` (YouTube), `22-55-23`/`22-55-28` (Instagram), `22-55-48` (shared)

- [ ] `[fix]` Presented as a **full screen**; design is a **bottom sheet** ("Add a link" / "Save to Linkpond" + "Shared from YouTube" when shared).
- [ ] `[feature]` Missing **live preview fetch** — URL field should resolve into a preview card ("Fetching preview…" → thumbnail/title/duration). Title is currently a manual text field.
- [ ] `[feature]` Missing **"Try: YouTube link / Instagram link"** suggestion chips on the empty paste state.
- [ ] `[feature]` Missing **TAGS** input (add/remove tag chips).
- [ ] `[feature]` Missing **"Remind me"** toggle row.
- [ ] `[fix]` Missing **Cancel** button; design has Cancel + Save side by side.
- [x] `[fix]` Button label "Save Link" → **FIXED**: now "Save link" sentence case (`add.tsx:144`).

## 8. Bottom navigation — `app/(tabs)/_layout.tsx`

Target: all screens (4-tab bar)

- [ ] `[v2]` Missing the **Resurface** tab (`22-54-38`): "SOON" badge, featured card, "Coming up next" list. Whole route doesn't exist — this is the spaced-resurfacing v2 feature.

---

## Suggested order (smallest → biggest)

1. ~~Copy fixes: "Open original", "Save link", "Create group"~~ ✅ Done
2. ~~Groups screen header + counts + chevron + inline "+ New group" button~~ ✅ Done
3. LinkCard: group dot/label, relative time, reminder bell `[fix]`
4. List empty state with icon + CTA `[fix]`
5. Link-detail note "MY NOTE" label + gold border; Saved row `[fix]`
6. Convert Add + New-group screens to bottom sheets `[fix]`
7. Link-detail Group/Tags/Saved/Reminder sections `[feature]`
8. Add-link preview fetch + tags + remind toggle `[feature]`
9. Search: extra filter chips + recent searches `[feature]`
10. Resurface tab `[v2]`
