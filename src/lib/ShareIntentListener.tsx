import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useShareIntent } from "expo-share-intent";

export function ShareIntentListener() {
  const { shareIntent, resetShareIntent, isReady } = useShareIntent();
  const router = useRouter();

  useEffect(() => {
    if (isReady && shareIntent?.text) {
      try {
        router.push({
          pathname: "/add",
          params: { initialUrl: shareIntent.webUrl ?? shareIntent.text },
        });
      } catch (e) {
        console.error("[ShareIntentListener] navigation failed", e);
      } finally {
        resetShareIntent();
      }
    }
  }, [shareIntent, isReady, router, resetShareIntent]);

  return null;
}
