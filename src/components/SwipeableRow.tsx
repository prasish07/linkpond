import { ReactNode, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { Touchable } from "@/components/Touchable";
import { Colors, Spacing, Typography } from "@/theme/theme";

const ACTION_WIDTH = 76;

export type SwipeAction = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
};

type Props = {
  children: ReactNode;
  actions: SwipeAction[];
};

/**
 * Wraps a row so dragging it left reveals one or more action buttons.
 * Used for swipe-to-archive/delete on lists and swipe-to-restore on the
 * archive view.
 */
export const SwipeableRow = ({ children, actions }: Props) => {
  const ref = useRef<Swipeable>(null);

  const renderRightActions = () => (
    <View style={styles.actions}>
      {actions.map((action) => (
        <Touchable
          key={action.label}
          style={[styles.action, { backgroundColor: action.color }]}
          onPress={() => {
            ref.current?.close();
            action.onPress();
          }}
        >
          <Ionicons name={action.icon} size={20} color={Colors.body} />
          <Text style={styles.actionText}>{action.label}</Text>
        </Touchable>
      ))}
    </View>
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
  actions: {
    flexDirection: "row",
    gap: Spacing.gap.small,
    paddingLeft: Spacing.gap.small,
  },
  action: {
    width: ACTION_WIDTH,
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
