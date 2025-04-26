import React from "react";
import { View, Text } from "react-native";
import Thumbnail from "./Thumbnail";
import MessageTypingAnimation from "./MessageTypingAnimation";

// function MessageBubbleFriend({ text = "", friend, typing = false }: any) {
//   return (
//     <View
//       style={{
//         flexDirection: "row",
//         padding: 4,
//         paddingLeft: 16,
//       }}
//     >
//       <Thumbnail url={""} size={42} />
//       <View
//         style={{
//           backgroundColor: "#d0d2db",
//           borderRadius: 21,
//           maxWidth: "75%",
//           paddingHorizontal: 16,
//           paddingVertical: 12,
//           justifyContent: "center",
//           marginLeft: 8,
//           minHeight: 42,
//         }}
//       >
//         {typing ? (
//           <View style={{ flexDirection: "row" }}>
//             <MessageTypingAnimation offset={0} />
//             <MessageTypingAnimation offset={1} />
//             <MessageTypingAnimation offset={2} />
//           </View>
//         ) : (
//           <Text
//             style={{
//               color: "#202020",
//               fontSize: 16,
//               lineHeight: 18,
//             }}
//           >
//             {text}
//           </Text>
//         )}
//       </View>
//       <View style={{ flex: 1 }} />
//     </View>
//   );
// }

interface MessageBubbleFriendProps {
  text?: string;
  name?: string;
  friend?: any;
  typing?: boolean;
}

const MessageBubbleFriend = ({
  text = "",
  name = "",
  friend,
  typing = false,
}: MessageBubbleFriendProps) => {
  return (
    <View>
      <View className="flex-row p-1 pl-4">
        <Text className="text-gray-500 text-sm">{name}</Text>
      </View>
      <View className="flex-row p-1 pl-4">
        <Thumbnail url={""} size={42} />
        <View className="bg-gray-300 rounded-[21px] max-w-[75%] px-4 py-3 justify-center ml-2 min-h-[42px]">
          {typing ? (
            <View className="flex-row">
              <MessageTypingAnimation offset={0} />
              <MessageTypingAnimation offset={1} />
              <MessageTypingAnimation offset={2} />
            </View>
          ) : (
            <>
              <Text className="text-gray-900 text-lg leading-5">{text}</Text>
            </>
          )}
        </View>
        <View className="flex-1" />
      </View>
    </View>
  );
};

export default MessageBubbleFriend;
