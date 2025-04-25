import { Image } from "react-native";
import { WebView } from "react-native-webview";

interface FileViewProps {
  fileUrl: string;
  fileType: string;
}

const FileView = ({ fileUrl, fileType }: FileViewProps) => {
  return (
    <>
      {fileType === "png" ? (
        <Image
          source={{ uri: fileUrl }}
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
