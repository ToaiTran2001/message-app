import React from "react";
import { View, Text } from "react-native";
import FileView from "./FileView";

interface FileBubbleMeProps {
  fileUrl: string;
  fileType: string;
}

const FileBubbleMe = ({ fileUrl, fileType }: FileBubbleMeProps) => {
  return (
    <View className="flex-row p-2 pr-3">
      <View className="flex-1" />
      <View className="bg-gray-500 rounded-[21px] max-w-[75%] px-4 py-3 justify-center mr-2 min-h-[42px]">
        <FileView fileUrl={fileUrl} fileType={fileType} />
      </View>
    </View>
  );
};

export default FileBubbleMe;
