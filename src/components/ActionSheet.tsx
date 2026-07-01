import { useEffect, useState } from "react";
import { Modal, View, Text, StyleSheet, Pressable } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Spacing, Typography } from "@/theme/theme";
import { Touchable } from "@/components/Touchable";

const HANDLE_WIDTH = 36;
const HANDLE_HEIGHT = 4;
const ACTION_ICON_SIZE = 20;
const ANIM_DURATION = 220;
const SHEET_HEIGHT_FALLBACK = 500;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type SheetAction = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  destructive?: boolean;
  onPress: () => void;
};

type Props = {
  visible: boolean;
  title?: string;
  actions: SheetAction[];
  onClose: () => void;
};

/**
 * Themed bottom action sheet with a fading backdrop + sliding sheet.
 * Uses a native Modal so it layers above the gorhom bottom sheets (Add/Edit)
 * without nesting-provider gymnastics; the enter/exit is driven by Reanimated
 * (Modal's own animation slides the dim too, which looks wrong).
 */
export const ActionSheet = ({ visible, title, actions, onClose }: Props) => {
  const insets = useSafeAreaInsets();
  // keep the Modal mounted through the exit animation
  const [mounted, setMounted] = useState(visible);
  const [sheetHeight, setSheetHeight] = useState(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // mount immediately, then animate in — the exit animation needs the
      // Modal to stay mounted, so this "mount then animate" is intentional.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMounted(true);
      progress.value = withTiming(1, {
        duration: ANIM_DURATION,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      progress.value = withTiming(
        0,
        { duration: ANIM_DURATION, easing: Easing.in(Easing.cubic) },
        (finished) => {
          if (finished) runOnJS(setMounted)(false);
        }
      );
    }
  }, [visible, progress]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY:
          (1 - progress.value) * (sheetHeight || SHEET_HEIGHT_FALLBACK),
      },
    ],
  }));

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <AnimatedPressable
          style={[styles.backdrop, backdropStyle]}
          onPress={onClose}
        />
        <Animated.View style={sheetStyle}>
          {/* no-op onPress claims the touch so backdrop taps don't leak through */}
          <Pressable
            style={[
              styles.sheet,
              { paddingBottom: insets.bottom + Spacing.padding.medium },
            ]}
            onPress={() => {}}
            onLayout={(e) => setSheetHeight(e.nativeEvent.layout.height)}
          >
            <View style={styles.handle} />
            {title && <Text style={styles.title}>{title}</Text>}

            {actions.map((action) => (
              <Touchable
                key={action.label}
                style={styles.action}
                onPress={() => {
                  onClose();
                  action.onPress();
                }}
              >
                <Ionicons
                  name={action.icon}
                  size={ACTION_ICON_SIZE}
                  color={
                    action.destructive ? Colors.destructive : Colors.primary
                  }
                />
                <Text
                  style={[
                    styles.actionLabel,
                    action.destructive && { color: Colors.destructive },
                  ]}
                >
                  {action.label}
                </Text>
              </Touchable>
            ))}

            <Touchable style={styles.cancel} onPress={onClose}>
              <Text style={styles.cancelLabel}>Cancel</Text>
            </Touchable>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.scrim,
  },
  sheet: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: Spacing.radius.large,
    borderTopRightRadius: Spacing.radius.large,
    paddingHorizontal: Spacing.padding.large,
    paddingTop: Spacing.padding.small,
  },
  handle: {
    alignSelf: "center",
    width: HANDLE_WIDTH,
    height: HANDLE_HEIGHT,
    borderRadius: Spacing.radius.xs,
    backgroundColor: Colors.tertiary,
    marginBottom: Spacing.gap.medium,
  },
  title: {
    color: Colors.secondary,
    fontSize: Typography.fontSize.small,
    fontFamily: Typography.fontFamily,
    fontWeight: "600",
    paddingVertical: Spacing.padding.small,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.gap.medium,
    paddingVertical: Spacing.padding.medium,
    paddingHorizontal: Spacing.padding.small,
    borderRadius: Spacing.radius.medium,
    overflow: "hidden",
  },
  actionLabel: {
    color: Colors.primary,
    fontSize: Typography.fontSize.medium,
    fontFamily: Typography.fontFamily,
  },
  cancel: {
    marginTop: Spacing.gap.small,
    paddingVertical: Spacing.padding.medium,
    borderRadius: Spacing.radius.medium,
    backgroundColor: Colors.input,
    alignItems: "center",
    overflow: "hidden",
  },
  cancelLabel: {
    color: Colors.secondary,
    fontSize: Typography.fontSize.medium,
    fontWeight: "700",
  },
});
