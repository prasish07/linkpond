import { ReactNode, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { Touchable } from "@/components/Touchable";
import { Colors, Spacing, Typography } from "@/theme/theme";

const ACTION_WIDTH = 84;

type Props = {
  children: ReactNode;
  actionLabel: string;
  actionIcon: keyof typeof Ionicons.glyphMap;
  actionColor: string;
  onAction: () => void;
};

/**
 * Wraps a row so dragging it left reveals a single action button.
 * Used for swipe-to-archive on lists and swipe-to-restore on the archive view.
 */
export const SwipeableRow = ({
  children,
  actionLabel,
  actionIcon,
  actionColor,
  onAction,
}: Props) => {
  const ref = useRef<Swipeable>(null);

  const renderRightActions = () => (
    <Touchable
      style={[styles.action, { backgroundColor: actionColor }]}
      onPress={() => {
        ref.current?.close();
        onAction();
      }}
    >
      <Ionicons name={actionIcon} size={20} color={Colors.body} />
      <Text style={styles.actionText}>{actionLabel}</Text>
    </Touchable>
  );

  return (
    <Swipeable
      ref={ref}
      renderRightActions={renderRightActions}
      overshootRight={false}
      friction={2}
      rightThreshold={ACTION_WIDTH / 2}
    >
      <View>{children}</View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  action: {
    width: ACTION_WIDTH,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.gap.xs,
    borderRadius: Spacing.radius.medium,
  },
  actionText: {
    color: Colors.body,
    fontSize: Typography.fontSize.small,
    fontWeight: "700",
  },
});
