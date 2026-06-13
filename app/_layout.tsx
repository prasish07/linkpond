import { SplashScreen, Tabs } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { Colors } from "../src/theme/theme";
import { initDB } from "../src/db/client";

SplashScreen.preventAutoHideAsync();

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
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: Colors.header },
        headerTintColor: Colors.primary,
        tabBarStyle: {
          backgroundColor: Colors.header,
          borderTopColor: Colors.header,
        },
        tabBarActiveTintColor: Colors.gold,
        tabBarInactiveTintColor: Colors.secondary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Links", tabBarIcon: () => null }}
      />
      <Tabs.Screen
        name="groups"
        options={{ title: "Groups", tabBarIcon: () => null }}
      />
      <Tabs.Screen
        name="search"
        options={{ title: "Search", tabBarIcon: () => null }}
      />
    </Tabs>
  );
};

export default RootLayout;
