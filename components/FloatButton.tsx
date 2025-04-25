import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";

interface FloatButtonProps {
  title?: string;
  icon: string;
  isPressed?: boolean;
  handlePress: () => void;
}

const FloatButton = ({
  title,
  icon,
  isPressed,
  handlePress,
}: FloatButtonProps) => {
  return (
    <TouchableOpacity
      className="flex-row h-10 w-20 items-center justify-center rounded-[6px] px-2 ml-2"
      style={{ backgroundColor: isPressed ? "#4682B4" : "#87CEFA" }}
      onPress={handlePress}
    >
      <Text className="font-bold text-black">{title}</Text>
      <Icon name={icon} size={15}></Icon>
    </TouchableOpacity>
  );
};

export default FloatButton;
