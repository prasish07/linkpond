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
};

type Props = {
  item: LinkItem;
};

export const LinkCard = ({ item }: Props) => {
  const [imgError, setImgError] = useState(false);

  const showFallback = !item.thumb || imgError;

  return (
    <View style={styles.card}>
      {/* left */}
      {!showFallback ? (
        <Image
          source={{ uri: item.thumb }}
          style={styles.thumb}
          contentFit="cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <View style={[styles.thumb, styles.thumbFallback]}>
          {(() => {
            const brand = getBrandInfo(item.domain);
            return brand ? (
              <FontAwesome name={brand.icon} size={32} color={brand.color} />
            ) : (
              <Ionicons name="link-outline" size={24} color={Colors.tertiary} />
            );
          })()}
        </View>
      )}

      {/* right */}
      <View style={styles.content}>
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
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    borderRadius: Spacing.radius.medium,
    padding: Spacing.padding.medium,
    gap: Spacing.gap.medium,
  },
  thumb: {
    width: 80,
    height: 72,
    borderRadius: Spacing.radius.small,
    backgroundColor: Colors.input,
    flexShrink: 0,
  },
  thumbFallback: {
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  domain: {
    fontSize: Typography.fontSize.small,
    fontFamily: Typography.fontFamily,
    color: Colors.secondary,
    textAlign: "center",
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
});
