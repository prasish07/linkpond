import { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Touchable } from "@/components/Touchable";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, Typography } from "@/theme/theme";
import { useAddLink } from "@/features/links/hooks/useLinksHooks";
import { useGroups } from "@/features/groups/hooks/useGroupsHooks";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { ScrollView } from "react-native-gesture-handler";
import { fetchPreview, LinkPreview } from "@/lib/fetchPreview";
import useDebounce from "@/lib/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useRouter, useLocalSearchParams } from "expo-router";
import { finishActivity } from "@/lib/finishActivity";

const CLOSE_ICON_SIZE = 22;
const NOTE_INPUT_HEIGHT = 80;
const DOT_SIZE = 7;
const LABEL_LETTER_SPACING = 0.5;
const HEADER_BADGE_SIZE = 28;
const BADGE_ICON_SIZE = 18;
const SECTION_ICON_SIZE = 14;
const PREVIEW_FALLBACK_ICON_SIZE = 24;

type PreviewState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "loaded"; data: LinkPreview }
  | { status: "error" };

const PREVIEW_THUMB_SIZE = 72;
const SKELETON_LINE_HEIGHT = 10;
const SNAP_IDLE = "35%";
const SNAP_ACTIVE = "60%";
const SNAP_TALL = "90%";

export default function AddScreen() {
  const router = useRouter();
  const sheetRef = useRef<BottomSheet>(null);
  const { mutate: addLink, isPending } = useAddLink({
    onSuccess: () => {
      if (initialUrl) finishActivity();
      router.back();
    },
  });
  const { data: groups = [] } = useGroups();

  const { initialUrl } = useLocalSearchParams<{ initialUrl?: string }>();

  const [url, setUrl] = useState(initialUrl ?? "");
  const [note, setNote] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(
    undefined
  );
  const debouncedUrl = useDebounce(url, 500);
  const trimmedUrl = debouncedUrl.trim();
  const normalizedUrl = trimmedUrl
    ? /^https?:\/\//i.test(trimmedUrl)
      ? trimmedUrl
      : "https://" + trimmedUrl
    : "";

  const { data: previewData, isFetching } = useQuery({
    queryKey: ["preview", normalizedUrl],
    queryFn: () => fetchPreview(normalizedUrl),
    enabled: normalizedUrl.length > 0, // don't fetch on empty URL
    staleTime: 5 * 60 * 1000, // cache previews for 5 min
  });

  const isSettled = url.trim() === trimmedUrl; // has the debounce caught up to what I typed?

  const previewState: PreviewState = !url.trim()
    ? { status: "idle" }
    : !isSettled || isFetching
      ? { status: "loading" }
      : previewData &&
          (previewData.title ||
            previewData.thumbnail_url ||
            previewData.site_name)
        ? { status: "loaded", data: previewData }
        : { status: "error" };

  // can save once the URL resolves — with a preview (loaded) or without (error/blocked)
  const canSave =
    previewState.status === "loaded" || previewState.status === "error";

  // idle hugs the minimal content; once a link is entered the sheet grows.
  // "90%" stays as the keyboard-extend ceiling in both states.
  const snapPoints = useMemo(
    () =>
      previewState.status === "idle"
        ? [SNAP_IDLE, SNAP_TALL]
        : [SNAP_ACTIVE, SNAP_TALL],
    [previewState.status]
  );

  const handleClose = () => sheetRef.current?.close();

  const handleAdd = () => {
    if (!url.trim()) {
      alert("URL is required.");
      return;
    }

    const previewTitle =
      previewState.status === "loaded" ? (previewState.data.title ?? "") : "";

    let normalizedUrl = url.trim();
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = "https://" + normalizedUrl;
    }
    addLink({
      url: normalizedUrl,
      title: previewTitle,
      note: note.trim(),
      group_id: selectedGroupId,
    });
  };

  return (
    <View style={styles.overlay}>
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints} // idle: small; entered: taller; 90% = keyboard ceiling
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
            <View style={styles.headerLeft}>
              <View style={styles.headerBadge}>
                <Ionicons
                  name="add"
                  size={BADGE_ICON_SIZE}
                  color={Colors.body}
                />
              </View>
              <Text style={styles.headerTitle}>Add a link</Text>
            </View>
            <Touchable onPress={handleClose} style={styles.closeBtn}>
              <Ionicons
                name="close"
                size={CLOSE_ICON_SIZE}
                color={Colors.secondary}
              />
            </Touchable>
          </View>

          <View style={styles.urlRow}>
            <Ionicons
              name="link-outline"
              size={SECTION_ICON_SIZE}
              color={Colors.tertiary}
            />
            <BottomSheetTextInput
              placeholder="Paste a link…"
              placeholderTextColor={Colors.tertiary}
              value={url}
              onChangeText={setUrl}
              style={styles.urlInput}
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>
          {previewState.status === "idle" && (
            <View style={styles.tryRow}>
              <Text style={styles.tryLabel}>Try:</Text>
              <Touchable
                style={styles.tryChip}
                onPress={() => setUrl("https://youtube.com/")}
              >
                <Text style={styles.tryChipText}>YouTube link</Text>
              </Touchable>
              <Touchable
                style={styles.tryChip}
                onPress={() => setUrl("https://instagram.com/")}
              >
                <Text style={styles.tryChipText}>Instagram link</Text>
              </Touchable>
            </View>
          )}
          {previewState.status === "loading" && (
            <View style={styles.previewCard}>
              <View style={styles.previewThumbFallback} />
              <View style={styles.previewBody}>
                <View style={styles.skeletonLine} />
                <View style={[styles.skeletonLine, { width: "60%" }]} />
                <View style={styles.fetchingRow}>
                  <ActivityIndicator size="small" color={Colors.tertiary} />
                  <Text style={styles.fetchingText}>Fetching preview…</Text>
                </View>
              </View>
            </View>
          )}

          {previewState.status === "loaded" && (
            <View style={styles.previewCard}>
              {previewState.data.thumbnail_url ? (
                <Image
                  source={{ uri: previewState.data.thumbnail_url }}
                  style={styles.previewThumb}
                  contentFit="cover"
                />
              ) : (
                <View
                  style={[styles.previewThumb, styles.previewThumbCentered]}
                >
                  <Ionicons
                    name="link"
                    size={PREVIEW_FALLBACK_ICON_SIZE}
                    color={Colors.tertiary}
                  />
                </View>
              )}
              <View style={styles.previewBody}>
                <Text style={styles.previewTitle} numberOfLines={2}>
                  {previewState.data.title ?? normalizedUrl}
                </Text>
                {previewState.data.site_name && (
                  <Text style={styles.previewSite} numberOfLines={1}>
                    {previewState.data.site_name}
                  </Text>
                )}
              </View>
            </View>
          )}

          {previewState.status === "error" && (
            <View style={styles.previewCard}>
              <View style={[styles.previewThumb, styles.previewThumbCentered]}>
                <Ionicons
                  name="link"
                  size={PREVIEW_FALLBACK_ICON_SIZE}
                  color={Colors.tertiary}
                />
              </View>
              <View style={styles.previewBody}>
                <Text style={styles.previewTitle} numberOfLines={1}>
                  {normalizedUrl}
                </Text>
                <Text style={styles.previewSite}>No preview available</Text>
              </View>
            </View>
          )}

          {previewState.status !== "idle" && (
            <>
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
                    <Touchable
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
                    </Touchable>
                    {groups.map((g) => (
                      <Touchable
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
                                selectedGroupId === g.id
                                  ? Colors.body
                                  : g.color,
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
                      </Touchable>
                    ))}
                  </ScrollView>
                </>
              )}
            </>
          )}

          <View style={styles.footer}>
            <Touchable style={styles.cancelBtn} onPress={handleClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Touchable>
            <Touchable
              style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}
              onPress={handleAdd}
              disabled={!canSave || isPending}
            >
              {isPending ? (
                <ActivityIndicator color={Colors.body} />
              ) : (
                <Text
                  style={[
                    styles.saveBtnText,
                    !canSave && styles.saveBtnTextDisabled,
                  ]}
                >
                  Save link
                </Text>
              )}
            </Touchable>
          </View>
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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.gap.small,
  },
  headerBadge: {
    width: HEADER_BADGE_SIZE,
    height: HEADER_BADGE_SIZE,
    borderRadius: Spacing.radius.small,
    backgroundColor: Colors.gold,
    justifyContent: "center",
    alignItems: "center",
  },
  closeBtn: {
    width: HEADER_BADGE_SIZE,
    height: HEADER_BADGE_SIZE,
    borderRadius: HEADER_BADGE_SIZE / 2,
    backgroundColor: Colors.input,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: Colors.primary,
    fontSize: Typography.fontSize.large,
    fontWeight: "700",
  },
  sectionLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.gap.xs,
  },
  input: {
    backgroundColor: Colors.input,
    color: Colors.primary,
    padding: Spacing.padding.medium,
    borderRadius: Spacing.radius.medium,
    fontSize: Typography.fontSize.medium,
  },
  urlRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.gap.small,
    backgroundColor: Colors.input,
    borderRadius: Spacing.radius.medium,
    paddingHorizontal: Spacing.padding.medium,
  },
  urlInput: {
    flex: 1,
    color: Colors.primary,
    fontSize: Typography.fontSize.medium,
    paddingVertical: Spacing.padding.medium,
  },
  noteInput: { height: NOTE_INPUT_HEIGHT, textAlignVertical: "top" },
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
  saveBtnDisabled: { backgroundColor: Colors.input },
  saveBtnText: {
    color: Colors.body,
    fontWeight: "700",
    fontSize: Typography.fontSize.medium,
  },
  saveBtnTextDisabled: { color: Colors.tertiary },
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
  groupDot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: Spacing.radius.xs,
  },
  tryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.gap.small,
    flexWrap: "wrap",
  },
  tryLabel: { color: Colors.tertiary, fontSize: Typography.fontSize.small },
  tryChip: {
    borderWidth: 1,
    borderColor: Colors.input,
    borderRadius: Spacing.radius.xlarge,
    paddingHorizontal: Spacing.padding.medium,
    paddingVertical: Spacing.padding.small,
  },
  tryChipText: { color: Colors.secondary, fontSize: Typography.fontSize.small },

  previewCard: {
    flexDirection: "row",
    gap: Spacing.gap.medium,
    alignItems: "center",
    backgroundColor: Colors.input,
    borderRadius: Spacing.radius.medium,
    padding: Spacing.padding.medium,
  },
  previewThumb: {
    width: PREVIEW_THUMB_SIZE,
    height: PREVIEW_THUMB_SIZE,
    borderRadius: Spacing.radius.small,
    backgroundColor: Colors.card,
  },
  previewThumbFallback: {
    width: PREVIEW_THUMB_SIZE,
    height: PREVIEW_THUMB_SIZE,
    borderRadius: Spacing.radius.small,
    backgroundColor: Colors.card,
  },
  previewThumbCentered: { justifyContent: "center", alignItems: "center" },
  previewBody: { flex: 1, gap: Spacing.gap.xs },
  previewTitle: {
    color: Colors.primary,
    fontSize: Typography.fontSize.medium,
    fontWeight: "600",
  },
  previewSite: { color: Colors.secondary, fontSize: Typography.fontSize.small },
  skeletonLine: {
    height: SKELETON_LINE_HEIGHT,
    width: "100%",
    borderRadius: Spacing.radius.xs,
    backgroundColor: Colors.card,
  },
  fetchingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.gap.xs,
    marginTop: Spacing.gap.xs,
  },
  fetchingText: { color: Colors.tertiary, fontSize: Typography.fontSize.small },
});
