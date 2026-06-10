# Expo & React Native — Lessons Learned

## Always read versioned docs

Expo moves fast. A Stack Overflow answer from 2022 may describe a deprecated API. Always read `https://docs.expo.dev/versions/v<SDK-VERSION>/` — not the unversioned root, not random blogs. This project targets SDK 56.

---

## `create-expo-app` won't scaffold into a non-empty directory

It errors if target directory has existing files. Workaround: scaffold into a temp subfolder, then move everything up:

```bash
npx create-expo-app@latest _tmp --template blank-typescript
mv _tmp/{.,}* . 2>/dev/null; rm -rf _tmp
```

**Watch out:** the project name in `package.json` and `app.json` will be the temp folder name (`_tmp`). Fix both before going further.

---

## blank-typescript template is the right starting point

Don't use the default Expo template — it includes demo screens and navigation boilerplate you'll delete anyway. `blank-typescript` gives you a clean TypeScript slate. Add Expo Router yourself so you understand what you're adding.

---

## New Architecture is on by default in Expo SDK 50+

This means any library you add must support the New Architecture (Fabric + JSI). Before committing to a library:
1. Run `npx expo-doctor` — it flags incompatible packages
2. Check [reactnative.directory](https://reactnative.directory) for the "New Architecture" badge
3. Prefer `expo-*` packages — they're version-matched to your SDK and always NA-compatible

---

## FlatList, not .map() inside ScrollView

`FlatList` virtualises the list — only renders items in the viewport. `.map()` inside `ScrollView` renders everything at once. For a link library that could grow to hundreds of items, this is a real performance difference.

**Rule:** any dynamic list of unknown length gets `FlatList`. `.map()` is only acceptable for a small static set (e.g. 3 tabs, 5 nav items).

---

## Text must always be wrapped in `<Text>`

In React Native (unlike web), you cannot render a string directly inside a `<View>`. It will crash. Every string must be inside a `<Text>` component. This trips up every React web developer on first contact.

---

## Physical device > emulator for this project

On Ubuntu with 16GB RAM, Android emulator is heavy and slow. A physical Galaxy S24 Ultra + Expo Go (for JS-only phases) or a dev build (for native modules) is faster to iterate on and tests real-device behaviour.

---

## Expo Go vs dev build — know the boundary

Expo Go runs your app in a pre-built sandbox. It works for phases 0–5 (pure JS/SQLite). The moment you need a native module not bundled in Expo Go (share intents, custom Activity themes), you need a **development build** via EAS. Don't attempt Phase 6 without switching first.
