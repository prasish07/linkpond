import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCallback, useState } from "react";
import { Link } from "@/features/links/types";
import { Colors, Spacing, Typography } from "@/theme/theme";
import { LinkCard } from "@/features/links/components/LinkCard";
import { useFocusEffect, useRouter } from "expo-router";
import { useLinks } from "@/features/links/hooks/useLinksHooks";
import { useGroups } from "@/features/groups/hooks/useGroupsHooks";
import { Group } from "@/features/groups/types";
import { Ionicons } from "@expo/vector-icons";

const FAB_SIZE = 56;

const HomeScreen = () => {
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(
    undefined
  );
  const { data: groups = [] } = useGroups();
  const router = useRouter();
  const { data: links = [], isLoading, refetch } = useLinks(selectedGroupId);

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
      {groups.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterBar}
          contentContainerStyle={styles.filterContent}
        >
          <TouchableOpacity
            style={[styles.chip, !selectedGroupId && styles.chipActive]}
            onPress={() => setSelectedGroupId(undefined)}
          >
            <Text
              style={[
                styles.chipText,
                !selectedGroupId && styles.chipTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          {groups.map((g: Group) => (
            <TouchableOpacity
              key={g.id}
              style={[
                styles.chip,
                selectedGroupId === g.id && {
                  backgroundColor: g.color,
                  borderColor: g.color,
                },
              ]}
              onPress={() => setSelectedGroupId(g.id)}
            >
              {/* icon stored as string in DB; type-safe cast not possible without runtime validation */}
              <Ionicons
                name={g.icon as any}
                size={14}
                color={
                  selectedGroupId === g.id ? Colors.body : Colors.secondary
                }
              />
              <Text
                style={[
                  styles.chipText,
                  selectedGroupId === g.id && { color: Colors.body },
                ]}
              >
                {g.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
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
  filterBar: { maxHeight: 48 },
  filterContent: {
    paddingHorizontal: Spacing.padding.large,
    gap: Spacing.gap.small,
    alignItems: "center",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.gap.small,
    paddingHorizontal: Spacing.padding.medium,
    paddingVertical: Spacing.padding.small,
    borderRadius: Spacing.radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.input,
    backgroundColor: Colors.input,
  },
  chipActive: { borderColor: Colors.gold, backgroundColor: Colors.gold },
  chipText: { color: Colors.secondary, fontSize: Typography.fontSize.small },
  chipTextActive: { color: Colors.body },
});

export default HomeScreen;
