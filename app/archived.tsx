import { View, Text, StyleSheet, FlatList } from "react-native";
import { useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, Typography } from "@/theme/theme";
import { Touchable } from "@/components/Touchable";
import { SwipeableRow } from "@/components/SwipeableRow";
import { LinkCard } from "@/features/links/components/LinkCard";
import {
  useArchivedLinks,
  useSetArchived,
} from "@/features/links/hooks/useLinksHooks";
import { useGroups } from "@/features/groups/hooks/useGroupsHooks";
import { Link } from "@/features/links/types";
import { timeAgo } from "@/lib/timeAgo";

export default function ArchivedScreen() {
  const router = useRouter();
  const { data: links = [], refetch } = useArchivedLinks();
  const { data: groups = [] } = useGroups();
  const { mutate: setArchived } = useSetArchived();
  const groupsMap = Object.fromEntries(groups.map((g) => [g.id, g]));

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const renderLink = useCallback(
    ({ item }: { item: Link }) => (
      <SwipeableRow
        actionLabel="Restore"
        actionIcon="arrow-undo-outline"
        actionColor={Colors.confirm}
        onAction={() => setArchived({ id: item.id, archived: false })}
      >
        <Touchable onPress={() => router.push(`/link/${item.id}`)}>
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
            variant="list"
          />
        </Touchable>
      </SwipeableRow>
    ),
    [router, groupsMap, setArchived]
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={links}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={renderLink}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="archive-outline" size={48} color={Colors.tertiary} />
            <Text style={styles.emptyTitle}>Nothing archived</Text>
            <Text style={styles.emptySubtitle}>
              Swipe a link and tap Archive to tuck it away here.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.body },
  list: { padding: Spacing.padding.large, gap: Spacing.gap.medium },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.gap.medium,
    paddingTop: Spacing.padding.xxlarge * 2,
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
});
