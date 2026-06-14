import { useAddLink } from "@/features/links/hooks/useLinksHooks";
import { Colors, Spacing } from "@/theme/theme";
import { useState } from "react";
import { View, StyleSheet, TextInput, Button } from "react-native";

export default function AddScreen() {
  const { mutate: addLink, isPending } = useAddLink();

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
    addLink(inputFields);
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
      <Button
        title={`${isPending ? "Saving..." : "Add Link"}`}
        onPress={handleAdd}
        disabled={isPending}
      />
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
