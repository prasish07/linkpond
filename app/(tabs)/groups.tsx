import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../../src/theme/theme";

export default function GroupsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Groups — coming soon</Text>
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
