import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Touchable } from "@/components/Touchable";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, Typography, GroupColors } from "@/theme/theme";
import {
  useAddGroup,
  useUpdateGroup,
  useGroups,
} from "@/features/groups/hooks/useGroupsHooks";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { useLocalSearchParams, useRouter } from "expo-router";

const ICONS: (keyof typeof Ionicons.glyphMap)[] = [
  "bookmark",
  "folder",
  "star",
  "heart",
  "briefcase",
  "camera",
  "cart",
  "code",
  "game-controller",
  "globe",
  "home",
  "image",
  "library",
  "link",
  "map",
  "mic",
  "moon",
  "newspaper",
  "person",
  "pizza",
  "planet",
  "rocket",
  "school",
  "settings",
  "storefront",
  "terminal",
  "trophy",
  "tv",
  "wallet",
];

const CLOSE_ICON_SIZE = 22;
const CLOSE_BTN_SIZE = 28;
const SWATCH_SIZE = 32;
const ICON_BTN_SIZE = 44;
const SECTION_ICON_SIZE = 14;
const LABEL_LETTER_SPACING = 0.5;
const SNAP_POINTS = ["82%"];

const CreateGroupScreen = () => {
  const router = useRouter();
  const sheetRef = useRef<BottomSheet>(null);
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = !!id;

  const { mutate: addGroup, isPending: isAdding } = useAddGroup();
  const { mutate: updateGroup, isPending: isUpdating } = useUpdateGroup();
  const { data: groups = [] } = useGroups();
  const existing = groups.find((g) => g.id === id);

  const [name, setName] = useState("");
  const [color, setColor] = useState(GroupColors[0]);
  const [icon, setIcon] = useState<keyof typeof Ionicons.glyphMap>("folder");

  // prefill once when editing, after the group is found in the cache
  const didPrefill = useRef(false);
  useEffect(() => {
    if (isEdit && existing && !didPrefill.current) {
      setName(existing.name);
      setColor(existing.color);
      setIcon(existing.icon as keyof typeof Ionicons.glyphMap);
      didPrefill.current = true;
    }
  }, [isEdit, existing]);

  const isPending = isAdding || isUpdating;

  const handleSave = () => {
    if (!name.trim()) {
      alert("Name is required.");
      return;
    }
    if (isEdit && id) {
      updateGroup({ id, name: name.trim(), color, icon: icon as string });
    } else {
      addGroup({ name: name.trim(), color, icon: icon as string });
    }
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
            <Text style={styles.headerTitle}>
              {isEdit ? "Edit group" : "New group"}
            </Text>
            <Touchable
              onPress={() => sheetRef.current?.close()}
              style={styles.closeBtn}
            >
              <Ionicons
                name="close"
                size={CLOSE_ICON_SIZE}
                color={Colors.secondary}
              />
            </Touchable>
          </View>

          <View style={styles.sectionLabelRow}>
            <Ionicons
              name="folder-outline"
              size={SECTION_ICON_SIZE}
              color={Colors.secondary}
            />
            <Text style={styles.label}>NAME</Text>
          </View>
          <BottomSheetTextInput
            placeholder="Group name"
            placeholderTextColor={Colors.tertiary}
            value={name}
            onChangeText={setName}
            style={styles.input}
            autoCapitalize="words"
          />

          <View style={styles.sectionLabelRow}>
            <Ionicons
              name="color-palette-outline"
              size={SECTION_ICON_SIZE}
              color={Colors.secondary}
            />
            <Text style={styles.label}>COLOR</Text>
          </View>
          <View style={styles.swatches}>
            {GroupColors.map((c) => (
              <Touchable
                key={c}
                style={[
                  styles.swatch,
                  { backgroundColor: c },
                  color === c && styles.swatchSelected,
                ]}
                onPress={() => setColor(c)}
              />
            ))}
          </View>

          <View style={styles.sectionLabelRow}>
            <Ionicons
              name="apps-outline"
              size={SECTION_ICON_SIZE}
              color={Colors.secondary}
            />
            <Text style={styles.label}>ICON</Text>
          </View>
          <View style={styles.iconGrid}>
            {ICONS.map((item) => (
              <Touchable
                key={item}
                style={[
                  styles.iconBtn,
                  icon === item && { backgroundColor: color },
                ]}
                onPress={() => setIcon(item)}
              >
                <Ionicons
                  name={item}
                  size={24}
                  color={icon === item ? Colors.body : Colors.secondary}
                />
              </Touchable>
            ))}
          </View>

          <View style={styles.footer}>
            <Touchable
              style={styles.cancelBtn}
              onPress={() => sheetRef.current?.close()}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Touchable>
            <Touchable
              style={[styles.saveBtn, { backgroundColor: color }]}
              onPress={handleSave}
              disabled={isPending}
            >
              <Text style={styles.saveBtnText}>
                {isPending
                  ? "Saving…"
                  : isEdit
                    ? "Save changes"
                    : "Create group"}
              </Text>
            </Touchable>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
};

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
  closeBtn: {
    width: CLOSE_BTN_SIZE,
    height: CLOSE_BTN_SIZE,
    borderRadius: CLOSE_BTN_SIZE / 2,
    backgroundColor: Colors.input,
    justifyContent: "center",
    alignItems: "center",
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
  swatches: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.gap.medium,
  },
  swatch: {
    width: SWATCH_SIZE,
    height: SWATCH_SIZE,
    borderRadius: SWATCH_SIZE / 2,
  },
  swatchSelected: {
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.gap.small,
  },
  iconBtn: {
    width: ICON_BTN_SIZE,
    height: ICON_BTN_SIZE,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Spacing.radius.small,
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

export default CreateGroupScreen;
