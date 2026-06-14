import { insertLink } from "@/features/links/data/links.repo";
import { Colors, Spacing } from "@/theme/theme";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View, StyleSheet, TextInput, Button } from "react-native";

export default function AddScreen() {
  const router = useRouter();

  const [inputFields, setInputFields] = useState({
    url: "",
    title: "",
    note: "",
  });

  const handleAdd = async () => {
    if (!inputFields.url.trim()) {
      alert("URL is required.");
      return;
    }
    try {
      const id = Math.random().toString(36).slice(2) + Date.now().toString(36);

      await insertLink({
        id,
        url: inputFields.url,
        title: inputFields.title,
        note: inputFields.note,
      });

      router.back();
    } catch (error) {
      console.error("Failed to add link:", error);
      alert("Failed to add link. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="URL"
        value={inputFields.url}
        onChangeText={(text) => setInputFields({ ...inputFields, url: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Title"
        value={inputFields.title}
        onChangeText={(text) => setInputFields({ ...inputFields, title: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Note"
        value={inputFields.note}
        onChangeText={(text) => setInputFields({ ...inputFields, note: text })}
        style={styles.input}
      />
      <Button title="Add Link" onPress={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.body,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.input,
    color: Colors.secondary,
    padding: Spacing.padding.medium,
    marginVertical: Spacing.gap.small,
    width: "80%",
  },
});
