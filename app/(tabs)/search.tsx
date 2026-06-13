import { Colors } from "@/theme/theme";
import { View, Text, StyleSheet } from "react-native";

export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Search — coming soon</Text>
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
