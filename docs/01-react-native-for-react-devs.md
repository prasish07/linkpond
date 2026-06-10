# React Native for React/Next Devs

> You already know React, hooks, components, JSX, state, props, context. This doc covers **only what's different** in React Native. Skim it once, refer back as needed. Don't let Claude Code explain `useState` to you — you know that.

---

## The mental model

RN is React rendering to **native views**, not the DOM. Same component model, hooks, props, reconciliation. What changes is everything below the component layer: there's no DOM, no HTML elements, no CSS files, no browser.

| Web (you know this) | React Native |
|---|---|
| `<div>` | `<View>` |
| `<span>`, `<p>`, `<h1>` | `<Text>` (all text MUST be inside `<Text>`) |
| `<img>` | `<Image>` |
| `<button>` | `<Pressable>` / `<TouchableOpacity>` |
| `<input>` | `<TextInput>` |
| `<a href>` | `Linking.openURL()` or router navigation |
| scrollable page | `<ScrollView>` or `<FlatList>` |
| CSS file / className | `StyleSheet.create()` + `style` prop |
| `onClick` | `onPress` |
| `window` / `document` | none — they don't exist |
| `localStorage` | AsyncStorage / SQLite / SecureStore |
| `fetch` | `fetch` (works the same) |

---

## Things that will trip you up coming from web

1. **All text must be wrapped in `<Text>`.** You can't put a raw string inside a `<View>`. This is the #1 beginner error. `<View>Hello</View>` crashes; `<View><Text>Hello</Text></View>` works.

2. **No cascading styles.** There's no CSS inheritance (except text styles partially cascade within nested `<Text>`). Every component is styled explicitly. No global stylesheet, no `:hover`, no media queries (you use `Dimensions` / `useWindowDimensions` instead).

3. **Flexbox is the only layout — and the default `flexDirection` is `column`, not `row`.** This is the opposite of web. Everything is flex by default; you don't write `display: flex`.

4. **Styling is JS objects, not strings.** `padding: 10` not `padding: "10px"`. No units — numbers are density-independent pixels. camelCase keys (`backgroundColor`, not `background-color`).

5. **No `className`.** Use the `style` prop with `StyleSheet.create({...})` objects. (NativeWind exists if you want Tailwind-like syntax — optional, decide later.)

6. **Lists: use `FlatList`, not `.map()` for long lists.** `.map()` inside a `ScrollView` renders everything at once and tanks performance. `FlatList` virtualizes. For your link list, this matters.

7. **Platform differences are real.** iOS and Android behave differently for things like shadows, status bars, safe areas, back buttons. `Platform.OS` and `Platform.select()` handle the branches. You'll mostly target Android first (you're on Android anyway).

8. **Safe areas.** Notches and system bars mean you wrap screens in `SafeAreaView` / use `react-native-safe-area-context` so content isn't under the camera cutout or home indicator.

---

## Styling cheat sheet

```jsx
import { StyleSheet, View, Text } from 'react-native';

export default function Card() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Saved link</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    // shadow differs by platform:
    elevation: 2,                 // Android
    shadowColor: '#000',          // iOS
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: { fontSize: 16, fontWeight: '600' },
});
```

- Combine styles with arrays: `style={[styles.card, isActive && styles.active]}`
- Inline is fine for one-offs but `StyleSheet.create` is the norm.

---

## Navigation (Expo Router)

If you know Next's file-based routing, **you already understand Expo Router** — it's the same idea for mobile. Files in `app/` become routes. `app/index.tsx` is home, `app/link/[id].tsx` is a dynamic route, `app/_layout.tsx` defines the navigator (stack/tabs) like a Next layout.

```
app/
  _layout.tsx        // root navigator
  index.tsx          // link list (home)
  link/[id].tsx      // link detail
  groups/index.tsx   // groups list
  add.tsx            // add-link modal
```

Navigate with `useRouter().push('/link/123')` or `<Link href="/link/123">`. Read params with `useLocalSearchParams()`. (Note: as of SDK 56, Expo Router is standalone — don't import from `@react-navigation/*` directly.)

---

## Async storage & data

- **Small key-value** (settings, flags): `AsyncStorage` or `expo-secure-store` (for sensitive data).
- **Structured/relational data** (your links, groups, tags): **SQLite via `expo-sqlite`** — this is what your project uses. It's a real SQL database on the device.
- There is no `localStorage`. Don't reach for it.

---

## What stays exactly the same

- Components, props, children
- All hooks (`useState`, `useEffect`, `useMemo`, `useCallback`, `useContext`, `useRef`, custom hooks)
- Context API
- Conditional rendering, lists with `key`
- `fetch` and async/await
- TypeScript
- npm / package management
- Data-fetching libraries (React Query works in RN and is great here)
- State libraries (Zustand works in RN)

You're not relearning React. You're learning a new render target and a handful of native APIs.

---

## The one habit to build

When you hit something unfamiliar, ask: *"Is this a React problem or a native problem?"* React problems you already know. Native problems (permissions, share intents, notifications, file system, native modules) are the actual learning curve — and the part worth your attention.
