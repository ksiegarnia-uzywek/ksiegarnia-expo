import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useRef, useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function App() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const cameraRef = useRef(null);

  async function takeAndSavePhoto() {
    if (cameraRef.current) {
      try {
        // Zrób zdjęcie
        const photo = await cameraRef.current.takePictureAsync();

        // Poproś o uprawnienia do zapisu w galerii (jeśli jeszcze nie przyznane)
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === "granted") {
          // Zapisz zdjęcie w galerii
          const asset = await MediaLibrary.createAssetAsync(photo.uri);
          Alert.alert(
            "Photo saved!",
            `Photo saved in gallery. Asset ID: ${asset.id}`
          );
        } else {
          Alert.alert(
            "Permission needed",
            "Please grant gallery permission to save photos."
          );
        }
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Failed to take photo");
      }
    }
  }

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takeAndSavePhoto}>
            <Text style={styles.text}>Take Photo</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
