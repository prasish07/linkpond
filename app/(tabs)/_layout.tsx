import { Colors } from "@/theme/theme";
import { Tabs } from "expo-router";

const TabsLayout = () => {
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

export default TabsLayout;
