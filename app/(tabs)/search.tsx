import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, Typography } from "@/theme/theme";
import { useLinks } from "@/features/links/hooks/useLinksHooks";
import { LinkCard } from "@/features/links/components/LinkCard";
import { Link } from "@/features/links/types";
import { useRouter } from "expo-router";
import useDebounce from "@/lib/useDebounce";
import { timeAgo } from "@/lib/timeAgo";
import { useGroups } from "@/features/groups/hooks/useGroupsHooks";

type SortOption = "recent" | "oldest";

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Recent", value: "recent" },
  { label: "Oldest", value: "oldest" },
];

const SearchScreen = () => {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("recent");
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();

  const { data: links = [], isLoading } = useLinks(undefined, debouncedQuery);
  const { data: groups = [] } = useGroups();
  const groupsMap = Object.fromEntries(groups.map((g) => [g.id, g]));

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
        />
      </TouchableOpacity>
    ),
    [router, groupsMap]
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search input */}
      <View style={styles.inputRow}>
        <Ionicons
          name="search-outline"
          size={18}
          color={Colors.tertiary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Search titles, tags, notes..."
          placeholderTextColor={Colors.tertiary}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Ionicons name="close-circle" size={18} color={Colors.tertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Sort chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sortContent}
        style={styles.sortRow}
      >
        {SORT_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.chip, sort === opt.value && styles.chipActive]}
            onPress={() => setSort(opt.value)}
          >
            {sort === opt.value && (
              <Ionicons name="list-outline" size={13} color={Colors.body} />
            )}
            <Text
              style={[
                styles.chipText,
                sort === opt.value && styles.chipTextActive,
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results */}
      {isLoading ? (
        <ActivityIndicator
          color={Colors.gold}
          size="large"
          style={{ flex: 1 }}
        />
      ) : debouncedQuery.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={40} color={Colors.input} />
          <Text style={styles.emptyTitle}>Search your links</Text>
          <Text style={styles.emptySubtitle}>
            Search across titles, notes, and URLs
          </Text>
        </View>
      ) : sortedLinks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No results</Text>
          <Text style={styles.emptySubtitle}>
            Nothing matched {debouncedQuery}
          </Text>
        </View>
      ) : (
        <FlatList
          data={sortedLinks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={renderLink}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.body,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.input,
    marginHorizontal: Spacing.padding.large,
    marginTop: Spacing.padding.large,
    borderRadius: Spacing.radius.large,
    paddingHorizontal: Spacing.padding.medium,
    height: 44,
  },
  searchIcon: {
    marginRight: Spacing.gap.small,
  },
  input: {
    flex: 1,
    color: Colors.primary,
    fontSize: Typography.fontSize.medium,
  },
  sortRow: {
    flexGrow: 0,
    marginTop: Spacing.padding.medium,
  },
  sortContent: {
    paddingHorizontal: Spacing.padding.large,
    gap: Spacing.gap.small,
    alignItems: "center",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: Spacing.padding.medium,
    height: 32,
    borderRadius: Spacing.radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.input,
    backgroundColor: Colors.input,
  },
  chipActive: {
    borderColor: Colors.gold,
    backgroundColor: Colors.gold,
  },
  chipText: {
    color: Colors.secondary,
    fontSize: Typography.fontSize.small,
    lineHeight: Typography.fontLineHeight.small,
  },
  chipTextActive: {
    color: Colors.body,
  },
  list: {
    padding: Spacing.padding.large,
    gap: Spacing.gap.medium,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.gap.small,
    paddingHorizontal: Spacing.padding.large,
  },
  emptyTitle: {
    color: Colors.primary,
    fontSize: Typography.fontSize.medium,
    fontWeight: "600",
    marginTop: Spacing.padding.small,
  },
  emptySubtitle: {
    color: Colors.secondary,
    fontSize: Typography.fontSize.small,
    textAlign: "center",
  },
});

export default SearchScreen;
