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
import {
  Redirect,
  router,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  fetchFriends,
  fetchGroups,
  fetchLeaveGroup,
  fetchSearch,
} from "@/services/api";
import useFetch from "@/services/useFetch";
import Thumbnail from "@/components/Thumbnail";
import Cell from "@/components/Cell";
import AddButton from "@/components/AddButton";
import FloatButton from "@/components/FloatButton";
import useGlobal from "@/core/global";
import utils from "@/core/utils";
import { UserInformation } from "@/interfaces/User";
import useAuth from "@/core/useAuth";
import LoadComponent from "@/components/LoadComponent";
import LeaveButton from "@/components/LeaveButton";

const DisplayRow = ({ navigation, item, group, onPressLeave }: any) => {
  const user = useGlobal((state) => state.user) as UserInformation;
  const token = useGlobal((state) => state.tokens) as string;
  const userRequest = {
    id: user.id,
    token: token,
  };
  const [leave, setLeave] = useState(false);

  const onLeave = () => {
    setLeave(true);
  };

  const { data, loading, error, reFetch } = useFetch(
    () => fetchLeaveGroup(userRequest, { groupId: item.group_id }),
    false
  );

  useEffect(() => {
    if (leave) {
      reFetch();
      if (!loading) {
        onPressLeave();
      }
    }
  }, [leave]);

  if (loading) return <LoadComponent />;

  return (
    <TouchableOpacity
      onPress={() => {
        // navigation.navigate("Messages", item);
        router.push({
          pathname: "/chat/Message",
          params: { item: JSON.stringify(item) },
        });
      }}
    >
      <Cell>
        <Thumbnail url={item.group_pic} size={76} />
        <View className="flex-1 px-4">
          <Text className="font-bold text-dark-100 mb-2">
            {item.group_name}
          </Text>
          {/* <Text className="text-dark-400 text-sm">{item.preview}</Text> */}
          <Text className="text-sm text-dark-500">
            {utils.formatTime(item.created_at)}
          </Text>
        </View>
        <LeaveButton onLeave={onLeave} />
      </Cell>
    </TouchableOpacity>
  );
};

const Group = ({ navigation }: any) => {
  const user = useGlobal((state) => state.user) as UserInformation;
  const token = useGlobal((state) => state.tokens) as string;
  const initialized = useGlobal((state) => state.initialized);
  const [displayList, setDisplayList] = useState([]);
  const [groupListChange, setGroupListChange] = useState(false);

  const route = useRouter();

  const userRequest = {
    id: user.id,
    token: token,
  };

  const {
    data: groups,
    loading: groupsLoading,
    error: groupsError,
    reFetch: groupReFetch,
  } = useFetch(() => fetchGroups(userRequest), false);

  const [searchText, setSearchText] = useState("");
  const {
    data: searchResults,
    loading: searchLoading,
    error: searchError,
    reFetch: refetchSearch,
    reset,
  } = useFetch(() => fetchSearch(userRequest, searchText), false);

  const onSearch = (text: string) => {
    console.log("Search input");
    setSearchText(text);
  };

  const onPressLeave = () => {
    setGroupListChange(true);
  };

  useEffect(() => {
    if (groupListChange) {
      groupReFetch();
      if (!groupsLoading) {
        setGroupListChange(false);
      }
    }
  }, [groupListChange]);

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
  };

  useEffect(() => {
    if (searchText && searchText.length > 0) {
      setDisplayList(searchResults as []);
    } else {
      setDisplayList(groups === null ? [] : (groups as []));
    }
  }, [groups, searchResults]);

  useEffect(() => {
    if (token) {
      groupReFetch();
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      if (token) {
        groupReFetch();
      }
    }, [token])
  );

  if (groupsLoading) return <LoadComponent />;

  if (groupsError) {
    return (
      <Text className="text-red-500 text-center mt-10">
        {groupsError.message}
      </Text>
    );
  }

  return (
    <View className="flex-1 bg-white items-center justify-center">
      <View className="flex-1 w-full px-2">
        <SearchBar
          placeholder="Search for your group..."
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
          <>
            <FlatList
              data={displayList}
              renderItem={({ item }) => (
                <DisplayRow
                  navigation={navigation}
                  item={item}
                  group={group}
                  onPressLeave={onPressLeave}
                />
              )}
              keyExtractor={(item: any) => {
                return item.group_id;
              }}
            />
          </>
        )}
      </View>
    </View>
  );
};

export default Group;
