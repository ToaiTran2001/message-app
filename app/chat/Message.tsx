import {
  View,
  Text,
  Animated,
  Easing,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  FlatList,
  InputAccessoryView,
  Alert,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Thumbnail from "@/components/Thumbnail";
import Icon from "react-native-vector-icons/Ionicons";
import useGlobal from "@/core/global";
import { useLocalSearchParams, useSearchParams } from "expo-router/build/hooks";
import { io, Socket } from "socket.io-client";
import { UserInformation } from "@/interfaces/User";
import { ChatInfo } from "@/interfaces/Chat";
import { GROUP_TYPE, PERSONAL_TYPE } from "@/core/constants";
import utils from "@/core/utils";
import ChatBar from "@/components/ChatBar";
import MessageBubbleMe from "@/components/MessageBubbleMe";
import MessageBubbleFriend from "@/components/MessageBubbleFriend";
import FileBubbleMe from "@/components/FileBubbleMe";
import FileBubbleFriend from "@/components/FileBubbleFriend";
import { useNavigation } from "expo-router";

const DEFAULT_SERVER_URL = "http://115.78.92.177:8000/";

function MessageHeader({ item }: any) {
  return (
    <View className="flex-row items-center">
      <Thumbnail url={""} size={30} />
      <Text className="font-bold text-dark-100 ml-2 text-lg">
        {item.group_id ? item.group_name : item.firstName + " " + item.lastName}
      </Text>
    </View>
  );
}

function MessageBubble({ index, message, friend }: any) {
  const user = useGlobal((state) => state.user) as UserInformation;
  const [showTyping, setShowTyping] = useState(false);

  // const messagesTyping = useGlobal(state => state.messagesTyping)
  const messagesTyping = null; // Placeholder for the actual state

  useEffect(() => {
    if (index !== 0) return;
    if (messagesTyping === null) {
      setShowTyping(false);
      return;
    }
    setShowTyping(true);
    const check = setInterval(() => {
      const now = new Date();
      const ms = 9999; // Placeholder for the actual time difference calculation
      if (ms > 10000) {
        setShowTyping(false);
      }
    }, 1000);
    return () => clearInterval(check);
  }, [messagesTyping]);

  if (index === 0) {
    if (showTyping) {
      return <MessageBubbleFriend friend={friend} typing={true} />;
    }
    return;
  }

  return message.sender === user.id.toString() ? (
    <MessageBubbleMe text={message.content} />
  ) : (
    <MessageBubbleFriend text={message.content} friend={friend} />
  );
}

function FileBubble({ index, message, friend }: any) {
  const user = useGlobal((state) => state.user) as UserInformation;
  const [showTyping, setShowTyping] = useState(false);

  // const messagesTyping = useGlobal(state => state.messagesTyping)
  const messagesTyping = null; // Placeholder for the actual state

  useEffect(() => {
    if (index !== 0) return;
    if (messagesTyping === null) {
      setShowTyping(false);
      return;
    }
    setShowTyping(true);
    const check = setInterval(() => {
      const now = new Date();
      const ms = 9999; // Placeholder for the actual time difference calculation
      if (ms > 10000) {
        setShowTyping(false);
      }
    }, 1000);
    return () => clearInterval(check);
  }, [messagesTyping]);

  if (index === 0) {
    if (showTyping) {
      return <MessageBubbleFriend friend={friend} typing={true} />;
    }
    return;
  }

  return message.sender === user.id.toString() ? (
    <FileBubbleMe fileUrl={message.file_url} fileType={message.file_type} />
  ) : (
    <FileBubbleFriend
      fileUrl={message.file_url}
      fileType={message.file_type}
      friend={friend}
    />
  );
}

const ChatRoom = () => {
  const user = useGlobal((state) => state.user) as UserInformation;
  const token = useGlobal((state) => state.tokens) as string;
  const { item } = useLocalSearchParams();
  const parseItem = utils.parseParams(item);
  const chatType = parseItem.group_id ? GROUP_TYPE : PERSONAL_TYPE;
  const chatId = (
    parseItem.group_id ? parseItem.group_id : parseItem.id
  ).toString();

  const [serverUrlInput, setServerUrlInput] = useState(DEFAULT_SERVER_URL);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [userId, setUserId] = useState(user.id.toString());

  const [loading, setLoading] = useState(false);
  const [currentChat, setCurrentChat] = useState<ChatInfo>({
    id: user.id,
    type: chatType,
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const socketRef = useRef(null); // Ref giữ instance socket
  const [messageList, setMessageList] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (user.id) {
      setUserId(user.id.toString());
    }
  }, [user.id]);

  useEffect(() => {
    if (user) {
      const newSocket = io(DEFAULT_SERVER_URL, {
        transports: ["websocket"],
        autoConnect: false, // để điều khiển kết nối sau khi gán token
      });

      newSocket.connect();

      newSocket.on("connect", () => {
        console.log("✅ Socket connected!");
        setConnected(true);

        // Gửi token xác thực đến server
        newSocket.emit("authenticate", { userID: userId }, (response: any) => {
          if (response?.status === "success") {
            console.log("🔐 Authenticated!");
            setAuthenticated(true);
            setSocket(newSocket);
          } else {
            console.error("❌ Auth failed:", response?.message);
          }
        });
      });

      newSocket.on("disconnect", () => {
        console.log("Socket disconnected!");
        setConnected(false);
        setAuthenticated(false);
      });

      // Event listeners for messages
      newSocket.on("personal_message", (data) => {
        console.log("Received personal message:", data);
        console.log("ChatId", chatId);
        if (
          (data.sender === userId && data.receiver === chatId) ||
          (data.sender === chatId && data.receiver === userId)
        ) {
          setMessageList((prevMessages) => [data, ...prevMessages]);
        }

        // Mark message as read if it's in the current chat
        if (
          currentChat &&
          currentChat.id === data.sender &&
          data.sender !== user.id
        ) {
          newSocket.emit("mark_as_read", { message_id: data._id });
        }
      });

      newSocket.on("group_message", (data) => {
        console.log("Received group message:", data);
        console.log("ChatId", chatId);
        if (
          (data.sender === userId && data.receiver === chatId) ||
          (data.sender === chatId && data.receiver === userId)
        ) {
          setMessageList((prevMessages) => [data, ...prevMessages]);
        }

        // Mark message as read if it's in the current chat
        if (
          currentChat &&
          currentChat.id === data.group &&
          data.sender !== user.id
        ) {
          newSocket.emit("mark_as_read", { message_id: data._id });
        }
      });

      newSocket.on("message_status", (data) => {
        console.log("Message status update:", data);
        // Handle status updates for messages (read/delivered)
      });

      return () => {
        console.log("Cleaning up socket connection...");
        newSocket.disconnect();
        newSocket.off("personal_message");
      };
    }
  }, [serverUrlInput, user, currentChat]);

  // Load message history when changing chats
  useEffect(() => {
    if (socket && currentChat) {
      setLoading(true);
      setMessageList([]);

      socket.emit(
        "get_message_history_handler",
        {
          target_id: currentChat.id,
          type: currentChat.type,
          limit: 50,
          offset: 0,
        },
        (response: any) => {
          if (response.status === "success") {
            setMessageList(response.messages);
          } else {
            console.error("Failed to load message history:", response.message);
          }
          setLoading(false);
        }
      );
    }
  }, [socket, currentChat]);

  const [message, setMessage] = useState("");

  // const messagesList = useGlobal((state) => state.messagesList);
  // const messagesNext = useGlobal((state) => state.messagesNext);

  // const messageList = useGlobal((state) => state.messageList);
  // const messageSend = useGlobal((state) => state.messageSend);
  // const messageType = useGlobal((state) => state.messageType);
  // Placeholder for the actual messages list
  // const messagesNext = null; // Placeholder for the actual next messages
  // const messageList = null; // Placeholder for the actual message list function
  // const messageSend = null; // Placeholder for the actual message send function
  // const messageType = null; // Placeholder for the actual message type function

  // const connectionId = route.params.id
  // const friend = route.params.friend
  // const friend = null; // Placeholder for the actual friend data
  // const connectionId = null; // Placeholder for the actual connection ID

  // Update the header
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <MessageHeader item={parseItem} />,
    });
  }, [navigation, parseItem]);

  // useEffect(() => {
  //   messageList(connectionId);
  // }, []);

  const onSendMessage = () => {
    const cleaned = message.replace(/\s+/g, " ").trim();
    if (cleaned?.length === 0) return;
    const respone = socket?.emit("send_message", {
      receiver: chatId,
      type: chatType,
      content: message,
      reply: "",
    });
    setMessage("");
    console.log(messageList);
  };

  const onSendMultiMedia = (fileContent: any) => {
    const response = socket?.emit("send_multimedia_handler", {
      receiver: chatId,
      type: chatType,
      file_data: fileContent.fileData,
      file_name: fileContent.fileName,
      file_type: fileContent.fileType,
      reply: "",
    });
    console.log(response);
    console.log(messageList);
  };

  const onType = (value: any) => {
    setMessage(value);
    // messageType(friend.username)
  };

  return (
    <SafeAreaView className="flex-1">
      <View
        style={{
          flex: 1,
          marginBottom: Platform.OS === "ios" ? 60 : 0,
        }}
      >
        <FlatList
          automaticallyAdjustKeyboardInsets={true}
          contentContainerStyle={{
            paddingTop: 30,
          }}
          data={[{ id: -1 }, ...messageList]}
          inverted={true}
          keyExtractor={(item) =>
            typeof item === "string" ? item : item.id?.toString()
          }
          onEndReached={() => {
            // if (messagesNext) {
            //   messageList(connectionId, messagesNext)
            // }
          }}
          renderItem={({ item, index }) => (
            <>
              {item.content_type === "text" ? (
                <MessageBubble
                  index={index}
                  message={item}
                  friend={parseItem}
                />
              ) : (
                <FileBubble index={index} message={item} friend={parseItem} />
              )}
            </>
          )}
        />
      </View>

      <ChatBar
        message={message}
        onTypeMessage={onType}
        onSendMessage={onSendMessage}
        onSendMultiMedia={(fileContent: any) => {
          onSendMultiMedia(fileContent);
        }}
      />
    </SafeAreaView>
  );
};

export default ChatRoom;
