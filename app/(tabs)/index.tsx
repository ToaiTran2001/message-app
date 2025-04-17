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
import { Redirect, router, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { fetchFriends, fetchSearch } from "@/services/api";
import useFetch from "@/services/useFetch";
import Thumbnail from "@/components/Thumbnail";
import Cell from "@/components/Cell";
import AddButton from "@/components/AddButton";
import FloatButton from "@/components/FloatButton";

const FriendRow = ({
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
          params: { id: item.id },
        });
      }}
    >
      <Cell>
        <Thumbnail url={item.friend.thumbnail} size={76} />
        <View className="flex-1 px-4">
          <Text className="font-bold text-dark-100 mb-2">
            {item.friend.name}
          </Text>
          <Text className="text-dark-400 text-sm">{item.preview}</Text>
          <Text className="text-sm text-dark-500">
            Time
            {/* {utils.formatTime(item.updated)} */}
          </Text>
        </View>
        {group && <AddButton isClick={isClick} onPress={onPress} />}
      </Cell>
    </TouchableOpacity>
  );
};

export default function Index({ navigation }: any) {
  // const [token, setToken] = useState<string | null>(null);

  // // Check if the token is stored in local storage
  // useEffect(() => {
  //   const storedToken = localStorage.getItem("token");
  //   if (storedToken) {
  //     setToken(storedToken);
  //   } else {
  //     console.log("Token not found");
  //   }
  // }, []);

  // if (!token) {
  //   console.log("Token not found");
  //   return <Redirect href="../auth/SignIn" />;
  // }

  const route = useRouter();

  const {
    data: friends,
    loading,
    error,
  } = useFetch(() => fetchFriends("1"), false);

  const [searchText, setSearchText] = useState("");
  const {
    data: searchResults,
    loading: searchLoading,
    error: searchError,
    reFetch: refetchSearch,
    reset,
  } = useFetch(() => fetchSearch("1", searchText), false);

  let friendList = [
    {
      id: "1",
      friend: {
        name: "John Doe",
        thumbnail: "",
      },
      preview: "Hey, how are you?",
      updated: new Date(),
    },
    {
      id: "2",
      friend: {
        name: "Jane Smith",
        thumbnail: "",
      },
      preview: "Let's catch up soon!",
      updated: new Date(),
    },
    {
      id: "3",
      friend: {
        name: "Alice Johnson",
        thumbnail: "",
      },
      preview: "Did you finish the project?",
      updated: new Date(),
    },
    {
      id: "4",
      friend: {
        name: "Bob Brown",
        thumbnail: "",
      },
      preview: "Looking forward to the weekend!",
      updated: new Date(),
    },
    {
      id: "5",
      friend: {
        name: "Charlie Green",
        thumbnail: "",
      },
      preview: "Can you send me the files?",
      updated: new Date(),
    },
  ];

  const onSearch = (text: string) => {
    console.log("Search pressed");
    setSearchText(text);
    // if (searchText.length > 0) {
    //   friendList = searchResults;
    // } else {
    //   friendList = friends;
    // }
  };

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchText.length > 0) {
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

  return (
    <View className="flex-1 bg-white items-center justify-center">
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#000000"
          className="mt-10 self-center"
        />
      ) : error ? (
        <Text className="text-red-500 text-center mt-10">{error.message}</Text>
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
                data={friendList}
                renderItem={({ item }) => (
                  <FriendRow
                    navigation={navigation}
                    item={item}
                    group={group}
                    updateFriendListForGroup={updateFriendListForGroup}
                  />
                )}
                keyExtractor={(item) => item.id}
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
