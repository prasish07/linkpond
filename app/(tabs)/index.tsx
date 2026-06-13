import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { Link } from "@/features/links/types";
import { getAllLinks } from "@/features/links/data/links.repo";
import { Colors, Spacing } from "@/theme/theme";
import { LinkCard } from "@/features/links/components/LinkCard";

const HomeScreen = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await getAllLinks();
        setLinks(data);
      } catch (error) {
        console.error("Failed to load links:", error);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator color={Colors.gold} size="large" />
      </View>
    );
  }

  if (links.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>No links saved yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={links}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
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
        )}
      />
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
});

export default HomeScreen;
