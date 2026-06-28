import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Linking,
  Alert,
} from "react-native";
import { useLocalSearchParams, useFocusEffect } from "expo-router";
import { Image } from "expo-image";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, Typography } from "@/theme/theme";
import { useCallback, useState } from "react";
import {
  useDeleteLink,
  useLinkById,
} from "@/features/links/hooks/useLinksHooks";
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

  const [descExpanded, setDescExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const { data: reminder } = useReminder(id);
  const { mutate: setReminder, isPending: isSetting } = useSetReminder(id);
  const { mutate: removeReminder } = useDeleteReminder(id);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

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
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
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
              <FontAwesome name={brand.icon} size={64} color={brand.color} />
            </View>
          ) : null;
        })()
      )}

      <View style={styles.metaWrapper}>
        <View style={styles.meta}>
          {link.favicon_url && (
            <Image source={{ uri: link.favicon_url }} style={styles.favicon} />
          )}
          <Text style={styles.siteName} numberOfLines={1}>
            {link.site_name ??
              (() => {
                try {
                  return new URL(link.url).hostname;
                } catch {
                  return link.url;
                }
              })()}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            Alert.alert("Delete link?", "This can't be undone.", [
              { text: "Cancel", style: "cancel" },
              {
                text: "Delete",
                style: "destructive",
                onPress: () => deleteLink(link.id),
              },
            ])
          }
        >
          <Ionicons name="trash-outline" size={20} color={Colors.destructive} />
        </TouchableOpacity>
      </View>

      <Text style={styles.title} numberOfLines={3}>
        {link.title ?? "Untitled"}
      </Text>

      {link.description && (
        <View style={styles.descContainer}>
          <Text
            style={styles.description}
            numberOfLines={descExpanded ? undefined : 10}
          >
            {link.description}
          </Text>
          {link.description.split("\n").length > 10 ||
          link.description.length > 500 ? (
            <TouchableOpacity onPress={() => setDescExpanded(!descExpanded)}>
              <Text style={styles.readMore}>
                {descExpanded ? "Show less" : "Read more"}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      )}

      {link.note && (
        <View style={styles.noteCard}>
          <Text style={styles.noteLabel}>MY NOTE</Text>
          <Text style={styles.noteText}>{link.note}</Text>
        </View>
      )}
      <View style={styles.savedRow}>
        <Ionicons name="time-outline" size={14} color={Colors.tertiary} />
        <Text style={styles.savedText}>Saved {timeAgo(link.created_at)}</Text>
      </View>

      <TouchableOpacity
        style={styles.openBtn}
        onPress={() => Linking.openURL(link.url)}
        activeOpacity={0.7}
      >
        <Ionicons name="open-outline" size={18} color={Colors.body} />
        <Text style={styles.openBtnText}>Open original</Text>
      </TouchableOpacity>

      {/* reminder card if link has a reminder   */}
      {reminder ? (
        <View style={styles.reminderCard}>
          <Ionicons name="alarm-outline" size={16} color={Colors.gold} />
          <Text style={styles.reminderText}>
            Reminder: {formatReminderDate(reminder.remind_at)}
          </Text>
          <TouchableOpacity
            onPress={() =>
              removeReminder({
                id: reminder.id,
                notification_id: reminder.notification_id,
              })
            }
          >
            <Ionicons
              name="close-circle-outline"
              size={18}
              color={Colors.destructive}
            />
          </TouchableOpacity>
        </View>
      ) : showPicker ? (
        <View style={styles.presetList}>
          <FlatList
            data={PRESETS.filter((p) => p.offset() > new Date())}
            keyExtractor={(p) => p.label}
            scrollEnabled={false}
            renderItem={({ item: p }) => (
              <TouchableOpacity
                style={styles.presetItem}
                onPress={() => {
                  setReminder({ title: link.title ?? link.url, date: p.offset() });
                  setShowPicker(false);
                }}
                disabled={isSetting}
              >
                <Text style={styles.presetText}>{p.label}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={() => setShowPicker(false)}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.reminderBtn}
          onPress={() => setShowPicker(true)}
        >
          <Ionicons name="alarm-outline" size={18} color={Colors.primary} />
          <Text style={styles.reminderBtnText}>Set reminder</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.body },
  container: { paddingBottom: Spacing.padding.xlarge },
  centered: {
    flex: 1,
    backgroundColor: Colors.body,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: { color: Colors.secondary },
  thumbnail: { width: "100%", height: 200 },
  metaWrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.padding.large,
    paddingBottom: 0,
    justifyContent: "space-between",
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.gap.small,
  },
  favicon: { width: 16, height: 16, borderRadius: Spacing.radius.xs },
  siteName: { color: Colors.secondary, fontSize: Typography.fontSize.small },
  title: {
    color: Colors.primary,
    fontSize: Typography.fontSize.large,
    fontWeight: "700",
    padding: Spacing.padding.large,
    paddingBottom: Spacing.gap.small,
  },
  description: {
    color: Colors.secondary,
    fontSize: Typography.fontSize.medium,
    paddingHorizontal: Spacing.padding.large,
    lineHeight: Typography.fontLineHeight.medium,
  },
  noteCard: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.gold,
    backgroundColor: Colors.card,
    margin: Spacing.padding.large,
    marginTop: 0,
    padding: Spacing.padding.medium,
    borderRadius: Spacing.radius.medium,
    gap: Spacing.gap.xs,
  },
  noteLabel: {
    fontSize: Typography.fontSize.small,
    fontWeight: "700",
    color: Colors.gold,
    letterSpacing: 0.8,
  },
  noteText: { color: Colors.secondary, flex: 1 },
  savedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.gap.xs,
    paddingHorizontal: Spacing.padding.large,
    marginTop: Spacing.gap.medium,
  },
  savedText: {
    fontSize: Typography.fontSize.small,
    color: Colors.tertiary,
  },
  openBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.gap.small,
    backgroundColor: Colors.gold,
    margin: Spacing.padding.large,
    padding: Spacing.padding.medium,
    borderRadius: Spacing.radius.medium,
  },
  openBtnText: {
    color: Colors.body,
    fontWeight: "700",
    fontSize: Typography.fontSize.medium,
  },
  descContainer: { paddingHorizontal: Spacing.padding.large },
  readMore: {
    color: Colors.gold,
    fontSize: Typography.fontSize.small,
    marginTop: Spacing.gap.small,
  },
  thumbnailFallback: {
    width: "100%",
    height: 200,
    backgroundColor: Colors.card,
    justifyContent: "center",
    alignItems: "center",
  },
  reminderBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.gap.small,
    borderWidth: 1,
    borderColor: Colors.input,
    margin: Spacing.padding.large,
    marginTop: 0,
    padding: Spacing.padding.medium,
    borderRadius: Spacing.radius.medium,
  },
  reminderBtnText: {
    color: Colors.primary,
    fontWeight: "600",
    fontSize: Typography.fontSize.medium,
  },
  reminderCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.gap.small,
    margin: Spacing.padding.large,
    marginTop: 0,
    padding: Spacing.padding.medium,
    backgroundColor: Colors.card,
    borderRadius: Spacing.radius.medium,
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  reminderText: {
    flex: 1,
    color: Colors.secondary,
    fontSize: Typography.fontSize.small,
  },
  presetList: {
    margin: Spacing.padding.large,
    marginTop: 0,
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
