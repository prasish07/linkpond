import { Colors, Spacing, Typography, Shadow } from "@/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { ShareIntentListener } from "@/lib/ShareIntentListener";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FAB_SIZE = 56;
const TAB_BAR_BASE = 49;

const TabsLayout = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
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
        <Tabs.Screen
          name="resurface"
          options={{
            title: "Resurface",
            tabBarIcon: ({ color }) => (
              <Ionicons name="sparkles-outline" size={22} color={color} />
            ),
            headerShown: false,
          }}
        />
      </Tabs>

      <TouchableOpacity
        style={[
          styles.fab,
          { bottom: insets.bottom + TAB_BAR_BASE + Spacing.gap.medium },
        ]}
        onPress={() => router.push("/add")}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  fab: {
    position: "absolute",
    right: Spacing.padding.large,
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: Spacing.radius.xxlarge,
    backgroundColor: Colors.gold,
    justifyContent: "center",
    alignItems: "center",
    ...Shadow.fab,
  },
  fabText: {
    fontSize: Typography.fontSize.xxlarge,
    color: Colors.body,
    lineHeight: Typography.fontLineHeight.xxlarge,
  },
});

export default TabsLayout;
