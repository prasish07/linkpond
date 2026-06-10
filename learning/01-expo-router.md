# Expo Router — File-Based Navigation

## What it is

Expo Router is a file-based router for React Native, modelled on Next.js App Router. Every file inside `app/` becomes a route. The filename = the URL/path = the screen.

```
app/index.tsx         → "/"  (home)
app/groups.tsx        → "/groups"
app/link/[id].tsx     → "/link/123"  (dynamic segment)
```

This is exactly how Next.js App Router works — same mental model, different runtime.

---

## `_layout.tsx` — the navigator shell

Every folder can have a `_layout.tsx`. It defines **how the routes inside are navigated**, not what they show.

| Navigator | Use case |
|---|---|
| `<Stack>` | Push/pop screens (drill down and back) |
| `<Tabs>` | Bottom tab bar (parallel top-level sections) |
| `<Drawer>` | Side drawer navigation |

The root `app/_layout.tsx` is the entry point. For Linkpond it renders `<Tabs>` (Links / Groups / Search). Each `<Tabs.Screen>` maps to a file.

**Key insight:** navigators define structure and transitions. Screen UI lives in the individual route files. `_layout.tsx` is never visible itself.

---

## Route groups — `(name)/`

Wrap files in a `(name)/` folder to group them logically without adding to the URL path. Common pattern: put all tab screens in `(tabs)/` and nest a stack inside for drill-down.

```
app/
  _layout.tsx             ← root Stack
  (tabs)/
    _layout.tsx           ← Tabs navigator
    index.tsx             ← Links tab
    groups.tsx            ← Groups tab
    search.tsx            ← Search tab
  link/[id].tsx           ← detail screen (pushed over tabs)
```

The `(tabs)` folder name doesn't appear in the URL — it's purely organisational.

---

## Navigation in code

```ts
import { useRouter, useLocalSearchParams } from 'expo-router'

// Navigate
const router = useRouter()
router.push('/link/123')
router.back()

// Read params (in app/link/[id].tsx)
const { id } = useLocalSearchParams<{ id: string }>()
```

Same pattern as Next.js `useRouter` and `useParams` — just typed differently.

---

## Typed routes

With `"typedRoutes": true` in `app.json`, Expo Router generates types for all your routes. `router.push('/lnk/123')` becomes a compile error if the route doesn't exist. Always turn this on.

---

## What I did (session 1)

- Installed Expo Router and all required packages (`expo-router`, `expo-linking`, `expo-constants`, `react-native-safe-area-context`, `react-native-screens`)
- Updated `package.json` entry point to `"expo-router/entry"`
- Added `expo-router` plugin and `typedRoutes` experiment to `app.json`
- Added `"scheme": "linkpond"` to `app.json` for deep linking

## Still to do

- Create `app/_layout.tsx` with `<Tabs>` navigator (Links / Groups / Search)
- Create `app/index.tsx`, `app/groups.tsx`, `app/search.tsx` as placeholder screens
