import { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, Typography } from "@/theme/theme";
import { useAddLink } from "@/features/links/hooks/useLinksHooks";
import { useGroups } from "@/features/groups/hooks/useGroupsHooks";
import { useRouter } from "expo-router";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { ScrollView } from "react-native-gesture-handler";

const CLOSE_ICON_SIZE = 22;
const NOTE_INPUT_HEIGHT = 80;
const DOT_SIZE = 7;
const LABEL_LETTER_SPACING = 0.5;

export default function AddScreen() {
  const router = useRouter();
  const sheetRef = useRef<BottomSheet>(null);
  const { mutate: addLink, isPending } = useAddLink();
  const { data: groups = [] } = useGroups();

  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(
    undefined
  );

  const handleClose = () => sheetRef.current?.close();

  const handleAdd = () => {
    if (!url.trim()) {
      alert("URL is required.");
      return;
    }
    let normalizedUrl = url.trim();
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = "https://" + normalizedUrl;
    }
    addLink({
      url: normalizedUrl,
      title: title.trim(),
      note: note.trim(),
      group_id: selectedGroupId,
    });
  };

  return (
    <View style={styles.overlay}>
      <BottomSheet
        ref={sheetRef}
        snapPoints={["50%", "90%"]} // closed-ish at 50%, tall at 90%
        enableDynamicSizing={false} // respect the snap points
        keyboardBehavior="extend" // keyboard opens → jump to90% (above keyboard)
        keyboardBlurBehavior="restore" // keyboard closes → back to 50%
        android_keyboardInputMode="adjustResize"
        enablePanDownToClose
        onClose={() => router.back()}
        backgroundStyle={styles.sheetBg}
        handleIndicatorStyle={styles.handle}
      >
        <BottomSheetScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Add a link</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons
                name="close"
                size={CLOSE_ICON_SIZE}
                color={Colors.secondary}
              />
            </TouchableOpacity>
          </View>

          <BottomSheetTextInput
            placeholder="URL *"
            placeholderTextColor={Colors.tertiary}
            value={url}
            onChangeText={setUrl}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="url"
          />
          <BottomSheetTextInput
            placeholder="Title (optional)"
            placeholderTextColor={Colors.tertiary}
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          <BottomSheetTextInput
            placeholder="Note (optional)"
            placeholderTextColor={Colors.tertiary}
            value={note}
            onChangeText={setNote}
            style={[styles.input, styles.noteInput]}
            multiline
            numberOfLines={3}
          />
          {groups.length > 0 && (
            <>
              <Text style={styles.label}>GROUP</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.groupRow}
                keyboardShouldPersistTaps="handled"
              >
                <TouchableOpacity
                  style={[
                    styles.groupChip,
                    !selectedGroupId && styles.groupChipSelected,
                  ]}
                  onPress={() => setSelectedGroupId(undefined)}
                >
                  <Text
                    style={[
                      styles.groupChipText,
                      !selectedGroupId && styles.groupChipTextSelected,
                    ]}
                  >
                    None
                  </Text>
                </TouchableOpacity>
                {groups.map((g) => (
                  <TouchableOpacity
                    key={g.id}
                    style={[
                      styles.groupChip,
                      selectedGroupId === g.id && {
                        backgroundColor: g.color,
                        borderColor: g.color,
                      },
                    ]}
                    onPress={() => setSelectedGroupId(g.id)}
                  >
                    <View
                      style={[
                        styles.groupDot,
                        {
                          backgroundColor:
                            selectedGroupId === g.id ? Colors.body : g.color,
                        },
                      ]}
                    />
                    <Text
                      style={[
                        styles.groupChipText,
                        selectedGroupId === g.id && { color: Colors.body },
                      ]}
                    >
                      {g.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}

          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleAdd}
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator color={Colors.body} />
            ) : (
              <Text style={styles.saveBtnText}>Save link</Text>
            )}
          </TouchableOpacity>
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.scrim,
  },
  sheetBg: {
    backgroundColor: Colors.card,
  },
  handle: {
    backgroundColor: Colors.tertiary,
  },
  container: {
    padding: Spacing.padding.large,
    gap: Spacing.gap.medium,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.gap.small,
  },
  headerTitle: {
    color: Colors.primary,
    fontSize: Typography.fontSize.large,
    fontWeight: "700",
  },
  input: {
    backgroundColor: Colors.input,
    color: Colors.primary,
    padding: Spacing.padding.medium,
    borderRadius: Spacing.radius.medium,
    fontSize: Typography.fontSize.medium,
  },
  noteInput: { height: NOTE_INPUT_HEIGHT, textAlignVertical: "top" },
  saveBtn: {
    backgroundColor: Colors.gold,
    padding: Spacing.padding.medium,
    borderRadius: Spacing.radius.medium,
    alignItems: "center",
    marginTop: Spacing.gap.medium,
  },
  saveBtnText: {
    color: Colors.body,
    fontWeight: "700",
    fontSize: Typography.fontSize.medium,
  },
  label: {
    color: Colors.secondary,
    fontSize: Typography.fontSize.small,
    fontWeight: "600",
    letterSpacing: LABEL_LETTER_SPACING,
  },
  groupRow: { gap: Spacing.gap.small, paddingVertical: Spacing.gap.xs },
  groupChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.gap.xs,
    borderWidth: 1,
    borderColor: Colors.input,
    backgroundColor: Colors.input,
    borderRadius: Spacing.radius.xlarge,
    paddingHorizontal: Spacing.padding.medium,
    paddingVertical: Spacing.padding.small,
  },
  groupChipSelected: { borderColor: Colors.gold },
  groupChipText: {
    color: Colors.secondary,
    fontSize: Typography.fontSize.small,
  },
  groupChipTextSelected: { color: Colors.gold },
  groupDot: { width: DOT_SIZE, height: DOT_SIZE, borderRadius: Spacing.radius.xs },
});
