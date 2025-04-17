import { Text, TouchableOpacity } from "react-native";
import React from "react";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
}

const CustomButton = ({ title, onPress }: CustomButtonProps) => {
  return (
    <TouchableOpacity
      className="bg-primary h-16 rounded-xl items-center justify-center my-1"
      onPress={onPress}
    >
      <Text className="text-dark-100 font-bold text-[16px]">{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
