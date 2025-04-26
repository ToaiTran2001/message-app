import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import CustomInput from "@/components/CustomInput";
import { useRouter, useLocalSearchParams, router } from "expo-router";
import Thumbnail from "@/components/Thumbnail";
import Icon from "react-native-vector-icons/MaterialIcons";
import CustomButton from "@/components/CustomButton";
import utils from "@/core/utils";
import useFetch from "@/services/useFetch";
import { fetchCreateGroup } from "@/services/api";
import useGlobal from "@/core/global";
import { UserInformation } from "@/interfaces/User";

const FriendRowSmall = ({ item, updateMemberList }: any) => {
  const onPress = () => {
    updateMemberList(item);
  };

  return (
    <TouchableOpacity
      className="m-2 justify-center items-center"
      onPress={onPress}
    >
      <View>
        <Thumbnail url={item.profilePic} size={76} />
        <View className="absolute bottom-0 right-0 bg-red-300 w-6 h-6 rounded-full items-center justify-center border-2 border-white">
          <Icon name="close" size={10} color="#2F4F4F" />
        </View>
      </View>
      <Text className="font-bold text-dark-100 mb-2">
        {item.firstName} {item.lastName}
      </Text>
    </TouchableOpacity>
  );
};

const GroupCreate = () => {
  const { members } = useLocalSearchParams();
  const parsedMembers = utils.parseParams(members);
  const [memberList, setMemberList] = useState<any[]>(parsedMembers);

  const updateMemberList = (friend: any) => {
    const index = memberList.findIndex((item: any) => item.id === friend.id);
    if (index > -1) {
      setMemberList((prev) => prev.filter((item) => item.id !== friend.id));
    } else {
      setMemberList((prev) => [...prev, friend]);
    }
  };
  const [groupName, setGroupName] = useState<string>("");
  const [groupNameError, setGroupNameError] = useState<string>("");
  const [memberListError, setMemberListError] = useState<string>("");
  const user = useGlobal((state) => state.user) as UserInformation;
  const token = useGlobal((state) => state.tokens);
  const userRequest = {
    id: user.id,
    token: token,
  };

  const groupInfo = {
    groupName: groupName,
    groupPic: "",
    member: memberList.map((item) => item.id),
    freeTalk: true,
    freeInvite: true,
  };
  const { data, loading, error, reFetch } = useFetch(
    () => fetchCreateGroup(userRequest, groupInfo),
    false
  );

  const onCreatePressed = () => {
    if (memberList?.length < 2) {
      setMemberListError("Group is as least 3 members");
      return;
    }
    setMemberListError("");
    reFetch();
  };

  useEffect(() => {
    if (data) {
      router.navigate("/(tabs)/Group");
    }
  }, [data]);

  return (
    <View className="flex-1 bg-white items-center justify-center">
      <View className="flex-1 w-full p-2">
        <CustomInput
          title="Group Name"
          placeholder="Type group name"
          value={groupName}
          error={groupNameError}
          setValue={setGroupName}
          setError={setGroupNameError}
        ></CustomInput>
        <Text className="text-base text-xl font-semibold mb-1">
          Member List
        </Text>
        <FlatList
          data={memberList}
          renderItem={({ item }) => (
            <FriendRowSmall item={item} updateMemberList={updateMemberList} />
          )}
          keyExtractor={(item) => item.id}
          numColumns={4}
        ></FlatList>
        <Text className="text-red-500 text-center mt-10">
          {memberListError}
        </Text>
        <CustomButton title="OK" onPress={onCreatePressed} />
      </View>
    </View>
  );
};

export default GroupCreate;
