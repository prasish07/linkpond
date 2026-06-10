import { Tabs } from "expo-router";

const RootLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Links" }} />
      <Tabs.Screen name="groups" options={{ title: "Groups" }} />
      <Tabs.Screen name="search" options={{ title: "Search" }} />
    </Tabs>
  );
};

export default RootLayout;
