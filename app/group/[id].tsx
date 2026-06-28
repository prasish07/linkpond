import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Touchable } from "@/components/Touchable";
import { useCallback, useLayoutEffect } from "react";
import {
  useLocalSearchParams,
  useFocusEffect,
  useNavigation,
  useRouter,
} from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, Typography } from "@/theme/theme";
import { LinkCard } from "@/features/links/components/LinkCard";
import { useLinks } from "@/features/links/hooks/useLinksHooks";
import {
  useGroups,
  useDeleteGroup,
} from "@/features/groups/hooks/useGroupsHooks";
import { Link } from "@/features/links/types";
import { timeAgo } from "@/lib/timeAgo";

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();

  const { data: groups = [] } = useGroups();
  const group = groups.find((g) => g.id === id);

  const { data: links = [], isLoading, refetch } = useLinks(id);
  const { mutate: deleteGroup } = useDeleteGroup();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: group?.name ?? "Group",
      headerStyle: { backgroundColor: Colors.header },
      headerShadowVisible: false,
      headerTintColor: Colors.primary,
      headerRight: () => (
        <View style={styles.headerActions}>
          <Touchable
            onPress={() => router.push(`/group/create?id=${id}`)}
          >
            <Ionicons name="pencil-outline" size={20} color={Colors.primary} />
          </Touchable>
          <Touchable
            onPress={() =>
              Alert.alert(
                "Delete group?",
                "Links in this group won't be deleted — they'll just lose this group.",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                      if (id) deleteGroup(id);
                    },
                  },
                ]
              )
            }
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color={Colors.destructive}
            />
          </Touchable>
        </View>
      ),
    });
  }, [navigation, group, id, router, deleteGroup]);

  const renderLink = useCallback(
    ({ item }: { item: Link }) => (
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
            groupName: group?.name,
            groupColor: group?.color,
          }}
          variant="list"
        />
      </Touchable>
    ),
    [router, group]
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.gold} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={links}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={renderLink}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name="folder-open-outline"
              size={48}
              color={Colors.tertiary}
            />
            <Text style={styles.emptyTitle}>No links in this group yet</Text>
            <Text style={styles.emptySubtitle}>
              Links you assign to this group will show up here.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.body },
  centered: {
    flex: 1,
    backgroundColor: Colors.body,
    justifyContent: "center",
    alignItems: "center",
  },
  headerActions: {
    flexDirection: "row",
    gap: Spacing.gap.large,
    marginRight: 4,
  },
  list: { padding: Spacing.padding.large, gap: Spacing.gap.medium },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.gap.medium,
    paddingTop: Spacing.padding.xlarge * 2,
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
