import { Ionicons } from "@expo/vector-icons";
import { Video } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import {
  DocumentData,
  addDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { db, storage } from "../../firebaseConfig";
import CameraComponent from "./CameraComponent";
import { Uploading } from "./components/Uploading";
import { UploadingAndroid } from "./components/UploadingAndroid";

export default function CameraScreen() {
  const [image, setImage] = useState("");
  const [video, setVideo] = useState("");
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState<DocumentData[]>([]);

  const [camera, setCamera] = useState(false);

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
                    text: "Odczytaj kod ISBN",
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
      } else {
        console.error("Nie otrzymano odpowiedzi");
        alert("Nie otrzymano odpowiedzi");
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {camera ? (
        <CameraComponent></CameraComponent>
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
    </View>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 5,
    borderRadius: 20,
  },
});
