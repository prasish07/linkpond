import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  ReactNode,
} from "react";
import { Animated, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Spacing, Typography, Shadow } from "@/theme/theme";

type ShowToast = (message: string) => void;

const ToastContext = createContext<ShowToast>(() => {});
export const useToast = () => useContext(ToastContext);

const VISIBLE_MS = 2000;
const ANIM_MS = 220;
const OFFSET_FROM_BOTTOM = 90;
const ENTER_TRANSLATE = 20;

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState<string | null>(null);
  const [opacity] = useState(() => new Animated.Value(0));
  const [translateY] = useState(() => new Animated.Value(ENTER_TRANSLATE));
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback<ShowToast>(
    (msg) => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      setMessage(msg);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: ANIM_MS,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: ANIM_MS,
          useNativeDriver: true,
        }),
      ]).start();

      hideTimer.current = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: ANIM_MS,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: ENTER_TRANSLATE,
            duration: ANIM_MS,
            useNativeDriver: true,
          }),
        ]).start(() => setMessage(null));
      }, VISIBLE_MS);
    },
    [opacity, translateY]
  );

  return (
    <ToastContext.Provider value={show}>
      {children}
      {message && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.wrap,
            {
              bottom: insets.bottom + OFFSET_FROM_BOTTOM,
              opacity,
              transform: [{ translateY }],
            },
          ]}
        >
          <Animated.View style={styles.toast}>
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={Colors.confirm}
            />
            <Text style={styles.text}>{message}</Text>
          </Animated.View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.gap.small,
    backgroundColor: Colors.toastBg,
    paddingHorizontal: Spacing.padding.large,
    paddingVertical: Spacing.padding.medium,
    borderRadius: Spacing.radius.xlarge,
    ...Shadow.fab,
  },
  text: {
    color: Colors.primary,
    fontSize: Typography.fontSize.medium,
    fontWeight: "600",
  },
});
