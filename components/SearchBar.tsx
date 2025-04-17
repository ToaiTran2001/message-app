import { View, Text, TextInput } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChangeText?: (text: string) => void;
  onRefresh?: () => void;
}

const SearchBar = ({
  placeholder,
  value,
  onChangeText,
  onRefresh,
}: SearchBarProps) => {
  return (
    <View className="w-full h-16 rounded-full items-center bg-light-100 justify-center py-2 border border-gray-500 px-4 flex-row">
      <TextInput
        onPress={() => {}}
        placeholder={placeholder}
        placeholderTextColor="#A0A0A0"
        value={value}
        onChangeText={onChangeText}
        className="flex-1 ml-2 text-dark-100 text-lg"
      ></TextInput>
      <Icon name="close" size={30} color="#A0A0A0" onPress={onRefresh}></Icon>
    </View>
  );
};

export default SearchBar;
