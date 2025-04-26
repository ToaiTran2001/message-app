import React from "react";
import { View, Text } from "react-native";
import Thumbnail from "./Thumbnail";
import MessageTypingAnimation from "./MessageTypingAnimation";
import FileView from "./FileView";

interface FileBubbleFriendProps {
  fileUrl: string;
  fileType: string;
  fileContent: any;
  name: string;
  friend: any;
  typing?: boolean;
}

const FileBubbleFriend = ({
  fileUrl,
  fileType,
  fileContent,
  name,
  friend,
  typing,
}: FileBubbleFriendProps) => {
  return (
    <View>
      <View className="flex-row p-1 pl-4">
        <Text className="text-gray-500 text-sm">{name}</Text>
      </View>
      <View className="flex-row p-1 pl-4">
        <Thumbnail url={""} size={42} />
        <View className="bg-gray-300 rounded-[21px] max-w-[75%] px-4 py-3 justify-center ml-2 min-h-[42px]">
          {typing ? (
            <View className="flex-row">
              <MessageTypingAnimation offset={0} />
              <MessageTypingAnimation offset={1} />
              <MessageTypingAnimation offset={2} />
            </View>
          ) : (
            <FileView
              fileUrl={fileUrl}
              fileType={fileType}
              fileContent={fileContent}
            />
          )}
        </View>
        <View className="flex-1" />
      </View>
    </View>
  );
};

export default FileBubbleFriend;
