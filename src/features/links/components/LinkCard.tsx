import { Colors, Spacing, Typography } from "@/theme/theme";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { getBrandInfo } from "@/lib/getBrandInfo";
import { useState } from "react";

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
};

type Props = {
  item: LinkItem;
  variant?: "card" | "list";
};

const DOT_SIZE = 7;

export const LinkCard = ({ item, variant }: Props) => {
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

  if (variant === "card") {
    return (
      <View style={styles.cardContainer}>
        {/* full-width thumbnail */}
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
        {/* content */}
        <View style={styles.cardContent}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.source} numberOfLines={1}>
            {item.source}
          </Text>
          <Text style={styles.meta}>{item.savedAt}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
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
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        {item.groupName && (
          <View style={styles.groupRow}>
            <View
              style={[styles.groupDot, { backgroundColor: item.groupColor }]}
            />
            <Text style={styles.groupLabel}>{item.groupName}</Text>
          </View>
        )}
        <Text style={styles.source} numberOfLines={1}>
          {item.source}
        </Text>
        <Text style={styles.meta}>{item.savedAt}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // list variant
  listContainer: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    borderRadius: Spacing.radius.medium,
    padding: Spacing.padding.medium,
    gap: Spacing.gap.medium,
  },
  listThumb: {
    width: 80,
    height: 72,
    borderRadius: Spacing.radius.small,
    backgroundColor: Colors.input,
    flexShrink: 0,
  },
  // card variant
  cardContainer: {
    backgroundColor: Colors.card,
    borderRadius: Spacing.radius.medium,
    overflow: "hidden",
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
  // shared
  thumbFallback: {
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
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
  },
  groupRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.gap.xs,
  },
  groupDot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: Spacing.radius.xs,
  },
  groupLabel: {
    fontSize: Typography.fontSize.small,
    color: Colors.secondary,
  },
});
