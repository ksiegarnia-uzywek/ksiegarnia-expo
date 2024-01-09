import { Ionicons } from "@expo/vector-icons";
import { Video } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import {
  DocumentData,
  addDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Camera } from "expo-camera";
import { db, storage } from "../../firebaseConfig";
import { AppRoutes, RootStackParamList } from "../../routing/routing.model";
import handleBarCodeScanned, {
  onCallGPTResponse,
} from "../../utils/handleBarCodeScanned";
import { Uploading } from "./components/Uploading";
import { UploadingAndroid } from "./components/UploadingAndroid";

export default function CameraScreen() {
  const [image, setImage] = useState("");
  const [video, setVideo] = useState("");
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState<DocumentData[]>([]);

  const [camera, setCamera] = useState(true);

  const [type, setType] = useState(ImagePicker.CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const cameraRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "files"), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          console.log("New file", change.doc.data());
          setFiles((prevFiles: DocumentData[]) => [
            ...prevFiles,
            change.doc.data(),
          ]);
        }
      });
    });
    return () => unsubscribe();
  }, []);

  async function openCamera() {
    setCamera(!camera);
  }

  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      // upload the image
      await uploadImage(result.assets[0].uri, "image");
    }
  }

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
          openCamera();
          setImage(photo.uri);
          uploadImage(photo.uri, "image");
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

  async function uploadImage(uri: any, fileType: any) {
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, "Stuff/" + new Date().getTime());
    const uploadTask = uploadBytesResumable(storageRef, blob);

    // listen for events
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setProgress(parseFloat(progress.toFixed()));
      },
      (error) => {
        // handle error
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log("File available at", downloadURL);
          // save record
          await saveRecord(fileType, downloadURL, new Date().toISOString());
          setImage("");
          setVideo("");
        });
      }
    );
  }

  const onSuccess = (response: onCallGPTResponse) => {
    console.log(`Response from chat GPT: ${JSON.stringify(response)}`);
    setIsLoading(false);
    navigation.navigate(AppRoutes.RESPONSE, { response: response });
  };

  const onError = (error: Error) => {
    alert(`Error: ${error.message}`);
  };

  async function saveRecord(fileType: any, url: any, createdAt: any) {
    try {
      const docRef = await addDoc(collection(db, "files"), {
        fileType,
        url,
        createdAt,
      });
      console.log("document saved correctly", docRef.id);
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer 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",
          },
          body: JSON.stringify({
            model: "gpt-4-vision-preview",
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: "Odczytaj kod ISBN. Zwróc tylko cyfry.",
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: url,
                    },
                  },
                ],
              },
            ],
            max_tokens: 300,
          }),
        }
      );

      const data = await response.json();

      // Obsługa odpowiedzi
      if (data.choices && data.choices.length > 0) {
        const message = data.choices[0].message?.content;
        console.log("Odpowiedź od OpenAI: ", message);
        alert(`Odpowiedź od OpenAI: ${message}`);
        setIsLoading(true);
        handleBarCodeScanned({
          isbn: message,
          onSuccess,
          onError,
        });
      } else {
        console.error("Nie otrzymano odpowiedzi");
        alert("Nie otrzymano odpowiedzi");
      }
    } catch (e) {
      console.log(e);
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
    <View style={{ flex: 1 }}>
      {camera ? (
        <View style={styles.container}>
          <Camera style={styles.camera} type={type} ref={cameraRef}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={takeAndSavePhoto}
              >
                <Text style={styles.text}>Take Photo</Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      ) : (
        <FlatList
          data={files}
          keyExtractor={(item: any) => item.url}
          renderItem={({ item }) => {
            if (item.fileType === "image") {
              return (
                <Image
                  source={{ uri: item.url }}
                  style={{ width: "34%", height: 100 }}
                />
              );
            } else {
              return (
                <Video
                  source={{
                    uri: item.url,
                  }}
                  // videoStyle={{ borderWidth: 1, borderColor: "red" }}
                  rate={1.0}
                  volume={1.0}
                  isMuted={false}
                  // resizeMode="cover"
                  shouldPlay
                  // isLooping
                  style={{ width: "34%", height: 100 }}
                  useNativeControls
                />
              );
            }
          }}
          numColumns={3}
          contentContainerStyle={{ gap: 2 }}
          columnWrapperStyle={{ gap: 2 }}
        />
      )}
      {image &&
        (Platform.OS === "ios" ? (
          <Uploading image={image} video={video} progress={progress} />
        ) : (
          // Some features of blur are not available on Android
          <UploadingAndroid image={image} video={video} progress={progress} />
        ))}
      <TouchableOpacity
        onPress={pickImage}
        style={{
          position: "absolute",
          bottom: 90,
          right: 30,
          width: 44,
          height: 44,
          backgroundColor: "black",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 25,
        }}
      >
        <Ionicons name="image" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={openCamera}
        style={{
          position: "absolute",
          bottom: 150,
          right: 30,
          width: 44,
          height: 44,
          backgroundColor: "black",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 25,
        }}
      >
        <Ionicons name="camera" size={24} color="white" />
      </TouchableOpacity>
      {isLoading && (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      )}
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
});
