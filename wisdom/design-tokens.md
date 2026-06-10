# Design Tokens — Lessons Learned

## The prototype wins over the spec doc

When a design brief and a rendered prototype disagree on color values, **trust the prototype**. The brief is an intent doc written before the design was fully resolved; the prototype is the final output. In this project, `CLAUDE.md` had stale hex values (`#1B1A18`) that the rendered design (`Linkpond/theme.jsx`) had already superseded (`#2E2C28`).

**Carry forward:** When handing off designs, always extract tokens from the final rendered artifact, not the brief. Update the brief to match, not the other way around.

---

## Single source of truth for tokens

All colors, spacing, font sizes, and radii live in one file (`theme.ts`). Components never hardcode hex values. This sounds obvious but is easy to violate under deadline pressure.

**Why it matters:** when the designer tweaks a shade, you change one file. If hex values are scattered across 30 components, you miss some and the app looks inconsistent.

---

## Gold-on-dark is an accessibility trap

`#E8D44D` (gold) on `#2E2C28` (dark background) fails WCAG contrast for small text. The accent color is only safe for:
- Icons
- Active states (nav items, selected chips)
- FAB
- Branding/logo

**Carry forward:** every accent color decision needs a contrast check against the background it'll appear on. Don't assume warm yellows/golds are readable at small sizes.

---

## Token naming matters

Use semantic names (`card`, `header`, `greyDim`) not raw names (`grey3`, `darkBrown2`). Semantic names survive palette tweaks; raw names become lies when the color changes.
