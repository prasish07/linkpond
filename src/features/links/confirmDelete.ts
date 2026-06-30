import { Alert } from "react-native";

/** Shared "Delete link?" confirmation used by swipe actions and the detail screen. */
export const confirmDeleteLink = (onConfirm: () => void) => {
  Alert.alert("Delete link?", "This can't be undone.", [
    { text: "Cancel", style: "cancel" },
    { text: "Delete", style: "destructive", onPress: onConfirm },
  ]);
};
