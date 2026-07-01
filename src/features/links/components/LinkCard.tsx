import { Colors, Spacing, Typography } from "@/theme/theme";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { getBrandInfo } from "@/lib/getBrandInfo";
import { useState } from "react";
import { TagList } from "@/components/TagList";
import { Tag } from "@/features/tags/types";

type LinkItem = {
  id: string;
  title: string;
  source: string;
  domain: string;
  savedAt: string;
  preview: "rich" | "fallback";
  note?: string;
  thumb?: string;
  duration?: string;
  reminder?: string;
  groupName?: string;
  groupColor?: string;
  tags?: Tag[];
};

type Props = {
  item: LinkItem;
  variant?: "card" | "list";
  dimmed?: boolean;
};

const DOT_SIZE = 7;
const FAVICON_BADGE = 18;

export const LinkCard = ({ item, variant, dimmed }: Props) => {
  const [imgError, setImgError] = useState(false);

  const showFallback = !item.thumb || imgError;

  const getFallbackIcon = (domain: string, size: number) => {
    const brand = getBrandInfo(domain);
    return brand ? (
      <FontAwesome name={brand.icon} size={size} color={brand.color} />
    ) : (
      <Ionicons name="link-outline" size={size} color={Colors.tertiary} />
    );
  };

  // shared meta line: ● group · time
  const metaLine = (
    <View style={styles.metaRow}>
      {item.groupName && (
        <>
          <View
            style={[styles.groupDot, { backgroundColor: item.groupColor }]}
          />
          <Text style={styles.groupLabel} numberOfLines={1}>
            {item.groupName}
          </Text>
          <Ionicons name="ellipse" size={3} color={Colors.tertiary} />
        </>
      )}
      <Text style={styles.meta}>{item.savedAt}</Text>
      {!!item.tags?.length && (
        <>
          <Ionicons name="ellipse" size={3} color={Colors.tertiary} />
          <TagList tags={item.tags} maxVisible={2} />
        </>
      )}
    </View>
  );

  if (variant === "card") {
    return (
      <View style={[styles.cardContainer, dimmed && styles.dimmed]}>
        <View style={styles.cardThumbWrap}>
          {!showFallback ? (
            <Image
              source={{ uri: item.thumb }}
              style={styles.cardThumb}
              contentFit="cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <View style={[styles.cardThumb, styles.thumbFallback]}>
              {getFallbackIcon(item.domain, 48)}
            </View>
          )}
          <View style={styles.badge}>{getFallbackIcon(item.domain, 12)}</View>
          {item.duration && (
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>{item.duration}</Text>
            </View>
          )}
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.source} numberOfLines={1}>
            {item.source}
          </Text>
          {item.note && (
            <View style={styles.noteRow}>
              <Text style={styles.noteText} numberOfLines={2}>
                {item.note}
              </Text>
            </View>
          )}
          <View style={styles.cardMetaRow}>
            {metaLine}
            {item.reminder && (
              <View style={styles.reminderTag}>
                <Ionicons name="notifications" size={12} color={Colors.gold} />
                <Text style={styles.reminderText} numberOfLines={1}>
                  {item.reminder}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.listContainer, dimmed && styles.dimmed]}>
      <View style={styles.listRow}>
        <View style={styles.listThumbWrap}>
          {!showFallback ? (
            <Image
              source={{ uri: item.thumb }}
              style={styles.listThumb}
              contentFit="cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <View style={[styles.listThumb, styles.thumbFallback]}>
              {getFallbackIcon(item.domain, 32)}
            </View>
          )}
          {item.duration && (
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>{item.duration}</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.source} numberOfLines={1}>
            {item.source}
          </Text>
          {metaLine}
        </View>

        {item.reminder && (
          <Ionicons
            name="notifications-outline"
            size={16}
            color={Colors.gold}
            style={styles.listReminder}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // list variant
  listContainer: {
    backgroundColor: Colors.card,
    borderRadius: Spacing.radius.medium,
    padding: Spacing.padding.medium,
    gap: Spacing.gap.small,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.gap.medium,
  },
  listThumbWrap: {
    width: 80,
    height: 72,
    flexShrink: 0,
    position: "relative",
  },
  listThumb: {
    width: 80,
    height: "100%",
    borderRadius: Spacing.radius.small,
    backgroundColor: Colors.input,
  },
  listReminder: { alignSelf: "flex-start" },
  // card variant
  cardContainer: {
    backgroundColor: Colors.card,
    borderRadius: Spacing.radius.medium,
    overflow: "hidden",
  },
  cardThumbWrap: {
    width: "100%",
    height: 180,
    position: "relative",
  },
  cardThumb: {
    width: "100%",
    height: 180,
    backgroundColor: Colors.input,
  },
  cardContent: {
    padding: Spacing.padding.medium,
    gap: Spacing.gap.small,
  },
  cardMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.gap.small,
  },
  noteRow: {
    borderLeftWidth: 2,
    borderLeftColor: Colors.gold,
    paddingLeft: Spacing.gap.small,
  },
  noteText: {
    fontSize: Typography.fontSize.small,
    color: Colors.secondary,
    fontStyle: "italic",
  },
  // badges
  badge: {
    position: "absolute",
    top: Spacing.padding.small,
    left: Spacing.padding.small,
    width: FAVICON_BADGE + 8,
    height: FAVICON_BADGE + 8,
    borderRadius: Spacing.radius.small,
    backgroundColor: Colors.card,
    justifyContent: "center",
    alignItems: "center",
  },
  durationBadge: {
    position: "absolute",
    bottom: Spacing.padding.small,
    right: Spacing.padding.small,
    backgroundColor: Colors.overlay,
    borderRadius: Spacing.radius.xs,
    paddingHorizontal: Spacing.padding.xs,
    paddingVertical: 1,
  },
  durationText: {
    color: Colors.primary,
    fontSize: Typography.fontSize.small,
    fontWeight: "600",
  },
  reminderTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.gap.xs,
    flexShrink: 0,
  },
  reminderText: {
    fontSize: Typography.fontSize.small,
    color: Colors.gold,
    fontWeight: "600",
  },
  // shared
  dimmed: {
    opacity: 0.55,
  },
  thumbFallback: {
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    gap: Spacing.gap.xs,
    overflow: "hidden",
  },
  title: {
    fontSize: Typography.fontSize.medium,
    fontFamily: Typography.fontFamily,
    color: Colors.primary,
    lineHeight: Typography.fontLineHeight.medium,
  },
  source: {
    fontSize: Typography.fontSize.small,
    fontFamily: Typography.fontFamily,
    color: Colors.secondary,
  },
  meta: {
    fontSize: Typography.fontSize.small,
    fontFamily: Typography.fontFamily,
    color: Colors.tertiary,
    flexShrink: 0,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: Spacing.gap.xs,
    flexShrink: 1,
  },
  groupDot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
  groupLabel: {
    fontSize: Typography.fontSize.small,
    fontWeight: "600",
    flexShrink: 1,
    minWidth: 0,
    color: Colors.tertiary,
    textTransform: "capitalize",
  },
});
