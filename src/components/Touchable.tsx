import { ReactNode } from "react";
import {
  Pressable,
  PressableProps,
  Platform,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Colors } from "@/theme/theme";

const DEFAULT_ACTIVE_OPACITY = 0.7;

type Props = Omit<PressableProps, "style"> & {
  style?: StyleProp<ViewStyle>;
  /** accepted for drop-in parity with TouchableOpacity; used as the iOS press fallback */
  activeOpacity?: number;
  rippleColor?: string;
  rippleBorderless?: boolean;
  children?: ReactNode;
};

/**
 * Drop-in replacement for TouchableOpacity that uses a native Android ripple
 * and falls back to an opacity dim on iOS. Centralizes press feedback so every
 * button in the app feels the same.
 */
export const Touchable = ({
  style,
  activeOpacity = DEFAULT_ACTIVE_OPACITY,
  rippleColor = Colors.ripple,
  rippleBorderless = false,
  children,
  ...rest
}: Props) => {
  return (
    <Pressable
      android_ripple={{ color: rippleColor, borderless: rippleBorderless }}
      style={({ pressed }) => [
        style,
        Platform.OS !== "android" && pressed
          ? { opacity: activeOpacity }
          : null,
      ]}
      {...rest}
    >
      {children}
    </Pressable>
  );
};
