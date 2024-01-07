import { Text, View } from "react-native";

export default function EmptyState() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: "gray", marginTop: 20 }}>
        No photo uploaded yet
      </Text>
    </View>
  );
}
