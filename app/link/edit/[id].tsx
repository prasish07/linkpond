import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, Typography } from "@/theme/theme";
import {
  useLinkById,
  useUpdateLink,
} from "@/features/links/hooks/useLinksHooks";
import { useGroups } from "@/features/groups/hooks/useGroupsHooks";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { useLocalSearchParams, useRouter } from "expo-router";

const CLOSE_ICON_SIZE = 22;
const CLOSE_BTN_SIZE = 28;
const NOTE_INPUT_HEIGHT = 80;
const DOT_SIZE = 7;
const SECTION_ICON_SIZE = 14;
const LABEL_LETTER_SPACING = 0.5;
const SNAP_POINTS = ["75%"];

export default function EditLinkScreen() {
  const router = useRouter();
  const sheetRef = useRef<BottomSheet>(null);
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: link } = useLinkById(id);
  const { data: groups = [] } = useGroups();
  const { mutate: updateLink, isPending } = useUpdateLink();

  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(
    undefined
  );

  // prefill once when the link is available in the cache
  const didPrefill = useRef(false);
  useEffect(() => {
    if (link && !didPrefill.current) {
      setTitle(link.title ?? "");
      setNote(link.note ?? "");
      setSelectedGroupId(link.group_id ?? undefined);
      didPrefill.current = true;
    }
  }, [link]);

  const handleClose = () => sheetRef.current?.close();

  const handleSave = () => {
    if (!id) return;
    updateLink({
      id,
      title: title.trim(),
      note: note.trim(),
      group_id: selectedGroupId,
    });
  };

  return (
    <View style={styles.overlay}>
      <BottomSheet
        ref={sheetRef}
        snapPoints={SNAP_POINTS}
        enableDynamicSizing={false}
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
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
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Edit link</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Ionicons
                name="close"
                size={CLOSE_ICON_SIZE}
                color={Colors.secondary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.urlRow}>
            <Ionicons
              name="link-outline"
              size={SECTION_ICON_SIZE}
              color={Colors.tertiary}
            />
            <Text style={styles.urlText} numberOfLines={1}>
              {link?.url ?? ""}
            </Text>
          </View>

          <View style={styles.sectionLabelRow}>
            <Ionicons
              name="text-outline"
              size={SECTION_ICON_SIZE}
              color={Colors.secondary}
            />
            <Text style={styles.label}>TITLE</Text>
          </View>
          <BottomSheetTextInput
            placeholder="Link title"
            placeholderTextColor={Colors.tertiary}
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          <View style={styles.sectionLabelRow}>
            <Ionicons
              name="bookmark-outline"
              size={SECTION_ICON_SIZE}
              color={Colors.secondary}
            />
            <Text style={styles.label}>NOTE</Text>
          </View>
          <BottomSheetTextInput
            placeholder="Why are you saving this?"
            placeholderTextColor={Colors.tertiary}
            value={note}
            onChangeText={setNote}
            style={[styles.input, styles.noteInput]}
            multiline
            numberOfLines={3}
          />

          {groups.length > 0 && (
            <>
              <View style={styles.sectionLabelRow}>
                <Ionicons
                  name="folder-outline"
                  size={SECTION_ICON_SIZE}
                  color={Colors.secondary}
                />
                <Text style={styles.label}>GROUP</Text>
              </View>
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

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSave}
              disabled={isPending}
            >
              <Text style={styles.saveBtnText}>
                {isPending ? "Saving…" : "Save changes"}
              </Text>
            </TouchableOpacity>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: Colors.scrim },
  sheetBg: { backgroundColor: Colors.card },
  handle: { backgroundColor: Colors.tertiary },
  container: { padding: Spacing.padding.large, gap: Spacing.gap.medium },
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
  closeBtn: {
    width: CLOSE_BTN_SIZE,
    height: CLOSE_BTN_SIZE,
    borderRadius: CLOSE_BTN_SIZE / 2,
    backgroundColor: Colors.input,
    justifyContent: "center",
    alignItems: "center",
  },
  urlRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.gap.small,
    backgroundColor: Colors.input,
    borderRadius: Spacing.radius.medium,
    paddingHorizontal: Spacing.padding.medium,
    paddingVertical: Spacing.padding.medium,
  },
  urlText: {
    flex: 1,
    color: Colors.tertiary,
    fontSize: Typography.fontSize.small,
  },
  sectionLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.gap.xs,
  },
  label: {
    color: Colors.secondary,
    fontSize: Typography.fontSize.small,
    fontWeight: "600",
    letterSpacing: LABEL_LETTER_SPACING,
  },
  input: {
    backgroundColor: Colors.input,
    color: Colors.primary,
    padding: Spacing.padding.medium,
    borderRadius: Spacing.radius.medium,
    fontSize: Typography.fontSize.medium,
  },
  noteInput: { height: NOTE_INPUT_HEIGHT, textAlignVertical: "top" },
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
  groupDot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: Spacing.radius.xs,
  },
  footer: {
    flexDirection: "row",
    gap: Spacing.gap.medium,
    marginTop: Spacing.gap.medium,
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.input,
    padding: Spacing.padding.medium,
    borderRadius: Spacing.radius.medium,
    alignItems: "center",
  },
  cancelBtnText: {
    color: Colors.secondary,
    fontWeight: "700",
    fontSize: Typography.fontSize.medium,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: Colors.gold,
    padding: Spacing.padding.medium,
    borderRadius: Spacing.radius.medium,
    alignItems: "center",
  },
  saveBtnText: {
    color: Colors.body,
    fontWeight: "700",
    fontSize: Typography.fontSize.medium,
  },
});
