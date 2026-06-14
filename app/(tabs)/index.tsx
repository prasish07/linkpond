import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCallback } from "react";
import { Link } from "@/features/links/types";
import { Colors, Spacing, Typography } from "@/theme/theme";
import { LinkCard } from "@/features/links/components/LinkCard";
import { useFocusEffect, useRouter } from "expo-router";
import { useLinks } from "@/features/links/hooks/useLinksHooks";

const FAB_SIZE = 56;

const HomeScreen = () => {
  const router = useRouter();
  const { data: links = [], isLoading, refetch } = useLinks();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const renderLink = useCallback(
    ({ item }: { item: Link }) => (
      <TouchableOpacity onPress={() => router.push(`/link/${item.id}`)}>
        <LinkCard
          item={{
            id: item.id,
            title: item.title ?? "Untitled",
            source: item.site_name ?? item.url,
            domain: item.url,
            savedAt: new Date(item.created_at * 1000).toLocaleDateString(),
            preview: item.thumbnail_url ? "rich" : "fallback",
            thumb: item.thumbnail_url ?? undefined,
            note: item.note ?? undefined,
          }}
        />
      </TouchableOpacity>
    ),
    [router]
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator
          color={Colors.gold}
          size="large"
          style={{ flex: 1 }}
        />
      ) : links.length === 0 ? (
        <Text style={styles.empty}>No links saved yet.</Text>
      ) : (
        <FlatList
          data={links}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={renderLink}
        />
      )}
      <TouchableOpacity style={styles.fab} onPress={() => router.push("/add")}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.body,
  },
  list: {
    padding: Spacing.padding.large,
    gap: Spacing.gap.medium,
  },
  empty: {
    textAlign: "center",
    color: Colors.secondary,
    marginTop: Spacing.padding.large,
  },
  fab: {
    position: "absolute",
    bottom: Spacing.padding.xlarge,
    right: Spacing.padding.xlarge,
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: Spacing.radius.xxlarge,
    backgroundColor: Colors.gold,
    justifyContent: "center",
    alignItems: "center",
  },
  fabText: {
    fontSize: Typography.fontSize.xxlarge,
    color: Colors.body,
    lineHeight: Typography.fontLineHeight.xxlarge,
  },
});

export default HomeScreen;
