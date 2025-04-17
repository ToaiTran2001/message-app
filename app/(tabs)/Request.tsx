import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import Cell from "@/components/Cell";
import Thumbnail from "@/components/Thumbnail";
import Empty from "@/components/Empty";

const RequestAccept = ({ item }: any) => {
  // const requestAccept = useGlobal(state => state.requestAccept)

  return (
    <TouchableOpacity
      className="bg-dark-100 px-4 h-24 rounded-full items-center justify-center"

      // onPress={() => requestAccept(item.sender.username)}
    >
      <Text className="text-white font-bold">Accept</Text>
    </TouchableOpacity>
  );
};

const RequestRow = ({ item }: any) => {
  const message = "Requested to connect with you";
  //const time = '7m ago'

  return (
    <Cell>
      <Thumbnail url={item.sender.thumbnail} size={76} />
      <View className="flex-1 px-4">
        <Text className="font-bold text-dark-100 mb-2">{item.sender.name}</Text>
        <Text className="text-dark-400 text-md">
          {message}{" "}
          <Text className="text-dark-500 text-sm">
            Time
            {/* {utils.formatTime(item.created)} */}
          </Text>
        </Text>
      </View>

      <RequestAccept item={item} />
    </Cell>
  );
};

const Request = () => {
  // const requestList = useGlobal(state => state.requestList)
  interface RequestItem {
    sender: {
      username: string;
      name: string;
      thumbnail: string;
    };
    created: string;
  }

  const [requestList, setRequestList] = useState<RequestItem[]>([]); // Placeholder for requestList, replace with actual data fetching logic

  // Show loading indicator
  if (requestList === null) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  // Show empty if no requests
  if (requestList.length === 0) {
    return <Empty icon="notifications-none" message="No requests" />;
  }
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={requestList}
        renderItem={({ item }) => <RequestRow item={item} />}
        keyExtractor={(item) => item.sender.username}
      />
    </View>
  );
};

export default Request;
