# Project Structure — Lessons Learned

## Feature-based > type-based folder structure

**Don't do this (type-based):**
```
components/
hooks/
utils/
types/
```

**Do this (feature-based):**
```
src/features/links/
src/features/groups/
src/features/reminders/
src/components/   ← shared only
```

**Why:** type-based structures force you to jump between 4 folders to understand one feature. Feature folders keep everything a feature needs in one place. When you delete a feature, you delete one folder. This is the dominant 2026 convention and scales without restructuring.

---

## Routes are thin; logic lives in src/

Expo Router's `app/` directory is for route files only — no business logic, no SQL, minimal state. Think of them like Next.js page components: they import from features and compose the screen.

```
app/index.tsx          ← calls useLinks(), renders <LinkList />
src/features/links/    ← useLinks hook, LinkCard component, links.repo.ts
```

---

## The public-API rule (barrel exports)

Each feature exposes a public API via `index.ts`. Outside code imports from the barrel, never reaches into internals:

```ts
// Good
import { useLinks, LinkCard } from '@features/links'

// Bad — reaching into internals
import { getLinks } from '@features/links/data/links.repo'
```

If you can delete a feature folder and only the things that imported its barrel break, your boundaries are clean.

---

## Path aliases from day one

Set up `@/*`, `@features/*`, `@theme` in `tsconfig.json` before writing any imports. Retrofitting aliases across 30 files is painful. Expo supports this natively.

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@features/*": ["./src/features/*"],
      "@theme": ["./src/theme/theme.ts"]
    }
  }
}
```

---

## SQL never leaks into components

The data layer (`features/<x>/data/<x>.repo.ts`) is plain async functions that return typed objects. Components call those functions; they don't know SQL exists. This is the same separation as an API layer in Next.js — just SQLite instead of fetch.

**Red flag:** if you see a SQL string in a component file, something is wrong.
