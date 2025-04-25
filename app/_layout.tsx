import { Stack } from "expo-router";
import "./global.css";
import { useEffect } from "react";
import useGlobal from "@/core/global";

export default function RootLayout() {
  useEffect(() => {
    useGlobal.getState().init(); // ✅ Ensures initialization runs once
  }, []);

  return (
    <Stack initialRouteName="auth/SignIn">
      <Stack.Screen
        name="auth/SignIn"
        options={{ headerShown: false }}
      ></Stack.Screen>
      <Stack.Screen
        name="auth/SignUp"
        options={{ headerShown: false }}
      ></Stack.Screen>
      <Stack.Screen
        name="auth/Verify"
        options={{ headerShown: false }}
      ></Stack.Screen>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="chat/Message" options={{ headerShown: true }} />
      <Stack.Screen
        name="chat/GroupManagement"
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="chat/Group"
        options={{ headerShown: true, title: "New Group" }}
      />
    </Stack>
  );
}
