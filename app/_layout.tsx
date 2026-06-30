import { SplashScreen, Stack, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { initDB } from "@/db/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ShareIntentProvider } from "expo-share-intent";
import {
  requestNotificationPermission,
  setupNotificationChannel,
} from "@/lib/notifications";
import * as Notifications from "expo-notifications";
import { ToastProvider } from "@/components/Toast";
import { Colors } from "@/theme/theme";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    HankenGrotesk: require("../assets/fonts/HankenGrotesk-VariableFont_wght.ttf"),
  });

  const router = useRouter();

  useEffect(() => {
    const setup = async () => {
      try {
        await setupNotificationChannel();
        await requestNotificationPermission();
      } catch {
        // notification setup failed — non-critical, app works without it
      }
    };
    setup();

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const linkId = response.notification.request.content.data?.linkId;
        if (linkId) router.push(`/link/${linkId}`);
      }
    );

    return () => subscription.remove();
  }, [router]);

  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  useEffect(() => {
    initDB().catch((e) => console.error("Failed to initialize database:", e));
  }, []);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ShareIntentProvider>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="link/[id]" options={{ title: "Link" }} />
              <Stack.Screen
                name="archived"
                options={{
                  title: "Archived",
                  headerStyle: { backgroundColor: Colors.header },
                  headerTintColor: Colors.primary,
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="link/edit/[id]"
                options={{
                  presentation: "transparentModal",
                  headerShown: false,
                  animation: "fade",
                }}
              />
              <Stack.Screen
                name="group/create"
                options={{
                  presentation: "transparentModal",
                  headerShown: false,
                  animation: "fade",
                }}
              />
              <Stack.Screen
                name="add"
                options={{
                  presentation: "transparentModal",
                  headerShown: false,
                  animation: "fade",
                }}
              />
            </Stack>
          </ToastProvider>
        </QueryClientProvider>
      </ShareIntentProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
