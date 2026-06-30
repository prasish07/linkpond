import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
} from "react-native";
import { Touchable } from "@/components/Touchable";
import { useCallback, useState } from "react";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { Colors, Spacing, Typography } from "@/theme/theme";
import { useLinks, useMarkOpened } from "@/features/links/hooks/useLinksHooks";
import { useGroups } from "@/features/groups/hooks/useGroupsHooks";
import {
  useActiveReminders,
} from "@/features/reminders/hooks/useRemindersHooks";
import { formatReminderShort } from "@/features/reminders/utils";
import { LinkCard } from "@/features/links/components/LinkCard";
import { timeAgo } from "@/lib/timeAgo";

const FEATURED_THUMB_HEIGHT = 180;
const BADGE_ICON_SIZE = 16;

export default function ResurfaceScreen() {
  const router = useRouter();
  const { data: links = [], refetch } = useLinks();
  const { data: groups = [] } = useGroups();
  const { data: reminders = {} } = useActiveReminders();
  const { mutate: markOpened } = useMarkOpened();
  const groupsMap = Object.fromEntries(groups.map((g) => [g.id, g]));

  // surface the oldest still-unopened saves (the real engine lands in v2)
  const [skip, setSkip] = useState(0);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const unopened = links
    .filter((l) => !l.opened_at)
    .sort((a, b) => a.created_at - b.created_at);
  const featured = unopened[skip];
  const comingUp = unopened.slice(skip + 1, skip + 4);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Resurface</Text>
          <View style={styles.soonBadge}>
            <Text style={styles.soonText}>SOON</Text>
          </View>
        </View>
        <Text style={styles.headerSubtitle}>
          Old saves, brought back before they rot
        </Text>

        {!featured ? (
          <View style={styles.empty}>
            <Ionicons name="sparkles-outline" size={48} color={Colors.tertiary} />
            <Text style={styles.emptyTitle}>Nothing to resurface yet</Text>
            <Text style={styles.emptySubtitle}>
              Save a few links and they&apos;ll come back to you here.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.featuredCard}>
              <View style={styles.featuredMeta}>
                <Ionicons name="sparkles" size={14} color={Colors.gold} />
                <Text style={styles.featuredMetaText}>
                  Saved {timeAgo(featured.created_at)} — still unopened
                </Text>
              </View>

              <View style={styles.thumbWrapper}>
                {featured.thumbnail_url ? (
                  <Image
                    source={{ uri: featured.thumbnail_url }}
                    style={styles.featuredThumb}
                    contentFit="cover"
                  />
                ) : (
                  <View style={[styles.featuredThumb, styles.thumbFallback]}>
                    <Ionicons
                      name="link"
                      size={32}
                      color={Colors.tertiary}
                    />
                  </View>
                )}
                {featured.favicon_url && (
                  <View style={styles.thumbBadge}>
                    <Image
                      source={{ uri: featured.favicon_url }}
                      style={styles.thumbBadgeIcon}
                    />
                  </View>
                )}
              </View>

              <Text style={styles.featuredTitle} numberOfLines={2}>
                {featured.title ?? "Untitled"}
              </Text>
              <Text style={styles.featuredSite} numberOfLines={1}>
                {featured.site_name ?? featured.url}
              </Text>

              <View style={styles.actions}>
                <Touchable
                  style={styles.laterBtn}
                  onPress={() => setSkip((s) => s + 1)}
                  disabled={skip + 1 >= unopened.length}
                >
                  <Text style={styles.laterBtnText}>Later</Text>
                </Touchable>
                <Touchable
                  style={styles.openBtn}
                  onPress={() => {
                    markOpened(featured.id);
                    Linking.openURL(featured.url);
                  }}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="open-outline"
                    size={BADGE_ICON_SIZE}
                    color={Colors.body}
                  />
                  <Text style={styles.openBtnText}>Open now</Text>
                </Touchable>
              </View>
            </View>

            {comingUp.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>COMING UP NEXT</Text>
                {comingUp.map((item) => (
                  <Touchable
                    key={item.id}
                    onPress={() => router.push(`/link/${item.id}`)}
                  >
                    <LinkCard
                      item={{
                        id: item.id,
                        title: item.title ?? "Untitled",
                        source: item.site_name ?? item.url,
                        domain: item.url,
                        savedAt: timeAgo(item.created_at),
                        preview: item.thumbnail_url ? "rich" : "fallback",
                        thumb: item.thumbnail_url ?? undefined,
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
                      variant="list"
                    />
                  </Touchable>
                ))}
              </>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.body },
  scroll: {
    padding: Spacing.padding.large,
    gap: Spacing.gap.medium,
    paddingBottom: Spacing.padding.xxlarge,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.gap.small,
  },
  headerTitle: {
    color: Colors.primary,
    fontSize: Typography.fontSize.xlarge,
    fontWeight: "700",
  },
  soonBadge: {
    backgroundColor: Colors.gold,
    borderRadius: Spacing.radius.xlarge,
    paddingHorizontal: Spacing.padding.small,
    paddingVertical: 2,
  },
  soonText: {
    color: Colors.body,
    fontSize: Typography.fontSize.small,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: Colors.secondary,
    fontSize: Typography.fontSize.small,
    marginTop: -Spacing.gap.small,
  },
  featuredCard: {
    backgroundColor: Colors.card,
    borderRadius: Spacing.radius.large,
    padding: Spacing.padding.medium,
    gap: Spacing.gap.small,
  },
  featuredMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.gap.xs,
  },
  featuredMetaText: {
    color: Colors.gold,
    fontSize: Typography.fontSize.small,
    fontWeight: "600",
  },
  thumbWrapper: { position: "relative", marginTop: Spacing.gap.xs },
  featuredThumb: {
    width: "100%",
    height: FEATURED_THUMB_HEIGHT,
    borderRadius: Spacing.radius.medium,
    backgroundColor: Colors.input,
  },
  thumbFallback: { justifyContent: "center", alignItems: "center" },
  thumbBadge: {
    position: "absolute",
    top: Spacing.padding.small,
    left: Spacing.padding.small,
    backgroundColor: Colors.card,
    borderRadius: Spacing.radius.small,
    padding: Spacing.padding.xs,
  },
  thumbBadgeIcon: { width: 18, height: 18, borderRadius: Spacing.radius.xs },
  featuredTitle: {
    color: Colors.primary,
    fontSize: Typography.fontSize.large,
    fontWeight: "700",
    marginTop: Spacing.gap.xs,
  },
  featuredSite: {
    color: Colors.secondary,
    fontSize: Typography.fontSize.small,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.gap.medium,
    marginTop: Spacing.gap.small,
  },
  laterBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.input,
    padding: Spacing.padding.medium,
    borderRadius: Spacing.radius.medium,
    alignItems: "center",
  },
  laterBtnText: {
    color: Colors.secondary,
    fontWeight: "700",
    fontSize: Typography.fontSize.medium,
  },
  openBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.gap.small,
    backgroundColor: Colors.gold,
    padding: Spacing.padding.medium,
    borderRadius: Spacing.radius.medium,
  },
  openBtnText: {
    color: Colors.body,
    fontWeight: "700",
    fontSize: Typography.fontSize.medium,
  },
  sectionLabel: {
    color: Colors.secondary,
    fontSize: Typography.fontSize.small,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginTop: Spacing.gap.medium,
  },
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
