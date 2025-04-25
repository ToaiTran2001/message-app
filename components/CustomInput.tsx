import { View, Text, TextInput } from "react-native";
import React from "react";

interface CustomInputProps {
  title: string;
  placeholder: string;
  value: string;
  error: string;
  setValue: (value: string) => void;
  setError: (error: string) => void;
  secureTextEntry?: boolean;
}

const CustomInput = ({
  title,
  placeholder,
  value,
  error,
  setValue,
  setError,
  secureTextEntry = false,
}: CustomInputProps) => {
  return (
    <View>
      <Text className="text-base text-xl font-semibold mb-1">{title}</Text>
      <TextInput
        className="h-12 rounded-xl px-4 border-2 border-solid text-[16px] border-[#A0A0A0]"
        autoCapitalize="none"
        autoComplete="off"
        onChangeText={(text) => {
          setValue(text);
          if (error) {
            setError("");
          }
        }}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        placeholderTextColor={"#A0A0A0"}
        value={value}
      />
      <Text
        className="text-base text-sm"
        style={{
          color: error ? "#ff5555" : "#70747a",
        }}
      >
        {error ? error : ""}
      </Text>
    </View>
  );
};

export default CustomInput;
