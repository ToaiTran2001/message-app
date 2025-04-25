import { Image } from "react-native";
import { WebView } from "react-native-webview";

interface FileViewProps {
  fileUrl: string;
  fileType: string;
  fileContent: any;
}

const FileView = ({ fileUrl, fileType, fileContent }: FileViewProps) => {
  return (
    <>
      {fileType === "image/png" || fileType === "image/jpeg" ? (
        <Image
          source={{ uri: `data:${fileType};base64,${fileContent}` }}
          style={{ width: 200, height: 200 }}
          resizeMode="contain"
        />
      ) : (
        <WebView source={{ uri: fileUrl }} style={{ flex: 1 }} />
      )}
    </>
  );
};

export default FileView;
