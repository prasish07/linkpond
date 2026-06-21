import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import { useLocalSearchParams, useFocusEffect } from "expo-router";
import { Image } from "expo-image";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, Typography } from "@/theme/theme";
import { useCallback, useState } from "react";
import { useLinkById } from "@/features/links/hooks/useLinksHooks";
import { getBrandInfo } from "@/lib/getBrandInfo";

export default function LinkDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: link, isLoading, refetch } = useLinkById(id);

  const [descExpanded, setDescExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);

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
          <Ionicons
            name="document-text-outline"
            size={16}
            color={Colors.secondary}
          />
          <Text style={styles.noteText}>{link.note}</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.openBtn}
        onPress={() => Linking.openURL(link.url)}
        activeOpacity={0.7}
      >
        <Ionicons name="open-outline" size={18} color={Colors.body} />
        <Text style={styles.openBtnText}>Open original</Text>
      </TouchableOpacity>
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
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.gap.small,
    padding: Spacing.padding.large,
    paddingBottom: 0,
  },
  favicon: { width: 16, height: 16, borderRadius: 4 },
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
    flexDirection: "row",
    gap: Spacing.gap.small,
    backgroundColor: Colors.card,
    margin: Spacing.padding.large,
    padding: Spacing.padding.medium,
    borderRadius: Spacing.radius.medium,
  },
  noteText: { color: Colors.secondary, flex: 1 },
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
});
