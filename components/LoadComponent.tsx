import { View, Text, ActivityIndicator } from "react-native";
import React from "react";

const LoadComponent = () => {
  return (
    <ActivityIndicator
      size="large"
      color="#000000"
      className="mt-10 self-center"
    />
  );
};

export default LoadComponent;
