import { Alert } from "react-native";

/** Shared "Delete tag?" confirmation used by the tag picker and manage screen. */
export const confirmDeleteTag = (name: string, onConfirm: () => void) => {
  Alert.alert(
    "Delete tag?",
    `"#${name}" will be removed from all links. This can't be undone.`,
    [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: onConfirm },
    ]
  );
};
