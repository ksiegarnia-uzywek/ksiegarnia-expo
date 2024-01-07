import { Video } from "expo-av";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ProgressBar from "./ProgressBar";

interface Props {
  image: any;
  video: any;
  progress: any;
}

export function Uploading({ image, video, progress }: Props) {
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
          backgroundColor: "rgba(255, 255, 255, 0.7)", // Semi-transparent white background
        },
      ]}
    >
      {image && (
        <Image
          source={{ uri: image }}
          style={{
            width: 100,
            height: 100,
            resizeMode: "contain",
            borderRadius: 6,
            marginBottom: 12, // Spacing between image and the next element
          }}
        />
      )}
      {video && (
        <Video
          source={{
            uri: video,
          }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          style={{ width: 200, height: 200, marginBottom: 12 }} // Spacing between video and the next element
        />
      )}
      <Text style={{ fontSize: 12, marginBottom: 12 }}>Uploading...</Text>
      {/* Added marginBottom for spacing */}
      <ProgressBar progress={progress} />
      <View
        style={{
          height: 1,
          borderWidth: StyleSheet.hairlineWidth,
          width: "100%",
          borderColor: "#00000020",
          marginVertical: 12, // Spacing before and after the line
        }}
      />
      <TouchableOpacity>
        <Text style={{ fontWeight: "500", color: "#3478F6", fontSize: 17 }}>
          Cancel
        </Text>
      </TouchableOpacity>
    </View>
  );
}
