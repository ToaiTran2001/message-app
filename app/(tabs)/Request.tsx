import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import Cell from "@/components/Cell";
import Thumbnail from "@/components/Thumbnail";
import Empty from "@/components/Empty";
import useFetch from "@/services/useFetch";
import {
  fetchPendingList,
  fetchSearch,
  fetchSendResponse,
} from "@/services/api";
import { UserInformation, UserVerifyAccountRequest } from "@/interfaces/User";
import { SendRequest, SendResponse } from "@/interfaces/Request";
import useGlobal from "@/core/global";
import SearchBar from "@/components/SearchBar";

const ACCEPT = "accept";
const REJECT = "reject";

interface RequestAcceptProps {
  friendId: string;
  responseStatus: string;
  color: string;
}
const RequestAccept = ({
  friendId,
  responseStatus,
  color,
}: RequestAcceptProps) => {
  // const requestAccept = useGlobal(state => state.requestAccept)
  const user = useGlobal((state) => state.user) as UserInformation;
  const token = useGlobal((state) => state.tokens) as string;
  const { data, loading, error, reFetch } = useFetch(
    () =>
      fetchSendResponse(
        {
          token: token,
          id: user.id,
        },
        { friendId: friendId, responseStatus: responseStatus }
      ),
    false
  );

  const handleOnPress = () => {
    reFetch();
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <TouchableOpacity
      className="px-4 h-10 rounded-xl items-center justify-center my-1"
      style={{ backgroundColor: color }}
      onPress={handleOnPress}
    >
      <Text className="text-white font-bold">{responseStatus}</Text>
    </TouchableOpacity>
  );
};

const RequestRow = ({ item }: any) => {
  const message = "Requested to connect with you";
  //const time = '7m ago'

  return (
    <Cell>
      <Thumbnail url={item.profilePic} size={76} />
      <View className="flex-1 flex-row px-4">
        <Text className="font-bold text-dark-100 mb-2">{item.firstName} </Text>
        <Text className="font-bold text-dark-100 mb-2">{item.lastName}</Text>
      </View>

      <View>
        <RequestAccept
          friendId={item.id}
          responseStatus={ACCEPT}
          color="#32CD32"
        />
        <RequestAccept
          friendId={item.id}
          responseStatus={REJECT}
          color="#FF0000"
        />
      </View>
    </Cell>
  );
};

const Request = () => {
  const user = useGlobal((state) => state.user) as UserInformation;
  const tokens = useGlobal((state) => state.tokens) as string;
  const userRequest = {
    id: user.id,
    token: tokens,
  };
  // const requestList = useGlobal(state => state.requestList)
  // interface RequestItem {
  //   sender: {
  //     username: string;
  //     name: string;
  //     thumbnail: string;
  //   };
  //   created: string;
  // }

  // const [requestList, setRequestList] = useState<RequestItem[]>([]); // Placeholder for requestList, replace with actual data fetching logic

  // const user = useGlobal((state) => state.user) as UserInformation;
  // const token = useGlobal((state) => state.tokens) as string;
  // const { data, loading, error } = useFetch(
  //   () => fetchPendingList({ token, id: user.id }),
  //   true
  // );

  // useEffect(() => {
  //   if (data) {
  //     setRequestList(data);
  //   }
  // }, [data]);

  const [searchText, setSearchText] = useState("");
  const {
    data: searchResults,
    loading: searchLoading,
    error: searchError,
    reFetch: refetchSearch,
    reset,
  } = useFetch(() => fetchSearch(userRequest, searchText), false);
  const onSearch = (text: string) => {
    console.log("Search pressed");
    setSearchText(text);
    // if (searchText.length > 0) {
    //   setRequestList(searchResults);
    // } else {
    //   setRequestList(data);
    // }
  };

  let requestList = [
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      username: "jd",
      profilePic: "",
      preview: "Hey, how are you?",
      updated: new Date(),
    },
    {
      id: "2",
      firstName: "John",
      lastName: "Doe",
      username: "jd",
      profilePic: "",
      preview: "Hey, how are you?",
      updated: new Date(),
    },
    {
      id: "3",
      firstName: "John",
      lastName: "Doe",
      username: "jd",
      profilePic: "",
      preview: "Hey, how are you?",
      updated: new Date(),
    },
    {
      id: "4",
      firstName: "John",
      lastName: "Doe",
      username: "jd",
      profilePic: "",
      preview: "Hey, how are you?",
      updated: new Date(),
    },
    {
      id: "5",
      firstName: "John",
      lastName: "Doe",
      username: "jd",
      profilePic: "",
      preview: "Hey, how are you?",
      updated: new Date(),
    },
  ];

  // Show loading indicator
  if (requestList === null) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  // Show empty if no requests
  if (requestList.length === 0) {
    return <Empty icon="notifications-none" message="No requests" />;
  }
  return (
    <View className="flex flex-1 w-full px-2">
      <SearchBar
        placeholder="Search for a user..."
        value={searchText}
        onChangeText={(text: string) => onSearch(text)}
        onRefresh={() => {
          setSearchText("");
        }}
      ></SearchBar>
      <FlatList
        data={requestList}
        renderItem={({ item }) => <RequestRow item={item} />}
        keyExtractor={(item: any) => item.id}
      />
    </View>
  );
};

export default Request;
