import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import Title from "@/components/Title";
import { fetchSignIn } from "@/services/api";
import useFetch from "@/services/useFetch";

const SignIn = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const SignInPressed = () => {
    console.log("Sign In Pressed");

    // Check username
    const failUsername = !username;
    if (failUsername) {
      setUsernameError("Username not provided");
    }
    // Check password
    const failPassword = !password;
    if (failPassword) {
      setPasswordError("Password not provided");
    }
    // Break out of this function if there were any issues
    if (failUsername || failPassword) {
      return;
    }

    // Test router
    router.push("/(tabs)");

    // // Make Sign Up request
    // const { data } = useFetch(
    //   () =>
    //     fetchSignIn({
    //       username,
    //       password,
    //     }),
    //   false
    // );

    // if (data) {
    //   console.log("Sign in successful", data);
    //   router.push("/auth/SignIn");
    // }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView behavior="height" className="flex-1">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-center px-5">
            <Title text="Message App" color="#000000" />

            <CustomInput
              placeholder="Username"
              title="Username"
              value={username}
              error={usernameError}
              setValue={setUsername}
              setError={setUsernameError}
            />

            <CustomInput
              title="Password"
              placeholder="Password"
              value={password}
              error={passwordError}
              setValue={setPassword}
              setError={setPasswordError}
              secureTextEntry={true}
            />

            <CustomButton
              title="Sign In"
              onPress={SignInPressed}
            ></CustomButton>

            <Text className="text-center mt-10">
              Don't have an account?{" "}
              <Text
                className="text-blue-500 font-semibold"
                onPress={() => router.push("/auth/SignUp")}
              >
                Sign Up
              </Text>
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;
