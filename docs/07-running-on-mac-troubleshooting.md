# Linkpond — Running on Mac + Dependency Troubleshooting

> Written after a long debugging session moving the project from Ubuntu to a MacBook (with Android Studio + Pixel emulator). This captures the hard-won lessons so future-you doesn't rediscover them the painful way.

---

## TL;DR — how to run the app now

```bash
# Fast iteration for UI / JS work (bottom sheets, cards, screens):
npx expo start --go
# then press `a` for the emulator, or scan the QR on the S24 Ultra

# For native features (share intents, Phase 6a+): install the EAS dev-build APK, then:
npx expo start --dev-client
```

The `--go` flag is the important bit — see "Expo Go vs dev build" below.

---

## The mental model that matters: Expo Go vs dev build

The rule is **not** "anything fancy needs a dev build." It's specific:

> **A native module needs a dev build only if Expo Go doesn't already bundle it.**

Expo Go ships with a fixed set of native libraries baked in. Among them:
`react-native-gesture-handler`, `react-native-reanimated`, `expo-sqlite`,
`expo-image`, `expo-font`, etc.

`@gorhom/bottom-sheet` (our "drawer"/quick-save sheet) ships **zero native code** —
it's pure JS built on top of gesture-handler + reanimated. So **the bottom sheet
runs fine in Expo Go.** A common misconception is that it needs a dev build. It does not.

What *genuinely* needs a dev build in this project:
- **Phase 6a/6b — share intents.** Receiving a shared URL from another app requires
  native Android `Activity` / intent-filter config that Expo Go cannot provide.

| Feature | Expo Go | Dev build |
|---|---|---|
| Bottom sheet / gesture / reanimated | ✅ | ✅ |
| SQLite, image, fonts, router | ✅ | ✅ |
| Share intents (Phase 6a) | ❌ | ✅ |

### `--go` overrides dev-client mode

Once `expo-dev-client` is installed, `npx expo start` *defaults* to dev-client mode
and will refuse to use Expo Go ("No development build installed"). **You don't have to
uninstall `expo-dev-client` to use Expo Go** — just pass `--go`:

```bash
npx expo start --go     # forces Expo Go even when expo-dev-client is present
```

This means you keep `expo-dev-client` installed (for the dev build) **and** still get
fast Expo Go iteration for UI work. Best of both.

---

## The Gradle/Kotlin wall: why `expo run:android` fails locally

Running `npx expo run:android` (a **local** native build) fails with:

```
ExpoAutolinkingSettingsPlugin.kt:12:28 Unresolved reference 'cc'.
import org.gradle.internal.cc.base.logger
```

- This is an **upstream bug** in `expo-modules-autolinking`'s Gradle plugin — it imports
  an internal Gradle API (`org.gradle.internal.cc.*`) that the bundled Gradle can't resolve.
- Changing the Gradle wrapper version (8.6 ↔ 8.8) does **not** fix it. Don't bother.
- It is **not** a problem with our code.

### The fix: don't build natively on the Mac — use EAS

The **EAS cloud build succeeds** because EAS uses a correctly-aligned toolchain
(matching Gradle/JDK/Android SDK). So:

```bash
eas build --profile development --platform android
```

Install the resulting APK on the emulator or S24, then `npx expo start --dev-client`.
EAS build artifacts expire (~13 days) — reinstall when you next need the dev build.

> Bottom line: **local `expo run:android` is a dead end on this Mac. Use Expo Go for JS
> work and EAS for the dev build.**

---

## The dependency conflict that broke everything

After copying the repo from Ubuntu, a clean `npm install` failed:

```
peer react-native-worklets@"0.8.x" from react-native-reanimated@4.3.1
... react-native-worklets@"^0.9.2" from the root project
```

**Root cause:** `react-native-reanimated@4.3.1` requires `react-native-worklets@0.8.x`,
but `package.json` had it pinned to `^0.9.2`. That single mismatch:
1. Broke `npm install` (forced people toward `--legacy-peer-deps`, which papers over the
   real conflict and produces a broken tree).
2. Broke the Babel transform chain — `react-native-reanimated/plugin` (in `babel.config.js`)
   is just a re-export of `react-native-worklets/plugin`, so a bad worklets version =
   Metro can't transform = bundle never builds.

**The fix:**
```jsonc
// package.json
"react-native-worklets": "0.8.x"   // match reanimated 4.3.1's peer requirement
```
Then wipe and reinstall clean:
```bash
rm -rf node_modules package-lock.json
npm install        # now resolves with NO --legacy-peer-deps
```

If `npm install` succeeds **without** `--legacy-peer-deps`, the tree is genuinely
consistent. If you *need* that flag, you're hiding a real conflict — fix the version instead.

### Reanimated 4 needs worklets as a separate package

Reanimated v4 (New Architecture only, which RN 0.85 / SDK 56 uses) split worklets into a
standalone `react-native-worklets` package. It's a **required peer**, and its version is
pinned tightly to the reanimated version. When you bump reanimated, check the matching
worklets range.

---

## Don't hand-add transitive deps

During debugging, `expo-modules-autolinking` and `babel-preset-expo` got added to
`package.json` explicitly. **Don't.** They're transitive deps of `expo`, and pinning them
to a different patch version than `expo` itself causes version-skew bugs (the autolinking
Gradle plugin from `56.0.16` against `expo@56.0.9`, for example). Let them resolve transitively.

**Rule:** only put a package in `package.json` if your own code imports it. Use
`npx expo install <pkg>` (not bare `npm install`) so the version matches your SDK.

Verify alignment anytime:
```bash
npx expo install --check    # "Dependencies are up to date" = good
```

---

## Mac-specific environment notes

- **`adb` / `emulator` aren't on PATH by default.** They live under the Android SDK:
  ```bash
  export PATH="$PATH:$HOME/Library/Android/sdk/platform-tools:$HOME/Library/Android/sdk/emulator"
  ```
  Add that to `~/.zshrc` to make it permanent.
- **Java isn't found by `expo run:android`.** Android Studio bundles a JDK; point to it:
  ```bash
  export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
  ```
  (Only relevant if you attempt local native builds — which we don't, see above.)
- **Connecting the emulator to Metro:** `adb reverse tcp:8081 tcp:8081`, then open the dev
  URL directly:
  ```bash
  adb shell am start -a android.intent.action.VIEW -d "exp://localhost:8081" host.exp.exponent
  ```
- **Phantom file changes after the Ubuntu→Mac copy** were git tracking **file mode** bits,
  not whitespace. Fix once:
  ```bash
  git config core.fileMode false
  ```
- **API level of the emulator (e.g. API 37) is irrelevant to JS/network behavior.** `fetch`
  runs on Hermes, not the native HTTP stack, so emulator API level doesn't change preview-fetch
  results. (Emulator network does route through the Mac, so a Mac VPN/firewall can affect it —
  the physical S24 on its own connection won't.)

---

## Checklist when "it won't run" on a fresh machine

1. `npx expo install --check` → fix any flagged versions with `npx expo install`.
2. `rm -rf node_modules package-lock.json && npm install` — must succeed **without**
   `--legacy-peer-deps`. If not, there's a real peer conflict to fix (usually a version pin).
3. `npx expo start --go` for UI work. Press `a` / scan QR.
4. Need native features? Use the **EAS** dev build, not local `expo run:android`.
5. Confirm `babel.config.js` plugins resolve:
   ```bash
   node -e "require.resolve('react-native-reanimated/plugin')"
   node -e "require.resolve('react-native-worklets/plugin')"
   ```
