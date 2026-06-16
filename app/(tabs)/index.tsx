import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
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
import { SafeAreaView } from "react-native-safe-area-context";

const FAB_SIZE = 56;
const CHIP_HEIGHT = 36;

const HomeScreen = () => {
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(
    undefined
  );

  const { data: links = [], isLoading, refetch } = useLinks(selectedGroupId);
  const { data: groups = [] } = useGroups();
  const router = useRouter();

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
    <SafeAreaView style={styles.container}>
      {groups.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
          style={styles.filter}
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
          style={styles.listContainer}
          contentContainerStyle={styles.list}
          renderItem={renderLink}
        />
      )}
      <TouchableOpacity style={styles.fab} onPress={() => router.push("/add")}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.body,
  },
  listContainer: {
    flex: 1,
  },
  list: {
    padding: Spacing.padding.large,
    gap: Spacing.gap.medium,
    flexShrink: 0,
  },
  input: {
    marginHorizontal: Spacing.padding.large,
    marginTop: Spacing.padding.large,
    paddingHorizontal: Spacing.padding.medium,
    paddingVertical: Spacing.padding.small,
    backgroundColor: Colors.input,
    borderRadius: Spacing.radius.large,
    color: Colors.primary,
    fontSize: Typography.fontSize.medium,
    height: 44,
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
  filter: {
    flexGrow: 0,
    flexShrink: 0,
    height: CHIP_HEIGHT,
    marginTop: Spacing.padding.large,
  },
  filterContent: {
    paddingHorizontal: Spacing.padding.large,
    gap: Spacing.gap.small,
    alignItems: "center",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.gap.small,
    paddingHorizontal: Spacing.padding.medium,
    borderRadius: Spacing.radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.input,
    backgroundColor: Colors.input,
    height: CHIP_HEIGHT,
  },
  chipActive: { borderColor: Colors.gold, backgroundColor: Colors.gold },
  chipText: {
    color: Colors.secondary,
    fontSize: Typography.fontSize.small,
    lineHeight: Typography.fontLineHeight.small,
  },
  chipTextActive: { color: Colors.body },
});

export default HomeScreen;
