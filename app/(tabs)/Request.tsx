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
  fetchSendRequest,
  fetchSendResponse,
} from "@/services/api";
import { UserInformation, UserVerifyAccountRequest } from "@/interfaces/User";
import { SendRequest, SendResponse } from "@/interfaces/Request";
import useGlobal from "@/core/global";
import SearchBar from "@/components/SearchBar";
import utils from "@/core/utils";

const ACCEPT = "accepted";
const REJECT = "rejected";
const ADD = "add";

interface RequestAcceptProps {
  friendId: string;
  responseStatus: string;
  color: string;
  reload: () => void;
}
const RequestAccept = ({
  friendId,
  responseStatus,
  color,
  reload,
}: RequestAcceptProps) => {
  const requestAccept = useGlobal((state) => state.requestAccept);
  const user = useGlobal((state) => state.user) as UserInformation;
  const token = useGlobal((state) => state.tokens) as string;
  // const user: UserInformation = {
  //   id: 11,
  //   username: "huyngu1991",
  //   email: "huyxida001@gmail.com",
  //   firstName: "Huy",
  //   lastName: "Tran",
  //   profilePic: "",
  //   dob: "2025-04-19",
  // };

  // const token =
  //   "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJUSEVfSVNTVUVSIiwiYXVkIjoiVEhFX0FVRElFTkNFIiwiaWF0IjoxNzQ1MDI5MDMxLCJuYmYiOjE3NDUwMjkwMzEsImV4cCI6MTc1MDIxMzAzMSwiZGF0YSI6eyJpZCI6MTEsImVtYWlsIjoiaHV5eGlkYTAwMUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6Imh1eW5ndTE5OTEifX0.v7uTaleO12zOqdz50wq0_zYgYDZDJGCz7OcKrCwdX6M";
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
    reload();
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

interface RequestCreateProps {
  friendId: string;
}
const RequestCreate = ({ friendId }: RequestCreateProps) => {
  const user = useGlobal((state) => state.user) as UserInformation;
  const token = useGlobal((state) => state.tokens) as string;

  // const user: UserInformation = {
  //   id: 11,
  //   username: "huyngu1991",
  //   email: "huyxida001@gmail.com",
  //   firstName: "Huy",
  //   lastName: "Tran",
  //   profilePic: "",
  //   dob: "2025-04-19",
  // };

  // const token =
  //   "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJUSEVfSVNTVUVSIiwiYXVkIjoiVEhFX0FVRElFTkNFIiwiaWF0IjoxNzQ1MDI5MDMxLCJuYmYiOjE3NDUwMjkwMzEsImV4cCI6MTc1MDIxMzAzMSwiZGF0YSI6eyJpZCI6MTEsImVtYWlsIjoiaHV5eGlkYTAwMUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6Imh1eW5ndTE5OTEifX0.v7uTaleO12zOqdz50wq0_zYgYDZDJGCz7OcKrCwdX6M";
  const [isClick, setIsClick] = useState(false);
  const { data, loading, error, reFetch } = useFetch(
    () =>
      fetchSendRequest(
        {
          token: token,
          id: user.id,
        },
        { friendId: friendId }
      ),
    false
  );
  const handleOnPress = () => {
    reFetch();
    setIsClick(true);
  };
  return (
    <TouchableOpacity
      className="bg-primary px-4 h-10 rounded-xl items-center justify-center my-1"
      onPress={() => (isClick ? null : handleOnPress)}
    >
      <Text className="text-white font-bold">{ADD}</Text>
    </TouchableOpacity>
  );
};

interface RequestRowProps {
  item: any;
  reload: () => void;
}
const RequestRow = ({ item, reload }: any) => {
  const message = "Requested to connect with you";
  //const time = '7m ago'

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
            <RequestAccept
              friendId={item.id}
              responseStatus={ACCEPT}
              color="#32CD32"
              reload={reload}
            />
            <RequestAccept
              friendId={item.id}
              responseStatus={REJECT}
              color="#FF0000"
              reload={reload}
            />
          </View>
        </>
      ) : (
        <>
          <RequestCreate friendId={item.id} />
        </>
      )}
    </Cell>
  );
};

const Request = () => {
  const user = useGlobal((state) => state.user) as UserInformation;
  const tokens = useGlobal((state) => state.tokens) as string;

  // const user: UserInformation = {
  //   id: 11,
  //   username: "huyngu1991",
  //   email: "huyxida001@gmail.com",
  //   firstName: "Huy",
  //   lastName: "Tran",
  //   profilePic: "",
  //   dob: "2025-04-19",
  // };

  // const tokens =
  //   "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJUSEVfSVNTVUVSIiwiYXVkIjoiVEhFX0FVRElFTkNFIiwiaWF0IjoxNzQ1MDI5MDMxLCJuYmYiOjE3NDUwMjkwMzEsImV4cCI6MTc1MDIxMzAzMSwiZGF0YSI6eyJpZCI6MTEsImVtYWlsIjoiaHV5eGlkYTAwMUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6Imh1eW5ndTE5OTEifX0.v7uTaleO12zOqdz50wq0_zYgYDZDJGCz7OcKrCwdX6M";
  const userRequest = {
    id: user.id,
    token: tokens,
  };

  const [requestList, setRequestList] = useState<any[]>([]); // Placeholder for requestList, replace with actual data fetching logic

  const { data, loading, error, reFetch } = useFetch(
    () => fetchPendingList(userRequest),
    true
  );

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
      let dataTemp: any[] = [];
      if (data) {
        dataTemp = [].concat(data as []);
      }

      let searchResultsTemp = searchResults as [];
      searchResultsTemp.forEach((item: any) => {
        if (item) {
          const index = dataTemp.findIndex((user: any) => user.id === item.id);
          if (index > -1) {
            item.request = true;
          }
        }
      });
      setRequestList(searchResultsTemp);
    } else {
      let dataTemp: any[] = [];
      if (data) {
        dataTemp = [].concat(data as []);
      }
      dataTemp.forEach((item: any) => {
        if (item) {
          item.request = true;
        }
      });
      setRequestList(dataTemp);
    }
  }, [data, searchResults]);

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

  const handleReload = () => {
    reFetch();
  };

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
  if (searchLoading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  // Show empty if no requests
  if (
    requestList &&
    requestList.length === 0 &&
    searchText &&
    searchText.length === 0
  ) {
    return <Empty icon="notifications-none" message="No requests" />;
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
      <FlatList
        data={requestList}
        renderItem={({ item }) => (
          <RequestRow item={item} reload={handleReload} />
        )}
        keyExtractor={(item: any) => item.id}
      />
    </View>
  );
};

export default Request;
