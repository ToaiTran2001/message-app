import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Cell from "@/components/Cell";
import Thumbnail from "@/components/Thumbnail";
import Empty from "@/components/Empty";
import useFetch from "@/services/useFetch";
import {
  fetchFriends,
  fetchPendingList,
  fetchSearch,
  fetchSendRequest,
  fetchSendResponse,
} from "@/services/api";
import { UserInformation, UserVerifyAccountRequest } from "@/interfaces/User";
import { SendRequest, SendResponse } from "@/interfaces/Request";
import useGlobal from "@/core/global";
import SearchBar from "@/components/SearchBar";
import utils from "@/core/utils";
import LoadComponent from "@/components/LoadComponent";
import { useFocusEffect } from "expo-router";

const ACCEPT_TYPE = "accepted";
const REJECT_TYPE = "rejected";
const ADD_TYPE = "add";

interface RequestAcceptProps {
  friendId: string;
  responseStatus: string;
  color: string;
  onPress: (value: string) => void;
  clickValue: string;
}
const RequestAccept = ({
  friendId,
  responseStatus,
  color,
  onPress,
  clickValue,
}: RequestAcceptProps) => {
  const user = useGlobal((state) => state.user) as UserInformation;
  const token = useGlobal((state) => state.tokens) as string;
  const userRequest = {
    id: user.id,
    token: token,
  };
  const { data, loading, error, reFetch } = useFetch(
    () =>
      fetchSendResponse(userRequest, {
        friendId: friendId,
        responseStatus: responseStatus,
      }),
    false
  );

  const handleOnPress = () => {
    if (clickValue === "") {
      reFetch();
    }
    onPress(responseStatus);
  };

  if (loading) {
    return <LoadComponent />;
  }

  return (
    <TouchableOpacity
      className="px-2 h-10 w-20 rounded-[6px] items-center justify-center my-1"
      style={{ backgroundColor: clickValue !== "" ? "#ADB5BD" : color }}
      onPress={handleOnPress}
    >
      <Text className="text-black font-bold">
        {responseStatus === ACCEPT_TYPE ? "Accept" : "Reject"}
      </Text>
    </TouchableOpacity>
  );
};

interface RequestCreateProps {
  friendId: string;
  isFriend: boolean;
  clickValue: string;
  onPress: (value: string) => void;
}
const RequestCreate = ({
  friendId,
  isFriend,
  clickValue,
  onPress,
}: RequestCreateProps) => {
  const user = useGlobal((state) => state.user) as UserInformation;
  const token = useGlobal((state) => state.tokens) as string;
  const userRequest = {
    id: user.id,
    token: token,
  };

  const { data, loading, error, reFetch } = useFetch(
    () => fetchSendRequest(userRequest, { friendId: friendId }),
    false
  );

  const handleOnPress = (value: string) => {
    if (!isFriend) {
      reFetch();
    }
    onPress(value);
  };
  if (loading) {
    return <LoadComponent />;
  }
  return (
    <TouchableOpacity
      className="px-2 h-10 w-20 rounded-[6px] items-center justify-center my-1"
      style={{
        backgroundColor: isFriend || clickValue !== "" ? "#ADB5BD" : "#87CEFA",
      }}
      onPress={() => handleOnPress(ADD_TYPE)}
    >
      <Text className="text-white font-bold">
        {isFriend ? "Friend" : "Add"}
      </Text>
    </TouchableOpacity>
  );
};

interface RequestRowProps {
  item: any;
}
const RequestRow = ({ item }: RequestRowProps) => {
  const [clickValue, setClickValue] = useState("");
  const onPress = (value: string) => {
    setClickValue(value);
  };
  return (
    <Cell>
      <Thumbnail url={item.profilePic} size={76} />
      <View className="flex-1 flex-row px-4">
        <Text className="font-bold text-dark-100 mb-2">{item.firstName} </Text>
        <Text className="font-bold text-dark-100 mb-2">{item.lastName}</Text>
      </View>

      {item && item.request ? (
        <>
          <View>
            {clickValue === ACCEPT_TYPE ? (
              <RequestAccept
                friendId={item.id}
                responseStatus={ACCEPT_TYPE}
                color="#98FB98"
                onPress={(value: string) => onPress(value)}
                clickValue={clickValue}
              />
            ) : clickValue === REJECT_TYPE ? (
              <RequestAccept
                friendId={item.id}
                responseStatus={REJECT_TYPE}
                color="#FF7F7F"
                onPress={(value: string) => onPress(value)}
                clickValue={clickValue}
              />
            ) : (
              <>
                <RequestAccept
                  friendId={item.id}
                  responseStatus={ACCEPT_TYPE}
                  color="#98FB98"
                  onPress={(value: string) => onPress(value)}
                  clickValue={clickValue}
                />
                <RequestAccept
                  friendId={item.id}
                  responseStatus={REJECT_TYPE}
                  color="#FF7F7F"
                  onPress={(value: string) => onPress(value)}
                  clickValue={clickValue}
                />
              </>
            )}
          </View>
        </>
      ) : item.isFriend ? (
        <RequestCreate
          friendId={item.id}
          isFriend={true}
          onPress={(value: string) => onPress(value)}
          clickValue={clickValue}
        />
      ) : (
        <RequestCreate
          friendId={item.id}
          isFriend={false}
          onPress={onPress}
          clickValue={clickValue}
        />
      )}
    </Cell>
  );
};

