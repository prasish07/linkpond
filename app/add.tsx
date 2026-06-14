import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, Typography } from "@/theme/theme";
import { useAddLink } from "@/features/links/hooks/useLinksHooks";
import { useGroups } from "@/features/groups/hooks/useGroupsHooks";

export default function AddScreen() {
  const { mutate: addLink, isPending } = useAddLink();
  const { data: groups = [] } = useGroups();

  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(
    undefined
  );

  const handleAdd = () => {
    if (!url.trim()) {
      alert("URL is required.");
      return;
    }
    addLink({
      url: url.trim(),
      title: title.trim(),
      note: note.trim(),
      group_id: selectedGroupId,
    });
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <TextInput
        placeholder="URL *"
        placeholderTextColor={Colors.tertiary}
        value={url}
        onChangeText={setUrl}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="url"
        autoFocus
      />
      <TextInput
        placeholder="Title (optional)"
        placeholderTextColor={Colors.tertiary}
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
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
          <Text style={styles.label}>Group</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.groupScroll}
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
                <Ionicons
                  name={g.icon as any}
                  size={14}
                  color={
                    selectedGroupId === g.id ? Colors.body : Colors.secondary
                  }
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
          <Text style={styles.saveBtnText}>Save Link</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.body },
  container: { padding: Spacing.padding.large, gap: Spacing.gap.medium },
  input: {
    backgroundColor: Colors.input,
    color: Colors.primary,
    padding: Spacing.padding.medium,
    borderRadius: Spacing.radius.medium,
    fontSize: Typography.fontSize.medium,
  },
  noteInput: { height: 80, textAlignVertical: "top" },
  label: { color: Colors.secondary, fontSize: Typography.fontSize.small },
  groupScroll: { marginBottom: Spacing.gap.small },
  groupChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.input,
    borderRadius: Spacing.radius.xlarge,
    paddingHorizontal: Spacing.padding.medium,
    paddingVertical: Spacing.padding.small,
    marginRight: Spacing.gap.small,
    backgroundColor: Colors.input,
  },
  groupChipSelected: { borderColor: Colors.gold, backgroundColor: Colors.gold },
  groupChipText: {
    color: Colors.secondary,
    fontSize: Typography.fontSize.small,
  },
  groupChipTextSelected: { color: Colors.body },
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
});
