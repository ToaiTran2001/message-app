import { Image, Text } from "react-native";
import { WebView } from "react-native-webview";
import * as FileSystem from "expo-file-system";
import { useEffect, useState } from "react";
import ChatLink from "./ChatLink";

interface FileViewProps {
  fileUrl: string;
  fileType: string;
  fileContent: any;
}

const FileView = ({ fileUrl, fileType, fileContent }: FileViewProps) => {
  const fullUrl = "http://115.78.92.177:8000" + fileUrl;

  return (
    <>
      {fileType === "image/png" || fileType === "image/jpeg" ? (
        <Image
          source={{ uri: fullUrl }}
          style={{ width: 200, height: 200 }}
          resizeMode="contain"
        />
      ) : (
        <ChatLink url={fullUrl} />
      )}
    </>
  );
};

export default FileView;
