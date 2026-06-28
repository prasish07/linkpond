import { useEffect, useState } from "react";
import {
  Animated,
  DimensionValue,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Colors, Spacing } from "@/theme/theme";

const PULSE_MIN = 0.3;
const PULSE_MAX = 0.7;
const PULSE_DURATION = 700;

type Props = {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * A single pulsing placeholder block. Opacity loops between PULSE_MIN and
 * PULSE_MAX on the native driver, so the shimmer runs on the UI thread and
 * never stutters even while the JS thread is busy loading data.
 */
export const Skeleton = ({
  width = "100%",
  height = 12,
  borderRadius = Spacing.radius.xs,
  style,
}: Props) => {
  const [opacity] = useState(() => new Animated.Value(PULSE_MIN));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: PULSE_MAX,
          duration: PULSE_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: PULSE_MIN,
          duration: PULSE_DURATION,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        { width, height, borderRadius, backgroundColor: Colors.input, opacity },
        style,
      ]}
    />
  );
};
