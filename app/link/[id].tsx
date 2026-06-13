import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Colors } from "@/theme/theme";

export default function LinkDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Link {id} — coming soon</Text>
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
  text: { color: Colors.secondary },
});
