import { FlatList, StyleSheet, View } from "react-native";
import { LinkCard } from "../src/features/links/components/LinkCard";
import { Colors, Spacing } from "../src/theme/theme";

const LINKS = [
  {
    id: "1",
    title: "How I organize my entire life in one app",
    source: "YouTube · Matt D'Avella",
    domain: "youtube.com",
    savedAt: "2h ago",
    preview: "rich" as const,
    duration: "12:04",
  },
  {
    id: "2",
    title: "Walnut + brass shelving detail",
    source: "instagram.com",
    domain: "instagram",
    savedAt: "5h ago",
    preview: "fallback" as const,
    note: "Joinery reference for the studio wall.",
  },
  {
    id: "3",
    title: "The quiet power of local-first software",
    source: "inkandswitch.com",
    domain: "inkandswitch.com",
    savedAt: "Yesterday",
    preview: "rich" as const,
  },
  {
    id: "4",
    title: "Thread: 11 tiny UX details that feel expensive",
    source: "x.com · @joulee",
    domain: "x",
    savedAt: "Yesterday",
    preview: "fallback" as const,
    reminder: "Sat, 10:00",
  },
];

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={LINKS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <LinkCard item={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.body,
  },
  list: {
    padding: Spacing.padding.large,
    gap: Spacing.gap.medium,
  },
});

export default HomeScreen;
