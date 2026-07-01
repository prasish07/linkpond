import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, Typography } from "@/theme/theme";
import { Touchable } from "@/components/Touchable";
import { Tag } from "@/features/tags/types";
import {
  useTags,
  useUpdateTag,
  useDeleteTag,
} from "@/features/tags/hooks/useTagsHooks";
import { confirmDeleteTag } from "@/features/tags/confirmDeleteTag";

const ROW_ICON_SIZE = 16;
const ACTION_ICON_SIZE = 18;
const EDIT_ICON_SIZE = 20;
const EMPTY_ICON_SIZE = 48;
const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

export default function ManageTagsScreen() {
  const { data: tags = [] } = useTags();
  const { mutate: updateTag } = useUpdateTag();
  const { mutate: deleteTag } = useDeleteTag();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const startRename = (tag: Tag) => {
    setEditingId(tag.id);
    setEditName(tag.name);
  };

  const cancelRename = () => {
    setEditingId(null);
    setEditName("");
  };

  const saveRename = () => {
    if (!editingId) return;
    const name = editName.trim();
    if (!name) return cancelRename();
    const clash = tags.some(
      (t) => t.id !== editingId && t.name.toLowerCase() === name.toLowerCase()
    );
    if (clash) {
      Alert.alert("Tag exists", `A tag named "${name}" already exists.`);
      return;
    }
    updateTag({ id: editingId, name });
    cancelRename();
  };

  const renderRow = ({ item }: { item: Tag }) => {
    const editing = editingId === item.id;
    return (
      <View style={styles.row}>
        <Ionicons name="pricetag" size={ROW_ICON_SIZE} color={item.color} />
        {editing ? (
          <TextInput
            autoFocus
            value={editName}
            onChangeText={setEditName}
            onSubmitEditing={saveRename}
            placeholder="tag name"
            placeholderTextColor={Colors.tertiary}
            style={styles.input}
            returnKeyType="done"
            autoCapitalize="none"
          />
        ) : (
          <Text style={styles.name} numberOfLines={1}>
            #{item.name}
          </Text>
        )}
        {editing ? (
          <>
            <Touchable
              onPress={saveRename}
              style={styles.iconBtn}
              hitSlop={HIT_SLOP}
              rippleBorderless
            >
              <Ionicons
                name="checkmark"
                size={EDIT_ICON_SIZE}
                color={Colors.confirm}
              />
            </Touchable>
            <Touchable
              onPress={cancelRename}
              style={styles.iconBtn}
              hitSlop={HIT_SLOP}
              rippleBorderless
            >
              <Ionicons
                name="close"
                size={EDIT_ICON_SIZE}
                color={Colors.secondary}
              />
            </Touchable>
          </>
        ) : (
          <>
            <Touchable
              onPress={() => startRename(item)}
              style={styles.iconBtn}
              hitSlop={HIT_SLOP}
              rippleBorderless
            >
              <Ionicons
                name="pencil"
                size={ACTION_ICON_SIZE}
                color={Colors.secondary}
              />
            </Touchable>
            <Touchable
              onPress={() =>
                confirmDeleteTag(item.name, () => deleteTag(item.id))
              }
              style={styles.iconBtn}
              hitSlop={HIT_SLOP}
              rippleBorderless
            >
              <Ionicons
                name="trash-outline"
                size={ACTION_ICON_SIZE}
                color={Colors.destructive}
              />
            </Touchable>
          </>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={tags}
        keyExtractor={(t) => t.id}
        contentContainerStyle={styles.list}
        renderItem={renderRow}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name="pricetags-outline"
              size={EMPTY_ICON_SIZE}
              color={Colors.tertiary}
            />
            <Text style={styles.emptyTitle}>No tags yet</Text>
            <Text style={styles.emptySubtitle}>
              Add tags to a link and they&apos;ll show up here to manage.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.body },
  list: { padding: Spacing.padding.large, gap: Spacing.gap.small },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.gap.medium,
    backgroundColor: Colors.card,
    borderRadius: Spacing.radius.medium,
    padding: Spacing.padding.medium,
  },
  name: {
    flex: 1,
    color: Colors.primary,
    fontSize: Typography.fontSize.medium,
    fontFamily: Typography.fontFamily,
  },
  input: {
    flex: 1,
    color: Colors.primary,
    fontSize: Typography.fontSize.medium,
    padding: 0,
  },
  iconBtn: {
    padding: Spacing.padding.small,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.gap.medium,
    paddingTop: Spacing.padding.xxlarge * 2,
    paddingHorizontal: Spacing.padding.large,
  },
  emptyTitle: {
    color: Colors.primary,
    fontSize: Typography.fontSize.medium,
    fontWeight: "600",
  },
  emptySubtitle: {
    color: Colors.secondary,
    fontSize: Typography.fontSize.small,
    textAlign: "center",
  },
});
