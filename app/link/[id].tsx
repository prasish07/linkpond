import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  FlatList,
  Linking,
  Alert,
} from "react-native";
import { Touchable } from "@/components/Touchable";
import {
  useLocalSearchParams,
  useFocusEffect,
  useNavigation,
  useRouter,
} from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, Typography } from "@/theme/theme";
import { useCallback, useState, useLayoutEffect } from "react";
import {
  useDeleteLink,
  useLinkById,
  useMarkOpened,
} from "@/features/links/hooks/useLinksHooks";
import { useGroups } from "@/features/groups/hooks/useGroupsHooks";
import { getBrandInfo } from "@/lib/getBrandInfo";
import { timeAgo } from "@/lib/timeAgo";
import {
  useDeleteReminder,
  useReminder,
  useSetReminder,
} from "@/features/reminders/hooks/useRemindersHooks";
import { PRESETS, formatReminderDate } from "@/features/reminders/utils";

export default function LinkDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: link, isLoading, refetch } = useLinkById(id);
  const { mutate: deleteLink } = useDeleteLink();
  const { mutate: markOpened } = useMarkOpened();
  const { data: groups = [] } = useGroups();
  const navigation = useNavigation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [imgError, setImgError] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const { data: reminder } = useReminder(id);
  const { mutate: setReminder, isPending: isSetting } = useSetReminder(id);
  const { mutate: removeReminder } = useDeleteReminder(id);

  const group = groups.find((g) => g.id === link?.group_id);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerStyle: { backgroundColor: Colors.header },
      headerShadowVisible: false,
      headerTintColor: Colors.primary,
      headerRight: () => (
        <View style={styles.headerActions}>
          <Touchable
            onPress={() => {
              if (link?.id) router.push(`/link/edit/${link.id}`);
            }}
          >
            <Ionicons name="pencil-outline" size={20} color={Colors.primary} />
          </Touchable>
          <Touchable
            onPress={() =>
              Alert.alert("Delete link?", "This can't be undone.", [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => {
                    if (link?.id) deleteLink(link.id);
                  },
                },
              ])
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
  }, [navigation, link, deleteLink, router]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.gold} size="large" />
      </View>
    );
  }

  if (!link) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Link not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
      >
        <View style={styles.thumbnailWrapper}>
          {link.thumbnail_url && !imgError ? (
            <Image
              source={{ uri: link.thumbnail_url }}
              style={styles.thumbnail}
              contentFit="cover"
              onError={() => setImgError(true)}
            />
          ) : (
            (() => {
              const brand = getBrandInfo(link.url);
              return brand ? (
                <View style={styles.thumbnailFallback}>
                  <FontAwesome
                    name={brand.icon}
                    size={64}
                    color={brand.color}
                  />
                </View>
              ) : null;
            })()
          )}
          {link.favicon_url && (
            <View style={styles.thumbnailBadge}>
              <Image
                source={{ uri: link.favicon_url }}
                style={styles.badgeIcon}
              />
            </View>
          )}
        </View>

        <Text style={styles.title} numberOfLines={3}>
          {link.title ?? "Untitled"}
        </Text>

        {link.note && (
          <>
            <Text style={styles.sectionLabel}>MY NOTE</Text>
            <View style={styles.noteCard}>
              <Text style={styles.noteText}>{link.note}</Text>
            </View>
          </>
        )}

        {group && (
          <View style={styles.metaRow}>
            <View style={styles.metaLeft}>
              <Ionicons
                name="folder-outline"
                size={16}
                color={Colors.tertiary}
              />
              <Text style={styles.metaLabel}>Group</Text>
            </View>
            <View style={styles.metaRight}>
              <View
                style={[styles.groupDot, { backgroundColor: group.color }]}
              />
              <Text style={styles.metaValue}>{group.name}</Text>
            </View>
          </View>
        )}

        <View style={styles.metaRow}>
          <View style={styles.metaLeft}>
            <Ionicons name="time-outline" size={16} color={Colors.tertiary} />
            <Text style={styles.metaLabel}>Saved</Text>
          </View>
          <Text style={styles.metaValue}>{timeAgo(link.created_at)}</Text>
        </View>

        <Text style={styles.sectionLabel}>REMINDER</Text>
        {reminder ? (
          <Touchable
            style={styles.reminderCard}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert(
                "Remove reminder?",
                "The notification will be cancelled.",
                [
                  { text: "Keep", style: "cancel" },
                  {
                    text: "Remove",
                    style: "destructive",
                    onPress: () =>
                      removeReminder({
                        id: reminder.id,
                        notification_id: reminder.notification_id,
                      }),
                  },
                ]
              )
            }
          >
            <Ionicons
              name="notifications-outline"
              size={18}
              color={Colors.gold}
            />
            <View style={styles.reminderInfo}>
              <Text style={styles.reminderTitle}>
                {formatReminderDate(reminder.remind_at)}
              </Text>
              <Text style={styles.reminderSubtitle}>
                You&apos;ll get a nudge
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={Colors.tertiary}
            />
          </Touchable>
        ) : showPicker ? (
          <View style={styles.presetList}>
            <FlatList
              data={PRESETS.filter((p) => p.offset() > new Date())}
              keyExtractor={(p) => p.label}
              scrollEnabled={false}
              renderItem={({ item: p }) => (
                <Touchable
                  style={styles.presetItem}
                  onPress={() => {
                    setReminder({
                      title: link.title ?? link.url,
                      date: p.offset(),
                    });
                    setShowPicker(false);
                  }}
                  disabled={isSetting}
                >
                  <Text style={styles.presetText}>{p.label}</Text>
                </Touchable>
              )}
            />
            <Touchable onPress={() => setShowPicker(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Touchable>
          </View>
        ) : (
          <Touchable
            style={styles.reminderBtn}
            onPress={() => setShowPicker(true)}
          >
            <Ionicons name="alarm-outline" size={18} color={Colors.primary} />
            <Text style={styles.reminderBtnText}>Set reminder</Text>
          </Touchable>
        )}
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom + Spacing.padding.medium },
        ]}
      >
        <Touchable
          style={styles.openBtn}
          onPress={() => {
            markOpened(link.id);
            Linking.openURL(link.url);
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="open-outline" size={18} color={Colors.body} />
          <Text style={styles.openBtnText}>Open original</Text>
        </Touchable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.body },
  scroll: { flex: 1, backgroundColor: Colors.body },
  container: { paddingBottom: Spacing.padding.large },
  centered: {
    flex: 1,
    backgroundColor: Colors.body,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: { color: Colors.secondary },
  headerActions: {
    flexDirection: "row",
    gap: Spacing.gap.large,
    marginRight: 4,
  },
  thumbnailWrapper: { width: "100%", position: "relative" },
  thumbnailBadge: {
    position: "absolute",
    top: Spacing.padding.medium,
    left: Spacing.padding.medium,
    backgroundColor: Colors.card,
    borderRadius: Spacing.radius.small,
    padding: Spacing.padding.xs,
  },
  badgeIcon: { width: 18, height: 18, borderRadius: Spacing.radius.xs },
  thumbnail: { width: "100%", height: 200 },
  thumbnailFallback: {
    width: "100%",
    height: 200,
    backgroundColor: Colors.card,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: Colors.primary,
    fontSize: Typography.fontSize.large,
    fontWeight: "700",
    paddingHorizontal: Spacing.padding.large,
    paddingTop: Spacing.padding.large,
  },
  footer: {
    backgroundColor: Colors.body,
    paddingHorizontal: Spacing.padding.large,
    paddingTop: Spacing.padding.medium,
    borderTopWidth: 1,
    borderTopColor: Colors.input,
  },
  openBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
    fontSize: Typography.fontSize.small,
    fontWeight: "700",
    color: Colors.secondary,
    letterSpacing: 0.8,
    paddingHorizontal: Spacing.padding.large,
    paddingTop: Spacing.padding.medium,
    paddingBottom: Spacing.gap.small,
  },
  noteCard: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.gold,
    backgroundColor: Colors.card,
    marginHorizontal: Spacing.padding.large,
    padding: Spacing.padding.medium,
    borderRadius: Spacing.radius.medium,
  },
  noteText: { color: Colors.secondary, fontSize: Typography.fontSize.small },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: Spacing.padding.large,
    paddingVertical: Spacing.padding.medium,
    borderBottomWidth: 1,
    borderBottomColor: Colors.input,
  },
  metaLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.gap.medium,
  },
  metaLabel: { color: Colors.secondary, fontSize: Typography.fontSize.medium },
  metaRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.gap.small,
  },
  metaValue: {
    color: Colors.primary,
    fontSize: Typography.fontSize.medium,
    fontWeight: "500",
  },
  groupDot: { width: 8, height: 8, borderRadius: 4 },
  reminderCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.gap.medium,
    marginHorizontal: Spacing.padding.large,
    padding: Spacing.padding.medium,
    backgroundColor: Colors.card,
    borderRadius: Spacing.radius.medium,
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  reminderInfo: { flex: 1 },
  reminderTitle: {
    color: Colors.primary,
    fontSize: Typography.fontSize.medium,
    fontWeight: "600",
  },
  reminderSubtitle: {
    color: Colors.gold,
    fontSize: Typography.fontSize.small,
    marginTop: 2,
  },
  reminderBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.gap.small,
    borderWidth: 1,
    borderColor: Colors.input,
    marginHorizontal: Spacing.padding.large,
    padding: Spacing.padding.medium,
    borderRadius: Spacing.radius.medium,
  },
  reminderBtnText: {
    color: Colors.primary,
    fontWeight: "600",
    fontSize: Typography.fontSize.medium,
  },
  presetList: {
    marginHorizontal: Spacing.padding.large,
    backgroundColor: Colors.card,
    borderRadius: Spacing.radius.medium,
    overflow: "hidden",
  },
  presetItem: {
    padding: Spacing.padding.medium,
    borderBottomWidth: 1,
    borderBottomColor: Colors.input,
  },
  presetText: { color: Colors.primary, fontSize: Typography.fontSize.medium },
  cancelText: {
    color: Colors.destructive,
    textAlign: "center",
    padding: Spacing.padding.medium,
    fontSize: Typography.fontSize.medium,
  },
});
