import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Touchable } from "@/components/Touchable";
import { LinkListSkeleton } from "@/features/links/components/LinkListSkeleton";
import { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, Typography } from "@/theme/theme";
import { useLinks, useSetArchived } from "@/features/links/hooks/useLinksHooks";
import { LinkCard } from "@/features/links/components/LinkCard";
import { SwipeableRow } from "@/components/SwipeableRow";
import { Link } from "@/features/links/types";
import { useRouter } from "expo-router";
import useDebounce from "@/lib/useDebounce";
import { timeAgo } from "@/lib/timeAgo";
import { useGroups } from "@/features/groups/hooks/useGroupsHooks";
import { useActiveReminders } from "@/features/reminders/hooks/useRemindersHooks";
import { formatReminderShort } from "@/features/reminders/utils";
import {
  useRecentSearches,
  useRecordSearch,
} from "@/features/search/hooks/useSearchHooks";

type SortOption = "recent" | "oldest";

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Recent", value: "recent" },
  { label: "Oldest", value: "oldest" },
];

const SearchScreen = () => {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("recent");
  const [hasReminderOnly, setHasReminderOnly] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();

  const { data: links = [], isLoading } = useLinks(undefined, debouncedQuery);
  const { data: groups = [] } = useGroups();
  const { data: reminders = {} } = useActiveReminders();
  const { data: recentSearches = [] } = useRecentSearches();
  const { mutate: recordSearch } = useRecordSearch();
  const { mutate: setArchived } = useSetArchived();
  const groupsMap = Object.fromEntries(groups.map((g) => [g.id, g]));

  const sortedLinks = sort === "oldest" ? [...links].reverse() : links;
  const visibleLinks = hasReminderOnly
    ? sortedLinks.filter((l) => reminders[l.id])
    : sortedLinks;

  const handleSubmit = () => {
    const term = query.trim();
    if (term.length >= 2) recordSearch(term);
  };

  const renderLink = useCallback(
    ({ item }: { item: Link }) => (
      <SwipeableRow
        actionLabel="Archive"
        actionIcon="archive-outline"
        actionColor={Colors.secondary}
        onAction={() => setArchived({ id: item.id, archived: true })}
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
              reminder: reminders[item.id]
                ? formatReminderShort(reminders[item.id])
                : undefined,
              groupName: item.group_id
                ? groupsMap[item.group_id]?.name
                : undefined,
              groupColor: item.group_id
                ? groupsMap[item.group_id]?.color
                : undefined,
            }}
          />
        </Touchable>
      </SwipeableRow>
    ),
    [router, groupsMap, reminders, setArchived]
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
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <Touchable onPress={() => setQuery("")}>
            <Ionicons name="close-circle" size={18} color={Colors.tertiary} />
          </Touchable>
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
          <Touchable
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
          </Touchable>
        ))}
        <Touchable
          style={[styles.chip, hasReminderOnly && styles.chipActive]}
          onPress={() => setHasReminderOnly((v) => !v)}
        >
          <Ionicons
            name="notifications-outline"
            size={13}
            color={hasReminderOnly ? Colors.body : Colors.secondary}
          />
          <Text
            style={[styles.chipText, hasReminderOnly && styles.chipTextActive]}
          >
            Has reminder
          </Text>
        </Touchable>
      </ScrollView>

      {/* Results */}
      {isLoading ? (
        <LinkListSkeleton />
      ) : debouncedQuery.length === 0 ? (
        recentSearches.length > 0 ? (
          <View style={styles.recentSection}>
            <Text style={styles.sectionLabel}>RECENT SEARCHES</Text>
            <View style={styles.recentWrap}>
              {recentSearches.map((term) => (
                <Touchable
                  key={term}
                  style={styles.recentChip}
                  onPress={() => setQuery(term)}
                >
                  <Text style={styles.recentHash}>#</Text>
                  <Text style={styles.recentChipText}>{term}</Text>
                </Touchable>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={40} color={Colors.input} />
            <Text style={styles.emptyTitle}>Search your links</Text>
            <Text style={styles.emptySubtitle}>
              Search across titles, notes, and URLs
            </Text>
          </View>
        )
      ) : visibleLinks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No results</Text>
          <Text style={styles.emptySubtitle}>
            {hasReminderOnly
              ? "No matches with a reminder"
              : `Nothing matched ${debouncedQuery}`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={visibleLinks}
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
  recentSection: {
    paddingHorizontal: Spacing.padding.large,
    paddingTop: Spacing.padding.large,
    gap: Spacing.gap.medium,
  },
  sectionLabel: {
    color: Colors.secondary,
    fontSize: Typography.fontSize.small,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  recentWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.gap.small,
  },
  recentChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.gap.xs,
    backgroundColor: Colors.input,
    borderRadius: Spacing.radius.xlarge,
    paddingHorizontal: Spacing.padding.medium,
    paddingVertical: Spacing.padding.small,
  },
  recentHash: {
    color: Colors.tertiary,
    fontSize: Typography.fontSize.small,
    fontWeight: "700",
  },
  recentChipText: {
    color: Colors.secondary,
    fontSize: Typography.fontSize.small,
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
