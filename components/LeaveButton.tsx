import { Alert, TouchableOpacity, Text } from "react-native";

interface LeaveGroupButtonProps {
  onLeave: () => void;
}

const LeaveButton = ({ onLeave }: LeaveGroupButtonProps) => {
  const confirmLeave = () => {
    Alert.alert("Leave Group", "Are you sure you want to leave this group?", [
      { text: "Cancel", style: "cancel" },
      { text: "Leave", style: "destructive", onPress: onLeave },
    ]);
  };

  return (
    <TouchableOpacity
      onPress={confirmLeave}
      className="bg-red-500 py-2 px-2 rounded-lg items-center mt-4"
    >
      <Text className="text-white text-base font-bold">Leave Group</Text>
    </TouchableOpacity>
  );
};

export default LeaveButton;
