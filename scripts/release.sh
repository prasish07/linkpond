#!/usr/bin/env bash
#
# Cut a Linkpond release: build the Android APK locally and publish a GitHub Release.
#
# ── Checklist (what "cutting a release" means) ────────────────────────────────
#   1. Bump `expo.version` in app.json via a normal PR, and merge it to main.
#      (app.json is the single source of truth for the version.)
#   2. Make sure JDK 17 is installed once:  brew install openjdk@17   (see docs/07)
#   3. On an up-to-date, clean `main`, run:  npm run release
#
# This script then:
#   • regenerates android/ with the correct Gradle (9.3.1)
#   • builds a release APK on JDK 17 (debug-signed → directly installable)
#   • creates git tag vX.Y.Z and a GitHub Release with the APK attached
#
# First build after a clean prebuild takes ~10 min.
# ──────────────────────────────────────────────────────────────────────────────
set -euo pipefail
# Force a UTF-8 locale: the publish echoes contain multi-byte chars (…), and in a
# C/ASCII locale `set -u` glues an ellipsis byte onto "$TAG" and aborts with an
# "unbound variable" error. Harmless interactively; bites in non-interactive shells.
export LANG="${LANG:-en_US.UTF-8}" LC_ALL="${LC_ALL:-en_US.UTF-8}"
cd "$(dirname "$0")/.."

# --- locate toolchain ---
JDK17="$( { brew --prefix openjdk@17 2>/dev/null || echo /opt/homebrew/opt/openjdk@17; } )/libexec/openjdk.jdk/Contents/Home"
if [ -z "${ANDROID_HOME:-}" ]; then
  if   [ -d "$HOME/Library/Android/sdk" ]; then export ANDROID_HOME="$HOME/Library/Android/sdk"
  elif [ -d "$HOME/Android/Sdk" ];        then export ANDROID_HOME="$HOME/Android/Sdk"
  fi
fi

# --- preconditions ---
command -v gh   >/dev/null      || { echo "❌ gh CLI not found";                       exit 1; }
gh auth status  >/dev/null 2>&1 || { echo "❌ gh not authenticated (run: gh auth login)"; exit 1; }
[ -x "$JDK17/bin/java" ]        || { echo "❌ JDK 17 missing — run: brew install openjdk@17"; exit 1; }
[ -n "${ANDROID_HOME:-}" ]      || { echo "❌ ANDROID_HOME not set and no SDK found";   exit 1; }
[ -z "$(git status --porcelain)" ] || { echo "❌ Working tree not clean — commit/stash first"; exit 1; }

VERSION="$(node -p "require('./app.json').expo.version")"
TAG="v$VERSION"
BRANCH="$(git branch --show-current)"

git rev-parse "$TAG"     >/dev/null 2>&1 && { echo "❌ Tag $TAG already exists (bump app.json version first)"; exit 1; }
gh  release view "$TAG"  >/dev/null 2>&1 && { echo "❌ Release $TAG already exists"; exit 1; }

echo "▶ Releasing $TAG from '$BRANCH'"

# --- build ---
echo "▶ Regenerating android/ (Gradle 9.3.1)…"
npx expo prebuild --clean --platform android --no-install
git checkout -- package.json 2>/dev/null || true   # undo prebuild's expo-start → run script rewrite

echo "▶ Building release APK on JDK 17 (first run ~10 min)…"
JAVA_HOME="$JDK17" ./android/gradlew -p android :app:assembleRelease --no-daemon \
  -Dorg.gradle.java.installations.auto-download=false

APK="android/app/build/outputs/apk/release/app-release.apk"
[ -f "$APK" ] || { echo "❌ APK not produced at $APK"; exit 1; }
ASSET="linkpond-$TAG.apk"
cp "$APK" "$ASSET"

# --- publish ---
echo "▶ Publishing GitHub Release $TAG…"
gh release create "$TAG" --target "$BRANCH" --title "Linkpond $TAG" \
  --notes "Automated release **$TAG**. Debug-signed APK for direct install (not Play Store signed)." \
  "$ASSET#$ASSET"

rm -f "$ASSET"
echo "✅ Released: $(gh release view "$TAG" --json url --jq .url)"
