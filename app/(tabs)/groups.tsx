import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";
import { Touchable } from "@/components/Touchable";
import { useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, Typography } from "@/theme/theme";
import { useGroups } from "@/features/groups/hooks/useGroupsHooks";
import { useFocusEffect, useRouter } from "expo-router";
import { Group } from "@/features/groups/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGroupLinkCounts } from "@/features/links/hooks/useLinksHooks";

export default function GroupsScreen() {
  const router = useRouter();
  const { data: groups = [], isLoading, refetch } = useGroups();
  const { data: counts = {} } = useGroupLinkCounts();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const renderGroup = useCallback(
    ({ item }: { item: Group }) => {
      const count = counts[item.id] ?? 0; // 0 if group has no links
      const countLabel =
        count === 0 ? "No links yet" : `${count} link${count === 1 ? "" : "s"}`;

      return (
        <Touchable
          style={styles.groupCard}
          onPress={() => router.push(`/group/${item.id}`)}
        >
          <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
            <Ionicons name={item.icon as any} size={24} color={Colors.body} />
          </View>
          <View style={styles.groupTextBlock}>
            <Text style={styles.groupName}>{item.name}</Text>
            <Text style={styles.groupCount}>{countLabel}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.secondary} />
        </Touchable>
      );
    },
    [counts, router]
  );

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? null : groups.length === 0 ? (
        <View style={styles.list}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Groups</Text>
            <Text style={styles.headerSubtitle}>
              Organize saves into your own buckets
            </Text>
          </View>
          <Text style={styles.empty}>No groups yet.</Text>
          <Touchable
            style={styles.newGroupBtn}
            onPress={() => router.push("/group/create")}
          >
            <Ionicons name="add" size={18} color={Colors.secondary} />
            <Text style={styles.newGroupText}>New group</Text>
          </Touchable>
        </View>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={renderGroup}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Groups</Text>
              <Text style={styles.headerSubtitle}>
                Organize saves into your own buckets
              </Text>
            </View>
          }
          ListFooterComponent={
            <Touchable
              style={styles.newGroupBtn}
              onPress={() => router.push("/group/create")}
            >
              <Ionicons name="add" size={18} color={Colors.secondary} />
              <Text style={styles.newGroupText}>New group</Text>
            </Touchable>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.body },
  header: {
    paddingBottom: Spacing.padding.medium,
  },
  headerTitle: {
    color: Colors.primary,
    fontSize: Typography.fontSize.xlarge,
    fontWeight: "600", // 700
    lineHeight: Typography.fontLineHeight.xlarge,
  },
  headerSubtitle: {
    color: Colors.secondary,
    fontSize: Typography.fontSize.small,
    marginTop: Spacing.gap.xs,
  },
  list: { padding: Spacing.padding.large, gap: Spacing.gap.medium },
  empty: {
    textAlign: "center",
    color: Colors.secondary,
    marginTop: Spacing.padding.large,
  },
  groupCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: Spacing.radius.large,
    padding: Spacing.padding.medium,
    gap: Spacing.gap.medium,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: Spacing.radius.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  groupName: {
    color: Colors.primary,
    fontSize: Typography.fontSize.medium,
    fontWeight: Typography.fontWeight.semibold, // add this line
  },
  groupTextBlock: {
    flex: 1,
  },
  groupCount: {
    color: Colors.secondary,
    fontSize: Typography.fontSize.small,
    marginTop: Spacing.gap.xs,
  },
  newGroupBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.gap.small,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: Colors.tertiary,
    borderRadius: Spacing.radius.large,
    paddingVertical: Spacing.padding.medium,
    marginTop: Spacing.gap.medium, // separates it from the last group
  },
  newGroupText: {
    color: Colors.secondary,
    fontSize: Typography.fontSize.medium,
    fontWeight: "500", // 500
  },
});
