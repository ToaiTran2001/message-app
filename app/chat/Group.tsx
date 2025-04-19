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

const FriendRowSmall = ({ item, updateFriendListForGroup }: any) => {
  const onPress = () => {
    updateFriendListForGroup(item);
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

const Group = () => {
  const { groupMember } = useLocalSearchParams();
  const parsedGroupMember = utils.parseParams(groupMember);
  const [friendListForGroup, setFriendListForGroup] =
    useState<any[]>(parsedGroupMember);

  const updateFriendListForGroup = (friend: any) => {
    const index = friendListForGroup.findIndex(
      (item: any) => item.id === friend.id
    );
    if (index > -1) {
      setFriendListForGroup((prev) =>
        prev.filter((item) => item.id !== friend.id)
      );
    } else {
      setFriendListForGroup((prev) => [...prev, friend]);
    }
  };
  const [groupName, setGroupName] = useState<string>("");
  const [groupNameError, setGroupNameError] = useState<string>("");
  const [memberListError, setMemberListError] = useState<string>("");

  const onConfirm = () => {
    if (friendListForGroup.length < 2) {
      setMemberListError("Group is as least 3 members");
      return;
    }
    setMemberListError("");
    const user = useGlobal((state) => state.user) as UserInformation;
    const token = useGlobal((state) => state.tokens);
    const userRequest = {
      id: user.id,
      token: token,
    };
    const groupInfo = {
      groupName: groupName,
      groupPic: "",
      member: friendListForGroup.map((item) => item.id),
      freeTalk: true,
      freeInvite: true,
    };
    const { data, loading, error } = useFetch(
      () => fetchCreateGroup(userRequest, groupInfo),
      false
    );

    if (error) {
      console.log("Error creating group:", error);
      return;
    }
    if (!loading) {
      console.log("Group created successfully:", data);
      // Navigate to the group chat screen or perform any other action
      router.push("/(tabs)");
    }
  };

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
          data={friendListForGroup}
          renderItem={({ item }) => (
            <FriendRowSmall
              item={item}
              updateFriendListForGroup={updateFriendListForGroup}
            />
          )}
          keyExtractor={(item) => item.id}
          numColumns={4}
        ></FlatList>
        <Text className="text-red-500 text-center mt-10">
          {memberListError}
        </Text>
        <CustomButton title="OK" onPress={onConfirm} />
      </View>
    </View>
  );
};

export default Group;
