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
import { useSearchParams } from "expo-router/build/hooks";
import { io, Socket } from "socket.io-client";
import { UserInformation } from "@/interfaces/User";

function MessageHeader({ friend }: any) {
  return (
    <View className="flex-row items-center">
      <Thumbnail url={""} size={30} />
      <Text className="font-bold text-dark-100 ml-2 text-lg">
        {friend.name}
      </Text>
    </View>
  );
}

function MessageBubbleMe({ text }: any) {
  return (
    <View className="flex-row p-2 pr-3">
      <View style={{ flex: 1 }} />
      <View
        style={{
          backgroundColor: "#303040",
          borderRadius: 21,
          maxWidth: "75%",
          paddingHorizontal: 16,
          paddingVertical: 12,
          justifyContent: "center",
          marginRight: 8,
          minHeight: 42,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 16,
            lineHeight: 18,
          }}
        >
          {text}
        </Text>
      </View>
    </View>
  );
}

function MessageTypingAnimation({ offset }: any) {
  const y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const total = 1000;
    const bump = 200;

    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(bump * offset),
        Animated.timing(y, {
          toValue: 1,
          duration: bump,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(y, {
          toValue: 0,
          duration: bump,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.delay(total - bump * 2 - bump * offset),
      ])
    );
    animation.start();
    return () => {
      animation.stop();
    };
  }, []);

  const translateY = y.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  return (
    <Animated.View
      style={{
        width: 8,
        height: 8,
        marginHorizontal: 1.5,
        borderRadius: 4,
        backgroundColor: "#606060",
        transform: [{ translateY }],
      }}
    />
  );
}

function MessageBubbleFriend({ text = "", friend, typing = false }: any) {
  return (
    <View
      style={{
        flexDirection: "row",
        padding: 4,
        paddingLeft: 16,
      }}
    >
      <Thumbnail url={""} size={42} />
      <View
        style={{
          backgroundColor: "#d0d2db",
          borderRadius: 21,
          maxWidth: "75%",
          paddingHorizontal: 16,
          paddingVertical: 12,
          justifyContent: "center",
          marginLeft: 8,
          minHeight: 42,
        }}
      >
        {typing ? (
          <View style={{ flexDirection: "row" }}>
            <MessageTypingAnimation offset={0} />
            <MessageTypingAnimation offset={1} />
            <MessageTypingAnimation offset={2} />
          </View>
        ) : (
          <Text
            style={{
              color: "#202020",
              fontSize: 16,
              lineHeight: 18,
            }}
          >
            {text}
          </Text>
        )}
      </View>
      <View style={{ flex: 1 }} />
    </View>
  );
}

function MessageBubble({ index, message, friend }: any) {
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

  return message.is_me ? (
    <MessageBubbleMe text={message.text} />
  ) : (
    <MessageBubbleFriend text={message.text} friend={friend} />
  );
}

function MessageInput({ message, setMessage, onSend }: any) {
  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingBottom: 10,
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <TextInput
        placeholder="Message..."
        placeholderTextColor="#909090"
        value={message}
        onChangeText={setMessage}
        style={{
          flex: 1,
          paddingHorizontal: 18,
          borderWidth: 1,
          borderRadius: 25,
          borderColor: "#d0d0d0",
          backgroundColor: "white",
          height: 50,
        }}
      />
      <TouchableOpacity onPress={onSend}>
        <Icon
          name="paper-plane"
          size={22}
          color={"#303040"}
          style={{
            marginHorizontal: 12,
          }}
        />
      </TouchableOpacity>
    </View>
  );
}

