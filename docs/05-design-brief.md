# Design Brief — Linkpond

> Hand this to Claude Design as the starting prompt. It defines what to design, the constraints, and the screens. Design **mobile-first for Android** (the build target is a React Native / Expo app for an Android phone — Galaxy S24 Ultra, ~1440×3120, 6.8").

---

## The prompt to paste

> Design a mobile app called **Linkpond** — a local-first app for saving, organizing, and resurfacing links people find while scrolling social media and the web. Design **mobile-first for Android**, portrait orientation. The visual direction is already defined below (see "Visual direction") — follow it. I want clean, modern, content-first screens with strong visual hierarchy. Below is everything you need: visual direction, product, principles, screens, components, and states.

---

## What the app is

People save interesting links from YouTube, X, Instagram, Facebook, and the open web. The app shows a rich preview of each link (thumbnail, title, source), lets users organize links into self-made groups and tags, search and sort them, set reminders, and (later) resurfaces old saves so they don't rot in a forgotten list. It works offline, no account required.

## Who it's for

Mobile users who save links constantly and lose track of them. The app must feel **faster and calmer** than throwing links in a notes app. Capture is one tap; finding things later is effortless.

---

## Visual direction

Warm dark theme — calm, minimal, content-first, with a single bright accent. Think "soft warm charcoal, not pure black, with one gold accent used sparingly."

**Palette**
- **Base background:** warm dark brown/olive charcoal, not pure black. Header bar slightly lighter than the body. Suggested: header `#3A372F`, body `#2E2C28` (tune as needed, but keep the warm brown-grey cast — avoid cold blue-greys and avoid `#000`).
- **Accent:** a single warm gold/yellow `#E8D44D` (approx). Used **only** for: the active bottom-nav item, the FAB, the logo, and small active-state highlights. Never for body text or large fills.
- **Semantic colors (meaning only):** muted red for anything expense/negative-equivalent — here, reserve for destructive actions; muted green for positive/confirmation. Use sparingly.
- **Text:** readable off-white/cream for primary text and titles; low-contrast warm grey for secondary text, metadata, and empty-state copy.

**Contrast rule (important):** gold-on-warm-grey fails accessibility for small text. The accent is for icons, active states, the FAB, and large/branding elements only. All body and metadata text must be off-white/cream or grey for legibility — never gold.

**Style**
- Minimal and spacious; generous negative space; content (link previews) carries the screen.
- **Bottom navigation bar** with icon + label per item; active item rendered in the gold accent, inactive in muted grey. This is how the user moves between primary areas (e.g. Links / Groups / Search / Resurface).
- **Circular FAB**, bottom-right, gold, for the primary add action.
- **Friendly empty states:** centered line-icon + plain helper text in muted grey (e.g. "No links saved yet. Tap + to save your first one."). Inviting, not barren.
- One small personality touch (e.g. a clean wordmark/logo) against an otherwise utilitarian UI — don't over-decorate.
- Light line-style icons, consistent stroke weight.

**Locked decisions** (don't re-ask these): tone = minimal warm-dark with one gold accent; primary navigation = bottom nav bar with labels; add action = circular gold FAB; personality = utilitarian with a single branded logo touch. The one choice still genuinely open is **card density** (see screens) — propose large image-forward cards vs. compact rows, or show both.

---



1. **Content-first.** The link previews (thumbnails, titles) are the heroes. Chrome stays minimal.
2. **Calm, not busy.** This is a quiet utility, not a social feed. Generous spacing, the warm dark palette above, restrained use of the single gold accent, clear typography.
3. **Capture is instant.** Saving a link is the most frequent action — it must feel effortless and never block on a network fetch.
4. **Graceful when previews fail.** Many links (Instagram/Facebook/X) won't return a thumbnail. A fallback card (favicon + domain + clean typography) must look *intentional*, never broken or empty.
5. **Android-native feel.** Material-informed patterns, bottom sheets, FAB or bottom bar, edge-to-edge, respects system dark mode.

---

## Screens to design

1. **Home / link list** — the main screen. A scrollable list of saved-link cards. Needs: search entry point, filter/sort affordance, a way to switch between groups (tabs, chips, or a drawer), and a primary "add" action. Show both rich-preview cards and fallback cards together so the contrast is clear.

2. **Link card (component)** — two variants:
   - **Rich:** thumbnail, title, source/site name, group/tag chip, saved date, reminder indicator if set.
   - **Fallback (no preview):** favicon or platform glyph, domain, user title/note, same metadata row — must look deliberate.

3. **Link detail** — full view of one link: large preview, title, description, note, group, tags, saved date, reminder controls, and an "open original" action.

4. **Quick-save popup (the key one)** — a **bottom sheet / floating card** that appears when a user shares a link into the app from another app. It overlays the previous screen (dimmed behind). Contains: the fetched preview (or fallback + loading state), a note field, group picker, tag input, optional reminder, and Save/Cancel. Must feel light and fast — this is a popup over another app, not a full screen. Design the loading state (preview still fetching) and the fallback state (preview failed).

5. **Add link (manual)** — same form as the quick-save sheet, reached from the in-app add button. Can reuse the popup's layout.

6. **Groups** — list/manage user-created groups; create a group (name + color + icon picker).

7. **Search & results** — search field with live results; show how sort/filter controls present (chips, sheet, or menu).

8. **Empty states** — first-launch empty home, empty group, empty search. These set the tone; make them inviting, not barren.

---

## Key components

- Link card (rich + fallback variants)
- Bottom sheet / quick-save popup
- Group chip / tag chip
- Search bar
- Sort/filter control
- Group + color + icon picker
- Reminder picker (date/time)
- Empty-state illustration/treatment
- Primary add action (FAB or bottom-bar button)
- Loading skeleton for cards with previews still fetching

## States to cover

- Preview loading (skeleton)
- Preview success (rich card)
- Preview failed (fallback card)
- Reminder set (indicator) vs none
- Warm dark theme is the **primary** design (per Visual direction). A light variant is secondary — design dark first and well; light can follow.

---

## Constraints

- **Android phone, portrait, mobile-first.** Not a desktop or web layout.
- Will be built in React Native / Expo, so designs should map to standard mobile primitives (lists, bottom sheets, tab/stack navigation) — avoid effects that are impractical in RN.
- The warm dark theme is the primary target. A light variant should follow the same structure but is secondary — prioritize getting the dark theme right.
- Keep the component set small and reusable — this is a solo-built learning project, not a 50-screen product.

---

## Remaining open question

Only one direction choice is left open (the rest are locked in Visual direction):

1. **Card density** — large image-forward cards (preview thumbnail dominant, fewer per screen) or compact rows (smaller thumbnail, more links visible at once)? If unsure, propose both as variants of the link-card component so I can compare.

---

## Out of scope for now

No onboarding flow, no settings screens, no account/login (the app is local-first, no auth), no cloud-sync UI. Focus on the capture → organize → find loop and the quick-save popup. The resurfacing feature (v2) can be a single concept screen if you have ideas, but it's not required.
