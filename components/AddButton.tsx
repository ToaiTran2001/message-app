import { TouchableOpacity } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";

interface AddButtonProps {
  isClick: boolean;
  onPress: () => void;
}

const AddButton = ({ isClick, onPress }: AddButtonProps) => {
  return (
    <TouchableOpacity
      className="p-1 h-8 w-8 rounded-full items-center justify-center"
      style={{ backgroundColor: isClick ? "#FF7F7F" : "#98FB98" }}
      onPress={onPress}
    >
      {isClick ? (
        <Icon name="remove" size={15} color="#000000"></Icon>
      ) : (
        <Icon name="add" size={15} color="#000000"></Icon>
      )}
    </TouchableOpacity>
  );
};

export default AddButton;