const ChatRoom = () => {
  const DEFAULT_SERVER_URL = "http://115.78.92.177:8000/";
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userID, setUserID] = useState(""); // State lưu User ID người dùng nhập
  const [serverUrlInput, setServerUrlInput] = useState(DEFAULT_SERVER_URL); // State lưu URL server người dùng nhập
  const [statusText, setStatusText] = useState("Idle"); // State hiển thị trạng thái chi tiết
  const user = useGlobal((state) => state.user) as UserInformation;
  const tokens = useGlobal((state) => state.tokens) as string;

  const socketRef = useRef(null); // Ref giữ instance socket

  useEffect(() => {
    // Chỉ khởi tạo socket một lần khi component mount
    if (!socketRef.current && serverUrlInput) {
      setStatusText(`Attempting to connect to ${serverUrlInput}...`);
      const newSocket = io(serverUrlInput, {
        transports: ["websocket"],
        // Các tùy chọn khác nếu cần
        // autoConnect: false // Tắt tự động kết nối nếu muốn kiểm soát bằng nút nhấn
      });

      socketRef.current = newSocket;
      setSocket(newSocket);

      // Handlers trạng thái kết nối cơ bản
      newSocket.on("connect", () => {
        console.log("Socket.IO Connected!");
        setIsConnected(true);
        setStatusText(`Connected to ${serverUrlInput}. Waiting for User ID...`);
        // Sau khi kết nối, effect thứ 2 sẽ xử lý xác thực nếu userID đã có
      });

      newSocket.on("disconnect", () => {
        console.log("Socket.IO Disconnected.");
        setIsConnected(false);
        setIsAuthenticated(false); // Reset trạng thái xác thực
        setStatusText("Disconnected");
      });

      newSocket.on("connect_error", (err) => {
        console.error("Socket.IO Connection Error:", err.message);
        setIsConnected(false);
        setIsAuthenticated(false);
        setStatusText(`Connection Error: ${err.message}`);
        Alert.alert("Connection Error", `Failed to connect: ${err.message}`);
      });

      // newSocket.on("personal_message", (data: any) => {
      //   console.log("📩 Personal Message:", data);
      //   setMessagesList(data);
      // });

      // Handler cho phản hồi xác thực (nếu server gửi phản hồi)
      // Lưu ý: server Python bạn cung cấp dùng socket.call ('authenticate', ..., callback)
      // Chúng ta sẽ dùng emit + callback ở useEffect thứ 2
      // Tuy nhiên, nếu server có emit sự kiện 'auth_response' chẳng hạn, thì sẽ bắt ở đây.
      // newSocket.on('auth_response', (response) => { ... });
    } else if (
      socketRef.current &&
      serverUrlInput &&
      !socketRef.current.connected &&
      statusText === "Idle"
    ) {
      // Nếu socket đã có nhưng chưa kết nối và trạng thái Idle (chưa nhấn connect)
      // Có thể thêm logic socketRef.current.connect(); ở đây nếu autoConnect=false
      // Với autoConnect mặc định là true, socket sẽ tự kết nối khi khởi tạo
    }

    // Cleanup: Ngắt kết nối khi component unmount hoặc serverUrlInput thay đổi để khởi tạo lại socket
    return () => {
      if (socketRef.current) {
        // Chỉ ngắt kết nối nếu serverUrlInput thay đổi hoặc component unmount
        console.log("Cleaning up socket connection...");
        socketRef.current.disconnect();
        socketRef.current.off("connect");
        socketRef.current.off("disconnect");
        socketRef.current.off("connect_error");
        // socketRef.current = null; // Không set null ở đây nếu serverUrlInput thay đổi
      }
    };
    // Effect chạy lại nếu serverUrlInput thay đổi để tạo socket mới kết nối đến URL mới
  }, [serverUrlInput]);

  // --- Effect: Tự động Xác thực khi kết nối thành công và có User ID ---
  useEffect(() => {
    // Kiểm tra: Đã kết nối, có User ID, socket instance tồn tại, và CHƯA được xác thực
    if (isConnected && user.id && socketRef.current && !isAuthenticated) {
      setStatusText(`Authenticating as ${userID}...`);
      console.log(`Attempting to authenticate with userID: ${user.id}`);
      // Gửi sự kiện 'authenticate' và chờ phản hồi từ callback
      socketRef.current.emit(
        "authenticate",
        { userID: user.id },
        (response) => {
          console.log("Authentication response:", response);
          if (response && response.status === "success") {
            setIsAuthenticated(true);
            setStatusText(`Authenticated successfully as ${response.user_id}`);
            console.log(`Authenticated successfully as ${response.user_id}`);
          } else {
            setIsAuthenticated(false);
            // Hiển thị lỗi từ server nếu có
            const errorMessage =
              response && response.message
                ? response.message
                : "Authentication failed";
            setStatusText(`Authentication Failed: ${errorMessage}`);
            console.error("Authentication failed:", errorMessage);
            Alert.alert("Authentication Failed", errorMessage);
            // Có thể ngắt kết nối nếu xác thực thất bại để tránh vòng lặp
            // socketRef.current.disconnect();
          }
        }
      );
    } else if (!isConnected) {
      // Nếu User ID thay đổi khi đang offline, reset trạng thái xác thực
      setIsAuthenticated(false);
    }
  }, [isConnected, userID, isAuthenticated]); // Chạy lại effect nếu 3 state này thay đổi
  const [message, setMessage] = useState("");

  // const messagesList = useGlobal((state) => state.messagesList);
  // const messagesNext = useGlobal((state) => state.messagesNext);

  // const messageList = useGlobal((state) => state.messageList);
  // const messageSend = useGlobal((state) => state.messageSend);
  // const messageType = useGlobal((state) => state.messageType);
  const [messagesList, setMessagesList] = useState<any[]>([]); // Placeholder for the actual messages list
  // const messagesNext = null; // Placeholder for the actual next messages
  // const messageList = null; // Placeholder for the actual message list function
  // const messageSend = null; // Placeholder for the actual message send function
  // const messageType = null; // Placeholder for the actual message type function

  const connectionId = useSearchParams().get("id");
  const friendString = useSearchParams().get("friend");
  const friend =
    typeof friendString === "string" ? JSON.parse(friendString) : friendString;

  // const connectionId = route.params.id
  // const friend = route.params.friend
  // const friend = null; // Placeholder for the actual friend data
  // const connectionId = null; // Placeholder for the actual connection ID

  /// Update the header
  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerTitle: () => (
  //       <MessageHeader friend={friend} />
  //     )
  //   })
  // }, [])

  // useEffect(() => {
  //   messageList(connectionId);
  // }, []);

  const onSend = () => {
    const cleaned = message.replace(/\s+/g, " ").trim();
    if (cleaned.length === 0) return;
    // messageSend(connectionId, cleaned)
    const respone = socketRef.current?.emit("send_message", {
      receiver: friend?.id,
      type: "personal",
      content: message,
    });
    setMessage("");
  };

  function onType(value: any) {
    setMessage(value);
    // messageType(friend.username)
  }

  // interface PersonalMessageData {
  //   sender: string; // Replace with the actual type, e.g., `string`
  //   content: string; // Replace with the actual type, e.g., `string`
  //   timestamp?: string; // Optional field, replace with the correct type if required
  // }

  // Function to handle personal message
  const setupSocketListeners = (socket: Socket): void => {
    socket.on("personal_message", (data: any) => {
      console.log("📩 Personal Message:", data);
      setMessagesList(data);
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
          data={[{ id: -1 }, ...messagesList]}
          inverted={true}
          keyExtractor={(item) =>
            typeof item === "string" ? item : item.id.toString()
          }
          onEndReached={() => {
            // if (messagesNext) {
            //   messageList(connectionId, messagesNext)
            // }
          }}
          renderItem={({ item, index }) => (
            <MessageBubble index={index} message={item} friend={friend} />
          )}
        />
      </View>

      {Platform.OS === "ios" ? (
        <InputAccessoryView>
          <MessageInput message={message} setMessage={onType} onSend={onSend} />
        </InputAccessoryView>
      ) : (
        <MessageInput message={message} setMessage={onType} onSend={onSend} />
      )}
    </SafeAreaView>
  );
};

export default ChatRoom;
