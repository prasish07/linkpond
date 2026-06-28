import { View, StyleSheet } from "react-native";
import { Colors, Spacing } from "@/theme/theme";
import { Skeleton } from "@/components/Skeleton";

const ROW_COUNT = 5;
const THUMB_SIZE = 72;
const THUMB_WIDTH = 80;

const SkeletonRow = () => (
  <View style={styles.row}>
    <Skeleton
      width={THUMB_WIDTH}
      height={THUMB_SIZE}
      borderRadius={Spacing.radius.small}
    />
    <View style={styles.lines}>
      <Skeleton width="80%" height={14} />
      <Skeleton width="45%" height={12} />
      <Skeleton width="30%" height={10} />
    </View>
  </View>
);

type Props = {
  count?: number;
};

/** Placeholder list shown while links load — mirrors the LinkCard list layout. */
export const LinkListSkeleton = ({ count = ROW_COUNT }: Props) => (
  <View style={styles.container}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonRow key={i} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: { padding: Spacing.padding.large, gap: Spacing.gap.medium },
  row: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    borderRadius: Spacing.radius.medium,
    padding: Spacing.padding.medium,
    gap: Spacing.gap.medium,
  },
  lines: {
    flex: 1,
    justifyContent: "center",
    gap: Spacing.gap.small,
  },
});
