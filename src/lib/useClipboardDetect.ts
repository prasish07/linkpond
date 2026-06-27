import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import * as Clipboard from "expo-clipboard";
import { getLinkByUrl } from "@/features/links/data/links.repo";

const URL_REGEX = /^https?:\/\/.+/i;

export function useClipboardDetect() {
  const [clipboardUrl, setClipboardUrl] = useState<string | null>(null);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const checkClipboard = async () => {
      try {
        const text = await Clipboard.getStringAsync();
        const trimmed = text.trim();
        if (!URL_REGEX.test(trimmed)) return;
        const existing = await getLinkByUrl(trimmed);
        if (existing) return;
        setClipboardUrl(trimmed);
      } catch {
        // clipboard unavailable or DB error — silently skip
      }
    };

    checkClipboard();

    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") checkClipboard();
      if (nextState === "background") setClipboardUrl(null);
      appState.current = nextState;
    });

    return () => subscription.remove();
  }, []);

  const dismiss = () => setClipboardUrl(null);

  return { clipboardUrl, dismiss };
}
