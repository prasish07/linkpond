import { View, Text, StyleSheet } from "react-native";
import { Tag } from "@/features/tags/types";
import { Colors, Spacing, Typography } from "@/theme/theme";

type Props = {
  tags: Tag[];
  maxVisible?: number;
};

/** Inline colored #hashtags, shown in a link's meta line. */
export const TagList = ({ tags, maxVisible = 3 }: Props) => {
  if (!tags.length) return null;

  const visible = tags.slice(0, maxVisible);
  const overflow = tags.length - maxVisible;

  return (
    <View style={styles.row}>
      {visible.map((tag) => (
        <Text
          key={tag.id}
          style={[styles.tag, { color: tag.color }]}
          numberOfLines={1}
        >
          #{tag.name}
        </Text>
      ))}
      {overflow > 0 && <Text style={styles.overflow}>+{overflow}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: Spacing.gap.small,
    flexShrink: 1,
  },
  tag: {
    fontSize: Typography.fontSize.small,
    fontWeight: "600",
    flexShrink: 1,
  },
  overflow: {
    fontSize: Typography.fontSize.small,
    color: Colors.tertiary,
    fontWeight: "600",
  },
});
