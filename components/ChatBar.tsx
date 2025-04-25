import React, { useEffect, useState } from "react";
import { View, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import Icon from "react-native-vector-icons/Ionicons";

// function MessageInput({ message, setMessage, onSend }: any) {
//   return (
//     <View
//       style={{
//         paddingHorizontal: 10,
//         paddingBottom: 10,
//         backgroundColor: "white",
//         flexDirection: "row",
//         alignItems: "center",
//       }}
//     >
//       <TextInput
//         placeholder="Message..."
//         placeholderTextColor="#909090"
//         value={message}
//         onChangeText={setMessage}
//         style={{
//           flex: 1,
//           paddingHorizontal: 18,
//           borderWidth: 1,
//           borderRadius: 25,
//           borderColor: "#d0d0d0",
//           backgroundColor: "white",
//           height: 50,
//         }}
//       />
//       <TouchableOpacity onPress={onSend}>
//         <Icon
//           name="paper-plane"
//           size={22}
//           color={"#303040"}
//           style={{
//             marginHorizontal: 12,
//           }}
//         />
//       </TouchableOpacity>
//     </View>
//   );
// }

const ALLOWED_EXTENSIONS = [
  "png",
  "jpg",
  "jpeg",
  "gif",
  "mp4",
  "pdf",
  "doc",
  "docx",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface ChatBarProps {
  message: string;
  onTypeMessage: (value: any) => void;
  onSendMessage: () => void;
  onSendMultiMedia: (fileContent: any) => void;
}
const ChatBar = ({
  message,
  onTypeMessage,
  onSendMessage,
  onSendMultiMedia,
}: ChatBarProps) => {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<any>(null);

  useEffect(() => {
    if (selectedFile) {
      onSendMultiMedia(selectedFile);
    }
  }, [selectedFile]);

  useEffect(() => {}, [selectedImage]);

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });
      if (result.canceled || !result.assets?.[0]) return;

      const file = result.assets[0];
      const uri = file.uri;
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        Alert.alert("File not found");
        return;
      }
      const fileSize = fileInfo.size || 0;

      const fileName = file.name;
      const fileExtension = fileName.split(".").pop()?.toLowerCase();

      if (!ALLOWED_EXTENSIONS.includes(fileExtension || "")) {
        Alert.alert("Unsupported file type");
        return;
      }

      if (fileSize > MAX_FILE_SIZE) {
        Alert.alert("File too large", "Max size is 10MB");
        return;
      }

      const base64Data = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const payload = {
        fileData: base64Data,
        fileName: fileName,
        fileType: file.mimeType || "application/octet-stream",
      };

      setSelectedFile(payload);
    } catch (err) {
      console.error("Error picking file", err);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <View className="flex-row items-center p-2 bg-gray-200">
      {/* <TouchableOpacity
        onPress={pickImage}
        className="mr-2 p-2 bg-primary rounded"
      >
        <Image
          source={require("../assets/images/image-icon.png")}
          style={{ width: 24, height: 24 }}
        />
      </TouchableOpacity> */}
      <TouchableOpacity
        onPress={pickFile}
        className="mr-2 p-2 bg-primary rounded"
      >
        <Image
          source={require("../assets/images/file-icon.png")}
          style={{ width: 24, height: 24 }}
        />
      </TouchableOpacity>
      <TextInput
        className="flex-1 p-2 bg-white rounded"
        placeholder="Type a message..."
        value={message}
        onChangeText={onTypeMessage}
        multiline={true}
        textAlignVertical="top"
        style={{ minHeight: 40, maxHeight: 120 }}
      />
      <TouchableOpacity onPress={onSendMessage}>
        <Icon
          name="paper-plane"
          size={22}
          color={"#303040"}
          style={{
            marginHorizontal: 12,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ChatBar;
