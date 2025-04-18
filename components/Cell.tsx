import { View, Text } from "react-native";
import React from "react";

const Cell = ({ children }: any) => {
  return (
    <View className="flex flex-row items-center h-32 border-b border-gray-400 px-5">
      {children}
    </View>
  );
};

export default Cell;
