import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useFocusEffect } from "expo-router";
import { Colors } from "@/theme/theme";
import { Link } from "@/features/links/types";
import { useCallback, useState } from "react";
import { getLinkById } from "@/features/links/data/links.repo";

export default function LinkDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [linkData, setLinkData] = useState<Link | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchLink = async () => {
        try {
          setIsLoading(true);
          const link = await getLinkById(id);
          setLinkData(link);
        } catch (error) {
          console.error("Failed to load link:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchLink();
    }, [id])
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          color={Colors.gold}
          size="large"
          style={{ flex: 1 }}
        />
      </View>
    );
  }

  if (!linkData) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Link not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Title: {linkData.title ?? "Untitled"}</Text>
      <Text style={styles.text}>URL: {linkData.url}</Text>
      <Text style={styles.text}>
        Description: {linkData.description ?? "No description"}
      </Text>
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
