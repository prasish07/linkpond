import { View, Text, StyleSheet } from "react-native";
import { Tag } from "@/features/tags/types";
import { Spacing, Typography } from "@/theme/theme";

type Props = {
  tags: Tag[];
  maxVisible?: number;
};

export const TagChips = ({ tags, maxVisible = 3 }: Props) => {
  if (!tags.length) return null;

  const visible = tags.slice(0, maxVisible);
  const overflow = tags.length - maxVisible;

  return (
    <View style={styles.row}>
      {visible.map((tag) => (
        <View key={tag.id} style={[styles.chip, { backgroundColor: tag.color + "33", borderColor: tag.color + "66" }]}>
          <Text style={[styles.label, { color: tag.color }]} numberOfLines={1}>
            #{tag.name}
          </Text>
        </View>
      ))}
      {overflow > 0 && (
        <Text style={styles.overflow}>+{overflow}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.gap.xs,
    marginTop: Spacing.gap.xs,
  },
  chip: {
    borderWidth: 1,
    borderRadius: Spacing.radius.xs,
    paddingHorizontal: Spacing.padding.small,
    paddingVertical: 2,
  },
  label: {
    fontSize: Typography.fontSize.small,
    fontWeight: "600",
  },
  overflow: {
    fontSize: Typography.fontSize.small,
    color: "#A8A294",
    alignSelf: "center",
  },
});
