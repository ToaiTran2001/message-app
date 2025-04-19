import SearchBar from "@/components/SearchBar";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { Redirect, router, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { fetchFriends, fetchGroups, fetchSearch } from "@/services/api";
import useFetch from "@/services/useFetch";
import Thumbnail from "@/components/Thumbnail";
import Cell from "@/components/Cell";
import AddButton from "@/components/AddButton";
import FloatButton from "@/components/FloatButton";
import useGlobal from "@/core/global";
import utils from "@/core/utils";
import { UserInformation } from "@/interfaces/User";

const DisplayRow = ({
  navigation,
  item,
  group,
  updateFriendListForGroup,
}: any) => {
  const [isClick, setIsClick] = useState(false);

  const onPress = () => {
    setIsClick(!isClick);
    updateFriendListForGroup(item);
  };

  useEffect(() => {
    setIsClick(false);
  }, [group]);

  return (
    <TouchableOpacity
      onPress={() => {
        // navigation.navigate("Messages", item);
        router.push({
          pathname: "/chat/Message",
          params: { id: item.id, friend: JSON.stringify(item) },
        });
      }}
    >
      <Cell>
        <Thumbnail url={item.profilePic} size={76} />
        <View className="flex-1 px-4">
          <Text className="font-bold text-dark-100 mb-2">
            {item.firstName} {item.lastName}
          </Text>
          <Text className="text-dark-400 text-sm">{item.preview}</Text>
          <Text className="text-sm text-dark-500">
            {utils.formatTime(item.updated)}
          </Text>
        </View>
        {group && item.username && (
          <AddButton isClick={isClick} onPress={onPress} />
        )}
      </Cell>
    </TouchableOpacity>
  );
};

export default function Index({ navigation }: any) {
  const [displayList, setDisplayList] = useState([]);

  const route = useRouter();

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

  if (!user || !tokens) {
    return <Redirect href="/auth/SignIn" />;
  }
  const userRequest = {
    id: user.id,
    token: tokens,
  };

  const {
    data: friends,
    loading: friendsLoading,
    error: friendsError,
  } = useFetch(() => fetchFriends(userRequest), true);

  const {
    data: groups,
    loading: groupsLoading,
    error: groupsError,
  } = useFetch(() => fetchGroups(userRequest), true);

  const [searchText, setSearchText] = useState("");
  const {
    data: searchResults,
    loading: searchLoading,
    error: searchError,
    reFetch: refetchSearch,
    reset,
  } = useFetch(() => fetchSearch(userRequest, searchText), false);

  // let displayList = [
  //   {
  //     id: "1",
  //     firstName: "Hien",
  //     lastName: "Nguyen",
  //     username: "hiennguyen",
  //     profilePic: "",
  //     preview: "Hey, how are you?",
  //     updated: new Date(),
  //   },
  //   {
  //     id: "2",
  //     firstName: "Toai",
  //     lastName: "Tran",
  //     username: "toaitran",
  //     profilePic: "",
  //     preview: "Hey, how are you?",
  //     updated: new Date(),
  //   },
  //   {
  //     id: "3",
  //     firstName: "Linh",
  //     lastName: "Nguyen",
  //     username: "linhnguyen",
  //     profilePic: "",
  //     preview: "Hey, how are you?",
  //     updated: new Date(),
  //   },
  //   {
  //     id: "4",
  //     firstName: "Loi",
  //     lastName: "Nguyen",
  //     username: "loinguyen",
  //     profilePic: "",
  //     preview: "Hey, how are you?",
  //     updated: new Date(),
  //   },
  //   // {
  //   //   id: "5",
  //   //   firstName: "Huy",
  //   //   lastName: "Tran",
  //   //   username: "huytran",
  //   //   profilePic: "",
  //   //   preview: "Hey, how are you?",
  //   //   updated: new Date(),
  //   // },
  // ];

  const onSearch = (text: string) => {
    console.log("Search pressed");
    setSearchText(text);
  };

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

  const [group, setGroup] = useState(false);
  const handleGroupPressed = () => {
    setGroup(!group);
    setFriendListForGroup([]);
  };

  const [friendListForGroup, setFriendListForGroup] = useState<any[]>([]);
  const updateFriendListForGroup = (friend: any) => {
    const index = friendListForGroup.findIndex((item) => item.id === friend.id);
    if (index > -1) {
      setFriendListForGroup((prev) =>
        prev.filter((item) => item.id !== friend.id)
      );
    } else {
      setFriendListForGroup((prev) => [...prev, friend]);
    }
  };

  useEffect(() => {
    if (searchText && searchText.length > 0) {
      setDisplayList(searchResults as []);
    } else {
      setDisplayList(
        []
          .concat(friends === null ? [] : (friends as []))
          .concat(groups === null ? [] : (groups as []))
      );
    }
  }, [friends, groups, searchResults]);

  return (
    <View className="flex-1 bg-white items-center justify-center">
      {friendsLoading || groupsLoading ? (
        <ActivityIndicator
          size="large"
          color="#000000"
          className="mt-10 self-center"
        />
      ) : friendsError ? (
        <Text className="text-red-500 text-center mt-10">
          {friendsError.message}
        </Text>
      ) : groupsError ? (
        <Text className="text-red-500 text-center mt-10">
          {groupsError.message}
        </Text>
      ) : (
        <View className="flex-1 w-full px-2">
          <SearchBar
            placeholder="Search for your friend or group..."
            value={searchText}
            onChangeText={(text: string) => onSearch(text)}
            onRefresh={() => {
              setSearchText("");
            }}
          ></SearchBar>
          {searchLoading ? (
            <ActivityIndicator
              size="large"
              color="#000000"
              className="mt-10 self-center"
            />
          ) : searchError ? (
            <Text className="text-red-500 text-center mt-10">
              {searchError.message}
            </Text>
          ) : (
            <>
              <FlatList
                data={displayList}
                renderItem={({ item }) => (
                  <DisplayRow
                    navigation={navigation}
                    item={item}
                    group={group}
                    updateFriendListForGroup={updateFriendListForGroup}
                  />
                )}
                keyExtractor={(item: any) => item.id}
              />

              <View className="flex-1 flex-row absolute bottom-24 right-5 z-10">
                <FloatButton
                  title="Group"
                  icon="add"
                  isPressed={group}
                  handlePress={handleGroupPressed}
                />

                {friendListForGroup.length > 1 && (
                  <FloatButton
                    title="Next"
                    icon="navigate-next"
                    isPressed={false}
                    handlePress={() => {
                      router.push({
                        pathname: "/chat/Group",
                        params: {
                          groupMember: JSON.stringify(friendListForGroup),
                        },
                      });
                    }}
                  />
                )}
              </View>
            </>
          )}
        </View>
      )}
    </View>
  );
}
