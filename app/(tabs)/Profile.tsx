import { View, Text, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Thumbnail from "@/components/Thumbnail";
import { launchImageLibrary } from "react-native-image-picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import useGlobal from "@/core/global";
import { UserInformation } from "@/interfaces/User";
import useFetch from "@/services/useFetch";
import { fetchSignOut, fetchUploadPicture } from "@/services/api";
import * as ImagePicker from "expo-image-picker";
import { Redirect, router, useFocusEffect } from "expo-router";

interface ProfileImageProps {
  profilePic: string;
}

const ProfileImage = ({ profilePic }: ProfileImageProps) => {
  const user = useGlobal((state) => state.user) as UserInformation;
  const token = useGlobal((state) => state.tokens) as string;
  const userRequest = {
    id: user.id,
    token: token,
  };

  const [selectedImage, setSelectedImage] = useState<string>(profilePic);
  // Upload request
  const { data, loading, error, reFetch } = useFetch(
    () =>
      fetchUploadPicture(userRequest, {
        pictureUri: selectedImage,
      }),
    false
  );

  const uploadPicture = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    if (selectedImage) {
      reFetch();
    }
  }, [selectedImage]);

  return (
    <TouchableOpacity className="mb-10" onPress={uploadPicture}>
      <Thumbnail url={selectedImage} size={180} />
      <View className="absolute bottom-0 right-0 bg-primary w-10 h-10 rounded-full items-center justify-center border-2 border-white">
        <Icon name="colorize" size={15} color="#2F4F4F" />
      </View>
    </TouchableOpacity>
  );
};

const ProfileLogout = () => {
  const logout = useGlobal((state) => state.logout);
  // Logout request
  const { data, loading, error, reFetch } = useFetch(
    () => fetchSignOut(),
    false
  );

  return (
    <TouchableOpacity
      onPress={async () => {
        await reFetch();
        logout();
        router.navigate("/auth/SignIn");
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

  useFocusEffect(useCallback(() => {}, []));

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
