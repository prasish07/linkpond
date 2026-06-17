import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, Typography } from "@/theme/theme";
import { useGroups } from "@/features/groups/hooks/useGroupsHooks";
import { useFocusEffect, useRouter } from "expo-router";
import { Group } from "@/features/groups/types";
import { SafeAreaView } from "react-native-safe-area-context";

const FAB_SIZE = 56;

export default function GroupsScreen() {
  const router = useRouter();
  const { data: groups = [], isLoading, refetch } = useGroups();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const renderGroup = useCallback(
    ({ item }: { item: Group }) => (
      <View style={styles.groupCard}>
        <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
          <Ionicons name={item.icon as any} size={24} color={Colors.body} />
        </View>
        <Text style={styles.groupName}>{item.name}</Text>
      </View>
    ),
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? null : groups.length === 0 ? (
        <Text style={styles.empty}>No groups yet.</Text>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={renderGroup}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/group/create")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.body },
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
  groupName: { color: Colors.primary, fontSize: Typography.fontSize.medium },
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
