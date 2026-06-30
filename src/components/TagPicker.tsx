import { useState } from "react";
import { View, Text, StyleSheet, TextInput, Alert } from "react-native";
import { Touchable } from "@/components/Touchable";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, Typography } from "@/theme/theme";
import { Tag } from "@/features/tags/types";
import { useTags, useAddTag } from "@/features/tags/hooks/useTagsHooks";

const CHIP_HEIGHT = 30;

type Props = {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
};

export const TagPicker = ({ selectedIds, onChange }: Props) => {
  const { data: tags = [] } = useTags();
  const { mutateAsync: addTag } = useAddTag();
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  const toggle = (id: string) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((t) => t !== id)
        : [...selectedIds, id]
    );
  };

  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) return;
    if (tags.some((t) => t.name.toLowerCase() === name.toLowerCase())) {
      Alert.alert("Tag exists", `A tag named "${name}" already exists.`);
      return;
    }
    const tag = await addTag(name) as Tag;
    onChange([...selectedIds, tag.id]);
    setNewName("");
    setCreating(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {tags.map((tag) => {
          const active = selectedIds.includes(tag.id);
          return (
            <Touchable
              key={tag.id}
              style={[
                styles.chip,
                active
                  ? { backgroundColor: tag.color, borderColor: tag.color }
                  : { borderColor: tag.color + "66" },
              ]}
              onPress={() => toggle(tag.id)}
            >
              <Text
                style={[styles.chipText, { color: active ? Colors.body : tag.color }]}
              >
                #{tag.name}
              </Text>
            </Touchable>
          );
        })}
        {creating ? (
          <View style={styles.inputRow}>
            <TextInput
              autoFocus
              value={newName}
              onChangeText={setNewName}
              placeholder="tag name"
              placeholderTextColor={Colors.tertiary}
              style={styles.inlineInput}
              onSubmitEditing={handleCreate}
              returnKeyType="done"
              autoCapitalize="none"
            />
            <Touchable onPress={handleCreate} style={styles.confirmBtn}>
              <Ionicons name="checkmark" size={14} color={Colors.body} />
            </Touchable>
            <Touchable onPress={() => { setCreating(false); setNewName(""); }}>
              <Ionicons name="close" size={14} color={Colors.secondary} />
            </Touchable>
          </View>
        ) : (
          <Touchable style={styles.newChip} onPress={() => setCreating(true)}>
            <Ionicons name="add" size={12} color={Colors.secondary} />
            <Text style={styles.newChipText}>New tag</Text>
          </Touchable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: Spacing.gap.xs },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.gap.xs,
  },
  chip: {
    height: CHIP_HEIGHT,
    borderWidth: 1,
    borderRadius: Spacing.radius.xlarge,
    paddingHorizontal: Spacing.padding.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  chipText: {
    fontSize: Typography.fontSize.small,
    fontWeight: "600",
  },
  newChip: {
    height: CHIP_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.gap.xs,
    borderWidth: 1,
    borderColor: Colors.input,
    borderRadius: Spacing.radius.xlarge,
    paddingHorizontal: Spacing.padding.medium,
    borderStyle: "dashed",
  },
  newChipText: {
    fontSize: Typography.fontSize.small,
    color: Colors.secondary,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.gap.xs,
    backgroundColor: Colors.input,
    borderRadius: Spacing.radius.xlarge,
    paddingHorizontal: Spacing.padding.medium,
    height: CHIP_HEIGHT,
  },
  inlineInput: {
    color: Colors.primary,
    fontSize: Typography.fontSize.small,
    minWidth: 80,
  },
  confirmBtn: {
    backgroundColor: Colors.gold,
    borderRadius: Spacing.radius.xs,
    padding: 2,
  },
});
