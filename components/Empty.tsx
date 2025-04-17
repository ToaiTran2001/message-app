import { View, Text } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";

interface EmptyProps {
  icon: string;
  message: string;
  centered?: boolean;
}

const Empty = ({ icon, message, centered = true }: EmptyProps) => {
  return (
    <View className="flex-1 items-center justify-center py-20">
      <Icon className="mb-4" name={icon} color="#d0d0d0" size={90} />
      <Text className="text-gray-400 text-md">{message}</Text>
    </View>
  );
};

export default Empty;
