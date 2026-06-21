import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, Typography, GroupColors } from "@/theme/theme";
import { useAddGroup } from "@/features/groups/hooks/useGroupsHooks";

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

const CreateGroupScreen = () => {
  const { mutate: addGroup, isPending } = useAddGroup();
  const [name, setName] = useState("");
  const [color, setColor] = useState(GroupColors[0]);
  const [icon, setIcon] = useState<keyof typeof Ionicons.glyphMap>("folder");

  const handleSave = () => {
    if (!name.trim()) {
      alert("Name is required.");
      return;
    }
    addGroup({ name: name.trim(), color, icon: icon as string });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Group name"
        placeholderTextColor={Colors.tertiary}
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <Text style={styles.label}>Color</Text>
      <View style={styles.swatches}>
        {GroupColors.map((c) => (
          <TouchableOpacity
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
      <Text style={styles.label}>Icon</Text>
      <FlatList
        data={ICONS}
        keyExtractor={(item) => item}
        numColumns={6}
        renderItem={({ item }) => (
          <TouchableOpacity
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
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={[styles.saveBtn, { backgroundColor: color }]}
        onPress={handleSave}
        disabled={isPending}
      >
        <Text style={styles.saveBtnText}>
          {isPending ? "Saving..." : "Create group"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.body,
    padding: Spacing.padding.large,
  },
  input: {
    backgroundColor: Colors.input,
    color: Colors.primary,
    padding: Spacing.padding.medium,
    borderRadius: Spacing.radius.medium,
    marginBottom: Spacing.gap.large,
    fontSize: Typography.fontSize.medium,
  },
  label: { color: Colors.secondary, marginBottom: Spacing.gap.small },
  swatches: {
    flexDirection: "row",
    gap: Spacing.gap.medium,
    marginBottom: Spacing.gap.large,
  },
  swatch: { width: 32, height: 32, borderRadius: 16 },
  swatchSelected: { borderWidth: 3, borderColor: Colors.primary },
  iconBtn: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Spacing.radius.small,
    margin: 4,
  },
  saveBtn: {
    padding: Spacing.padding.medium,
    borderRadius: Spacing.radius.medium,
    alignItems: "center",
    marginTop: Spacing.gap.large,
  },
  saveBtnText: { color: Colors.body, fontWeight: "700" },
});

export default CreateGroupScreen;
