# Linkpond — Environment Setup (Ubuntu + Android)

> You're on Ubuntu with an Android phone (Galaxy S24 Ultra). This is the fastest, cheapest path — no Mac, no iOS simulator needed. You'll test on your real phone via Expo Go, then on dev builds when you add native modules.

---

## Why Expo (not bare React Native)

You're learning RN *and* shipping a project. Expo removes the worst of the native-toolchain pain (Gradle hell, manual linking) while still letting you drop to native config when needed. Use Expo with a **development build** once you add modules like share intents that aren't in Expo Go.

Two runtime modes you'll use:
- **Expo Go** — the prebuilt app from the Play Store. Fastest for early learning (steps 1–5 of the roadmap). Can't run custom native modules.
- **Development build** — your own app binary with native modules baked in. Needed once you add `expo-share-intent`, notifications config, etc. Built with EAS Build (cloud) so you don't need Android Studio's full build pipeline locally.

---

## Prerequisites

```bash
# Node — use the current LTS. Check what you have:
node -v        # want a recent LTS (v20+ minimum, v22 LTS ideal)

# If you need to manage Node versions, nvm is cleanest on Ubuntu:
# curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
# then: nvm install --lts && nvm use --lts

# Expo uses npx — no global install needed. But verify:
npx expo --version
```

You do **not** need Android Studio for the Expo Go phase. You *will* want either Android Studio (for an emulator) or just your physical phone. Given your S24 Ultra, **use the physical phone** — it's faster and real.

---

## Create the project

```bash
# From a working dir (NOT inside a read-only mount)
npx create-expo-app@latest linkpond
cd linkpond

# Run it
npx expo start
```

`npx expo start` shows a QR code. Install **Expo Go** from the Play Store on your S24, scan the QR (same Wi-Fi), and the app loads live with hot reload. Save a file → see it update instantly.

> Tip: if phone and laptop are on networks that block local discovery, run `npx expo start --tunnel` (slower but works through firewalls).

---

## Physical device setup (Android)

1. Install **Expo Go** from the Play Store.
2. Enable **Developer Options** on the S24 (tap Build Number 7×) and **USB debugging** if you want wired debugging (optional; Wi-Fi via QR is usually enough).
3. Same Wi-Fi as your laptop → scan QR from `npx expo start`.

---

## When you outgrow Expo Go (development build)

The moment you add `expo-share-intent` (roadmap step 6), Expo Go can't run it. Switch to a dev build:

```bash
# One-time: install EAS CLI and log in (free account)
npm install -g eas-cli
eas login

# Configure and build a dev client for Android (cloud build — no local Android SDK needed)
eas build --profile development --platform android
```

EAS builds in the cloud and gives you an `.apk`/`.aab` to install on your phone. From then on, `npx expo start --dev-client` connects to *your* app instead of Expo Go. This keeps you off the local Gradle/Android-SDK treadmill, which matters on a 16GB laptop.

> Local alternative (heavier): `npx expo run:android` builds locally but requires the full Android SDK + Java toolchain installed. Only go here if you specifically want to learn the native build. For your hardware, prefer EAS cloud builds.

---

## Recommended VS Code setup

- **ESLint** + **Prettier** (Expo ships configs)
- **React Native Tools** (optional)
- Your existing TS setup carries over — Expo templates are TypeScript by default.

---

## Sanity checklist before you start the roadmap

- [ ] `npx create-expo-app@latest` succeeds and `npx expo start` shows a QR
- [ ] Expo Go on the S24 loads the starter app
- [ ] Editing `app/index.tsx` hot-reloads on the phone
- [ ] You can read a syntax error on the phone and fix it

Once all four are true, go to `03-build-roadmap.md`.

---

## Hardware note

Your Acer Nitro 5 (16GB RAM, RTX 3050) is **fine** for Expo + physical-device testing. Avoid running a heavy Android emulator alongside everything else — the physical phone sidesteps that entirely. Cloud EAS builds keep your laptop free during the heavy native compilation steps.
