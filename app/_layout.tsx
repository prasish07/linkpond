import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { initDB } from "@/db/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    HankenGrotesk: require("../assets/fonts/HankenGrotesk-VariableFont_wght.ttf"),
  });

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
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="link/[id]" options={{ title: "Link" }} />
        <Stack.Screen
          name="group/create"
          options={{ presentation: "modal", title: "New Group" }}
        />
        <Stack.Screen
          name="add"
          options={{ presentation: "modal", title: "Add Link" }}
        />
      </Stack>
    </QueryClientProvider>
  );
};

export default RootLayout;
