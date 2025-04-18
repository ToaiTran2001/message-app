import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Thumbnail from "@/components/Thumbnail";
import { launchImageLibrary } from "react-native-image-picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import useGlobal from "@/core/global";
import { UserInformation } from "@/interfaces/User";

interface ProfileImageProps {
  profilePic: string;
}

const ProfileImage = ({ profilePic }: ProfileImageProps) => {
  const uploadThumbnail = useGlobal((state) => state.uploadThumbnail);
  return (
    <TouchableOpacity
      className="mb-10"
      onPress={() => {
        // launchImageLibrary(
        //   {
        //     includeBase64: true,
        //     mediaType: "photo",
        //   },
        //   (response) => {
        //     if (response.didCancel) return;
        //     if (!response.assets) return;
        //     const file = response.assets[0];
        //     uploadThumbnail(file);
        //   }
        // );
      }}
    >
      <Thumbnail url={profilePic} size={180} />
      <View className="absolute bottom-0 right-0 bg-primary w-10 h-10 rounded-full items-center justify-center border-2 border-white">
        <Icon name="colorize" size={15} color="#2F4F4F" />
      </View>
    </TouchableOpacity>
  );
};

const ProfileLogout = () => {
  const logout = useGlobal((state) => state.logout);

  return (
    <TouchableOpacity
      onPress={() => {
        logout();
      }}
      className="flex-row items-center justify-center h-14 rounded-full bg-primary px-10 mt-10"
    >
      <Icon className="mr-3" name="logout" size={20} color="#2F4F4F" />
      <Text className="font-bold text-dark-100">Logout</Text>
    </TouchableOpacity>
  );
};

const Profile = () => {
  const user = useGlobal((state) => state.user) as UserInformation;
  // const user = {
  //   firstName: "John",
  //   lastName: "Doe",
  //   username: "johndoe",
  //   profilePic: "",
  // };
  return (
    <View className="flex-1 items-center justify-center bg-white px-5">
      <ProfileImage profilePic={user.profilePic} />

      <Text className="text-center text-dark-100 font-bold text-2xl mb-2">
        {user.firstName} {user.lastName}
      </Text>
      <Text className="text-center text-dark-400 text-base mb-2">
        @{user.username}
      </Text>

      <ProfileLogout />
    </View>
  );
};

export default Profile;
