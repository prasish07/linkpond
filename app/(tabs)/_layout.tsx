import { Colors } from "@/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { ShareIntentListener } from "@/lib/ShareIntentListener";

const TabsLayout = () => {
  return (
    <>
      <ShareIntentListener />
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: Colors.header },
          headerTintColor: Colors.primary,
          tabBarStyle: {
            backgroundColor: Colors.header,
            borderTopColor: Colors.body,
          },
          tabBarActiveTintColor: Colors.gold,
          tabBarInactiveTintColor: Colors.secondary,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Links",
            tabBarIcon: ({ color }) => (
              <Ionicons name="bookmark-outline" size={22} color={color} />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="groups"
          options={{
            title: "Groups",
            tabBarIcon: ({ color }) => (
              <Ionicons name="folder-outline" size={22} color={color} />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            tabBarIcon: ({ color }) => (
              <Ionicons name="search-outline" size={22} color={color} />
            ),
            headerShown: false,
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
