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
      className="p-1 h-6 rounded-full items-center justify-center"
      style={{ backgroundColor: isClick ? "#FF0000" : "#32CD32" }}
      onPress={onPress}
    >
      {isClick ? (
        <Icon name="remove" size={15} color="#FFF0F5"></Icon>
      ) : (
        <Icon name="add" size={15} color="#FFF0F5"></Icon>
      )}
    </TouchableOpacity>
  );
};

export default AddButton;
