import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { Tabs } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import useGlobal from "@/core/global";

const TabIcon = ({ focused, title, icon }: any) => {
  return (
    <View className="flex flex-row w-full flex-1 min-w-[80px] items-center justify-center overflow-hidden">
      <Icon
        name={icon}
        size={16}
        style={{ color: focused ? "#87CEFA" : "#000000" }}
      ></Icon>
      <Text
        className="ml-2 font-bold"
        style={{ color: focused ? "#87CEFA" : "#000000" }}
      >
        {title}
      </Text>
    </View>
  );
};

const _Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          backgroundColor: "white",
          position: "absolute",
          overflow: "hidden",
          borderTopWidth: 1,
          borderTopColor: "#ccc",
          height: 60,
        },
      }}
      initialRouteName="index"
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <>
              <TabIcon focused={focused} title="Home" icon="home" />
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="Request"
        options={{
          title: "Request",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <>
              <TabIcon
                focused={focused}
                title="Request"
                icon="mark-as-unread"
              />
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <>
              <TabIcon focused={focused} title="Profile" icon="person" />
            </>
          ),
        }}
      />
    </Tabs>
  );
};

export default _Layout;