const Request = () => {
  const user = useGlobal((state) => state.user) as UserInformation;
  const token = useGlobal((state) => state.tokens) as string;
  const userRequest = {
    id: user.id,
    token: token,
  };
  const [friendList, setFriendList] = useState<any[]>([]);
  const [pendingList, setPendingList] = useState<any[]>([]);
  const [requestList, setRequestList] = useState<any[]>([]); // Placeholder for requestList, replace with actual data fetching logic
  const {
    data: pendings,
    loading: pendingsLoading,
    error: pendingsError,
    reFetch: pendingsReFetch,
  } = useFetch(() => fetchPendingList(userRequest), true);

  const {
    data: friends,
    loading: friendsLoading,
    error: friendsError,
    reFetch: friendsReFetch,
  } = useFetch(() => fetchFriends(userRequest), false);

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
  };

  useEffect(() => {
    if (searchText && searchText.length > 0) {
      let searchResultsTemp = searchResults as [];
      searchResultsTemp.forEach((item: any) => {
        if (item) {
          const index = pendingList.findIndex(
            (user: any) => user.id === item.id
          );
          if (index > -1) {
            item.request = true;
          } else {
            item.request = false;
          }
        }
        if (item) {
          const index = friendList.findIndex(
            (user: any) => user.id === item.id
          );
          if (index > -1) {
            item.isFriend = true;
          } else {
            item.isFriend = false;
          }
        }
      });

      setRequestList(searchResultsTemp);
    } else {
      pendingList.forEach((item: any) => {
        if (item) {
          item.request = true;
        }
      });
      setRequestList(pendingList);
    }
  }, [pendings, friends, searchResults]);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchText && searchText.length > 0) {
        await refetchSearch();
      } else {
        reset();
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchText]);

  useEffect(() => {
    if (token) {
      friendsReFetch();
      pendingsReFetch();
    }
  }, [token]);

  useEffect(() => {
    if (friends) {
      const tempList = friends as [];
      setFriendList(tempList);
    }
  }, [friends]);

  useEffect(() => {
    if (pendings) {
      const tempList = pendings as [];
      setPendingList(tempList);
      tempList.forEach((item: any) => {
        if (item) {
          item.request = true;
        }
      });
      setRequestList(tempList);
    }
  }, [pendings]);

  useFocusEffect(
    useCallback(() => {
      friendsReFetch();
      pendingsReFetch();
    }, [])
  );

  // let requestList = [
  //   {
  //     id: "1",
  //     firstName: "A",
  //     lastName: "Nguyen",
  //     username: "jd",
  //     profilePic: "",
  //     preview: "Hey, how are you?",
  //     updated: new Date(),
  //     request: true,
  //   },
  //   {
  //     id: "2",
  //     firstName: "B",
  //     lastName: "Tran",
  //     username: "jd",
  //     profilePic: "",
  //     preview: "Hey, how are you?",
  //     updated: new Date(),
  //     request: true,
  //   },
  //   {
  //     id: "3",
  //     firstName: "C",
  //     lastName: "Nguyen",
  //     username: "jd",
  //     profilePic: "",
  //     preview: "Hey, how are you?",
  //     updated: new Date(),
  //     request: true,
  //   },
  //   {
  //     id: "4",
  //     firstName: "D",
  //     lastName: "Nguyen",
  //     username: "jd",
  //     profilePic: "",
  //     preview: "Hey, how are you?",
  //     updated: new Date(),
  //     request: true,
  //   },
  //   {
  //     id: "5",
  //     firstName: "E",
  //     lastName: "Tran",
  //     username: "jd",
  //     profilePic: "",
  //     preview: "Hey, how are you?",
  //     updated: new Date(),
  //     request: true,
  //   },
  // ];

  // Show loading indicator
  if (searchLoading || friendsLoading || pendingsLoading) {
    return <LoadComponent />;
  }

  // Show empty if no requests
  if (
    requestList &&
    requestList.length === 0 &&
    (!searchText || searchText.length === 0)
  ) {
    return (
      <View className="flex flex-1 w-full px-2 bg-white">
        <SearchBar
          placeholder="Search for a user..."
          value={searchText}
          onChangeText={(text: string) => onSearch(text)}
          onRefresh={() => {
            setSearchText("");
          }}
        ></SearchBar>
        <Empty icon="notifications-none" message="No requests" />
      </View>
    );
  }
  return (
    <View className="flex flex-1 w-full px-2 bg-white">
      <SearchBar
        placeholder="Search for a user..."
        value={searchText}
        onChangeText={(text: string) => onSearch(text)}
        onRefresh={() => {
          setSearchText("");
        }}
      ></SearchBar>
      {searchLoading ? (
        <LoadComponent />
      ) : searchError ? (
        <Text className="text-red-500 text-center mt-10">
          {searchError.message}
        </Text>
      ) : (
        <FlatList
          data={requestList}
          renderItem={({ item }) => <RequestRow item={item} />}
          keyExtractor={(item: any) => item.id}
        />
      )}
    </View>
  );
};

export default Request;
