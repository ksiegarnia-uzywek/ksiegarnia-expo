import { NavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { Button, StyleSheet, View } from "react-native";
import { AppRoutes, RootStackParamList } from "../routing/routing.model";

const Home = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const onScan = () => {
    // navigation.navigate(AppRoutes.SCANNER); zastąpione przez camerascreen
    navigation.navigate(AppRoutes.CAMERASCREEN);
  };

  return (
    <View style={styles.container}>
      <Button title="Scan" onPress={onScan} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Home;
