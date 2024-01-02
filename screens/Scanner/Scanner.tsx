import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppRoutes, RootStackParamList } from "../../routing/routing.model";
import handleBarCodeScanned, {
  onCallGPTResponse,
} from "../../utils/handleBarCodeScanned";
import IsbnInput from "./IsbnInput";

const Scanner = () => {
  const [hasPermission, setHasPermission] = useState<Boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputVisible, setInputVisible] = useState(false);
  const [isbn, setIsbn] = useState<string>("");
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [panelHeight] = useState(new Animated.Value(0));

  useFocusEffect(
    useCallback(() => {
      // Resetuj stany przy każdym skupieniu ekranu
      setIsbn("");
      setScanned(false);
      setIsLoading(false);
    }, [])
  );

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const onSuccess = (response: onCallGPTResponse) => {
    setIsLoading(false);
    console.log(`Response from chat GPT: ${JSON.stringify(response)}`);
    navigation.navigate(AppRoutes.RESPONSE, { response: response });
  };

  const onError = (error: Error) => {
    setIsLoading(false);
    alert(`Error: ${error.message}`);
  };

  const handleScan = ({ type, data }: { type: string; data: string }) => {
    console.log(`Scanned with ${data}`);
    setIsLoading(true);
    handleBarCodeScanned({
      isbn: data,
      setIsbn,
      setScanned,
      onSuccess,
      onError,
    });
  };

  const togglePanel = () => {
    const toValue = inputVisible ? 0 : 350;

    Animated.timing(panelHeight, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setInputVisible(!inputVisible);
  };

  if (hasPermission === null) {
    return <Text>Requesting for Camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No Access to Camera</Text>;
  }
  return (
    <View style={styles.container}>
      <BarCodeScanner
        barCodeTypes={[
          BarCodeScanner.Constants.BarCodeType.ean13,
          BarCodeScanner.Constants.BarCodeType.ean8,
        ]}
        onBarCodeScanned={scanned ? undefined : handleScan}
        style={StyleSheet.absoluteFillObject}
      />
      <Animated.View
        style={[styles.panel, { height: panelHeight }]} // Stosowanie animowanej wysokości
      >
        <IsbnInput
          isbn={isbn}
          setIsbn={setIsbn}
          setScanned={setScanned}
          setIsLoading={setIsLoading}
          onSuccess={onSuccess}
          onError={onError}
        />
      </Animated.View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={togglePanel}>
          <Text style={styles.buttonText}>
            {inputVisible ? "Scan Barcode" : "Enter ISBN Manually"}
          </Text>
        </TouchableOpacity>
      </View>
      {isLoading && (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 5,
    borderRadius: 20,
    elevation: 3,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { height: 2, width: 0 },
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
  spinnerContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  panel: {
    // zIndex: 1000,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
  },
});

export default Scanner;
