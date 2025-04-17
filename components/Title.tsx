import { Text } from "react-native";
import React from "react";

interface TitleProps {
  text: string;
  color: string;
}

const Title = ({ text, color }: TitleProps) => {
  return (
    <Text
      className="text-4xl font-bold text-center mb-4"
      style={{
        color: color,
        fontFamily: "LeckerliOne-Regular",
      }}
    >
      {text}
    </Text>
  );
};

export default Title;
