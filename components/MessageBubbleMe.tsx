import React from "react";
import { View, Text } from "react-native";

// const MessageBubbleMe = ({ text }: any) => {
//   return (
//     <View className="flex-row p-2 pr-3">
//       <View style={{ flex: 1 }} />
//       <View
//         style={{
//           backgroundColor: "#303040",
//           borderRadius: 21,
//           maxWidth: "75%",
//           paddingHorizontal: 16,
//           paddingVertical: 12,
//           justifyContent: "center",
//           marginRight: 8,
//           minHeight: 42,
//         }}
//       >
//         <Text
//           style={{
//             color: "white",
//             fontSize: 16,
//             lineHeight: 18,
//           }}
//         >
//           {text}
//         </Text>
//       </View>
//     </View>
//   );
// }

interface MessageBubbleMeProps {
  text: string;
}

const MessageBubbleMe = ({ text }: MessageBubbleMeProps) => {
  return (
    <View className="flex-row p-2 pr-3">
      <View className="flex-1" />
      <View className="bg-gray-500 rounded-[21px] max-w-[75%] px-4 py-3 justify-center mr-2 min-h-[42px]">
        <Text className="text-white text-lg leading-5">{text}</Text>
      </View>
    </View>
  );
};

export default MessageBubbleMe;
