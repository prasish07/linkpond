import { Colors, Spacing, Typography } from "@/theme/theme";
import { useAddLink } from "../hooks/useLinksHooks";
import { StyleSheet, Text, View } from "react-native";
import { Touchable } from "@/components/Touchable";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  url: string;
  onDismiss: () => void;
};

const ICON_SIZE = 14;

export function ClipboardBanner({ url, onDismiss }: Props) {
  const { mutate: addLink, isPending } = useAddLink({
    onSuccess: onDismiss,
  });

  const domain = (() => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  })();

  const handleSave = () => {
    addLink({ url, title: "", note: "", group_id: undefined });
  };

  return (
    <View style={styles.container}>
      <Ionicons
        name="clipboard-outline"
        size={ICON_SIZE}
        color={Colors.secondary}
      />

      <Text style={styles.domain} numberOfLines={1}>
        {domain}
      </Text>
      <Touchable
        style={styles.saveBtn}
        onPress={handleSave}
        disabled={isPending}
      >
        <Text style={styles.saveBtnText}>{isPending ? "..." : "Save"}</Text>
      </Touchable>
      <Touchable onPress={onDismiss} hitSlop={8}>
        <Ionicons name="close" size={ICON_SIZE} color={Colors.tertiary} />
      </Touchable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.gap.small,
    backgroundColor: Colors.card,
    borderRadius: Spacing.radius.medium,
    paddingHorizontal: Spacing.padding.medium,
    paddingVertical: Spacing.padding.small,
    marginTop: Spacing.gap.medium,
    borderWidth: 1,
    borderColor: Colors.input,
  },
  domain: {
    flex: 1,
    color: Colors.secondary,
    fontSize: Typography.fontSize.small,
  },
  saveBtn: {
    backgroundColor: Colors.gold,
    paddingHorizontal: Spacing.padding.medium,
    paddingVertical: Spacing.padding.xs,
    borderRadius: Spacing.radius.small,
  },
  saveBtnText: {
    color: Colors.body,
    fontSize: Typography.fontSize.small,
    fontWeight: "700",
  },
});
