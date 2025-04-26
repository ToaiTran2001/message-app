import { Text, TouchableOpacity, Linking } from "react-native";

interface ChatLinkProps {
  url: string;
}

const ChatLink = ({ url }: ChatLinkProps) => {
  const openLink = async () => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log("Cannot open URL: ", url);
    }
  };

  return (
    <TouchableOpacity onPress={openLink}>
      <Text style={{ color: "blue", textDecorationLine: "underline" }}>
        {url}
      </Text>
    </TouchableOpacity>
  );
};

export default ChatLink;
