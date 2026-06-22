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
import {
  useGroupLinkCounts,
  useLinks,
} from "@/features/links/hooks/useLinksHooks";
import { useGroups } from "@/features/groups/hooks/useGroupsHooks";
import { Group } from "@/features/groups/types";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { timeAgo } from "@/lib/timeAgo";

const FAB_SIZE = 56;
const CHIP_HEIGHT = 26;

const HomeScreen = () => {
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(
    undefined
  );
  const [viewMode, setViewMode] = useState<"card" | "list">("list");
  const [sort, setSort] = useState<"recent" | "oldest">("recent");

  const { data: links = [], isLoading, refetch } = useLinks(selectedGroupId);
  const { data: allLinks = [] } = useLinks(undefined, undefined);
  const { data: groups = [] } = useGroups();
  const groupsMap = Object.fromEntries(groups.map((g) => [g.id, g]));
  const router = useRouter();
  const { data: groupCounts = {} } = useGroupLinkCounts();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const sortedLinks = sort === "oldest" ? [...links].reverse() : links;

  const renderLink = useCallback(
    ({ item }: { item: Link }) => (
      <TouchableOpacity onPress={() => router.push(`/link/${item.id}`)}>
        <LinkCard
          item={{
            id: item.id,
            title: item.title ?? "Untitled",
            source: item.site_name ?? item.url,
            domain: item.url,
            savedAt: timeAgo(item.created_at),
            preview: item.thumbnail_url ? "rich" : "fallback",
            thumb: item.thumbnail_url ?? undefined,
            note: item.note ?? undefined,
            groupName: item.group_id
              ? groupsMap[item.group_id]?.name
              : undefined,
            groupColor: item.group_id
              ? groupsMap[item.group_id]?.color
              : undefined,
          }}
          variant={viewMode}
        />
      </TouchableOpacity>
    ),
    [router, viewMode, groupsMap]
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        {/* header always visible */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoIcon}>
              <Ionicons
                name="link"
                size={16}
                color={Colors.body}
                style={{ transform: [{ rotate: "-45deg" }] }}
              />
            </View>
            <Text style={styles.headerTitle}>
              Link<Text style={styles.headerTitleAccent}>pond</Text>
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setViewMode((v) => (v === "list" ? "card" : "list"))}
          >
            <Ionicons
              name={viewMode === "list" ? "grid-outline" : "list-outline"}
              size={22}
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>
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
              <Text
                style={[
                  styles.chipText,
                  !selectedGroupId && styles.chipTextActive,
                ]}
              >
                {allLinks.length}
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
                  color={selectedGroupId === g.id ? Colors.body : g.color}
                />
                <Text
                  style={[
                    styles.chipText,
                    selectedGroupId === g.id && { color: Colors.body },
                  ]}
                >
                  {g.name}
                </Text>
                <Text
                  style={[
                    styles.chipText,
                    selectedGroupId === g.id && { color: Colors.body },
                  ]}
                >
                  {groupCounts[g.id] ?? 0}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {isLoading ? (
        <ActivityIndicator
          color={Colors.gold}
          size="large"
          style={{ flex: 1 }}
        />
      ) : links.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="folder-open-outline"
            size={48}
            color={Colors.tertiary}
          />
          <Text style={styles.emptyTitle}>Nothing saved yet</Text>
          <Text style={styles.emptySubtitle}>
            Tap the button below to save your first link
          </Text>
          <TouchableOpacity
            style={styles.emptyCta}
            onPress={() => router.push("/add")}
          >
            <Text style={styles.emptyCtaText}>+ Save a link</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={sortedLinks}
          keyExtractor={(item) => item.id}
          style={styles.listContainer}
          contentContainerStyle={styles.list}
          renderItem={renderLink}
          ListHeaderComponent={
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>{links.length} links</Text>
              <TouchableOpacity
                style={styles.sortButton}
                onPress={() =>
                  setSort((s) => (s === "recent" ? "oldest" : "recent"))
                }
              >
                <Text style={styles.metaText}>
                  {sort === "recent" ? "Recent" : "Oldest"}
                </Text>
                <Ionicons
                  name={sort === "recent" ? "chevron-down" : "chevron-up"}
                  size={14}
                  color={Colors.secondary}
                />
              </TouchableOpacity>
            </View>
          }
        />
      )}
      <TouchableOpacity style={styles.fab} onPress={() => router.push("/add")}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: Colors.header,
    paddingBottom: Spacing.padding.medium,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.padding.large,
    paddingTop: Spacing.padding.medium,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.gap.small,
  },
  logoIcon: {
    width: 24,
    height: 24,
    borderRadius: Spacing.radius.small,
    backgroundColor: Colors.gold,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: Typography.fontSize.large,
    fontFamily: Typography.fontFamily,
    color: Colors.primary,
    fontWeight: "700",
  },
  headerTitleAccent: {
    color: Colors.gold,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.header,
  },
  listContainer: {
    flex: 1,
    backgroundColor: Colors.body,
  },
  list: {
    padding: Spacing.padding.large,
    gap: Spacing.gap.medium,
    flexShrink: 0,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.gap.medium,
    paddingHorizontal: Spacing.padding.large,
  },
  emptyTitle: {
    color: Colors.primary,
    fontSize: Typography.fontSize.medium,
    fontWeight: "600",
  },
  emptySubtitle: {
    color: Colors.secondary,
    fontSize: Typography.fontSize.small,
    textAlign: "center",
  },
  emptyCta: {
    backgroundColor: Colors.gold,
    paddingHorizontal: Spacing.padding.large,
    paddingVertical: Spacing.padding.medium,
    borderRadius: Spacing.radius.xlarge,
    marginTop: Spacing.gap.small,
  },
  emptyCtaText: {
    color: Colors.body,
    fontWeight: "700",
    fontSize: Typography.fontSize.medium,
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
    borderColor: Colors.secondary,
    backgroundColor: "transparent",
    height: CHIP_HEIGHT,
  },
  chipActive: {
    borderColor: Colors.gold,
  },
  chipText: {
    color: Colors.secondary,
    fontSize: Typography.fontSize.small,
    lineHeight: Typography.fontLineHeight.small,
  },
  chipTextActive: {
    color: Colors.gold,
  },
  chipCount: {
    color: Colors.secondary,
    fontSize: Typography.fontSize.small,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  metaText: {
    fontSize: Typography.fontSize.small,
    fontFamily: Typography.fontFamily,
    color: Colors.secondary,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.gap.xs,
  },
});

export default HomeScreen;
