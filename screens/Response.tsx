import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { AppRoutes, RootStackParamList } from "../routing/routing.model";

interface Props {
  navigation: StackNavigationProp<RootStackParamList, AppRoutes.RESPONSE>;
  route: RouteProp<RootStackParamList, AppRoutes.RESPONSE>;
}

const renderText = (text: string) => {
  const parts = text.split(/(\\.*?\\)/g); // Rozdziela tekst na części na podstawie "/słowo/"

  return parts.map((part, index) => {
    // Sprawdza, czy część jest słowem między "/"
    if (part.startsWith("\\") && part.endsWith("\\")) {
      // Usuwa znaki "/" i renderuje tekst pochylonym stylem
      return (
        <Text key={index} style={styles.italicText}>
          {part.slice(1, -1)}
        </Text>
      );
    } else {
      // Renderuje normalny tekst
      return part;
    }
  });
};

const Response: React.FC<Props> = ({ navigation, route }) => {
  if (!route.params.response.response) {
    alert("Something went wrong :(");
  }
  const response = route.params.response.response.replace(/\"/g, "");
  return (
    <View style={styles.container}>
      <ScrollView>
        <Image
          style={{
            width: 200,
            height: 300,
            marginHorizontal: 80,
          }}
          source={{
            uri: route.params.response.data.bookInfo.book.image,
          }}
        />
        <Text style={styles.text}>
          {response.split("\\n").map((line, index) => (
            <React.Fragment key={index}>
              {renderText(line)}
              {"\n"}
            </React.Fragment>
          ))}
        </Text>
        <Text>Dane z których skorzytałem:</Text>
        <Text>{JSON.stringify(route.params.response.data.bookInfo)}</Text>
        <Text>
          {JSON.stringify(
            route.params.response.data.prices.shoppingscraper.results.slice(
              0,
              10
            )
          )}
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    margin: 2,
  },
  text: {
    fontSize: 12,
    color: "#333",
    lineHeight: 28,
    textAlign: "justify",
    marginBottom: 20,
    marginHorizontal: 10,
  },
  italicText: {
    fontStyle: "italic",
  },
});

export default Response;
